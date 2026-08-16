import { generateLogo, generateCard, generateCardBack, designOptions, sanitizeSVG } from './logo.js'

const TR_MAP = { ä: 'a', ç: 'ch', ň: 'n', ö: 'o', ş: 'sh', ü: 'u', ý: 'y', ž: 'zh' }
function toLatin(s = '') {
  return String(s).replace(/[äçňöşüýžÄÇŇÖŞÜÝŽ]/g, (ch) => TR_MAP[ch.toLowerCase()] || ch)
}

const INDUSTRY_EN = {
  Telekeçilik: 'Business Consulting',
  Senagat: 'Manufacturing Industry',
  Logistika: 'Logistics & Delivery',
  Saglyk: 'Healthcare',
  'Iýmit': 'Food Products',
  Gurluşyk: 'Construction',
  Suratçylyk: 'Photo & Video',
  Wideooperator: 'Video Production',
  Studio: 'Studio',
  Dizaýn: 'Design & Creative',
  Atelýe: 'Tailoring & Fashion',
  Gözellik: 'Beauty Salon',
  Sport: 'Sports & Fitness',
  Bilim: 'Education',
  Turizm: 'Tourism',
  Awto: 'Automotive',
  Restoran: 'Restaurant & Coffee',
  Mebel: 'Furniture',
  Beýleki: 'Services',
}

const COLOR_EN = {
  Fiolet: 'purple',
  Mawi: 'blue',
  Gök: 'cyan',
  Gyzyl: 'red',
  'Ýaşyl': 'green',
  'Gara-ak': 'black and white',
  Gülgüne: 'pink',
  Narynjy: 'orange',
  Altyn: 'gold',
  Gökmawy: 'indigo',
  Meniw: 'violet',
  Söhbet: 'teal',
  'Ýakyn': 'yellow',
  Goňur: 'brown',
  Gümüş: 'silver',
  Reňkli: 'colorful',
}

function listCredentials() {
  const pairs = []
  const push = (token, account) => {
    if (token && account) pairs.push({ token: String(token), account: String(account) })
  }
  push(process.env.CF_API_TOKEN, process.env.CF_ACCOUNT_ID)
  for (let i = 1; i <= 10; i++) {
    const t = process.env[`CF_API_TOKEN_${i}`]
    const a = process.env[`CF_ACCOUNT_ID_${i}`]
    if (t || a) push(t, a)
    else if (i > 1) break
  }
  return pairs
}

function isConfigured() {
  return listCredentials().length > 0 || listNVCreds().length > 0
}

function listNVCreds() {
  const keys = []
  const push = (k) => {
    const s = String(k || '')
    if (s && s.length >= 8 && !/^PENDING/i.test(s)) keys.push(s)
  }
  push(process.env.NV_API_KEY)
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`NV_API_KEY_${i}`]
    if (k) push(k)
    else if (i > 1) break
  }
  return keys
}

const quotaReset = new Map()

function nextUtcMidnight() {
  const d = new Date()
  d.setUTCHours(24, 0, 0, 0)
  return d.getTime()
}

function isQuotaError(body) {
  const errs = body && body.errors
  if (Array.isArray(errs)) {
    for (const e of errs) {
      if (e && (e.code === 4006 || /free allocation|10,000 neurons|quota/i.test(String(e.message || '')))) {
        return true
      }
    }
  }
  return /free allocation|10,000 neurons|quota/i.test(JSON.stringify(body || {}))
}

function markQuotaExhausted(account) {
  quotaReset.set(account, nextUtcMidnight())
}

function isQuotaExhausted(account) {
  const until = quotaReset.get(account)
  return !!until && Date.now() < until
}

const IMAGE_SIZES = {
  logo: { width: 1024, height: 1024 },
  card: { width: 1024, height: 640 },
  cardBack: { width: 1024, height: 640 },
}

async function callCF(kind, prompt, attempts = 3) {
  const model = process.env.CF_AI_MODEL || '@cf/leonardo/lucid-origin'
  const creds = listCredentials()
  let lastErr = null

  for (const cred of creds) {
    if (isQuotaExhausted(cred.account)) continue
    const { token, account } = cred
    for (let i = 0; i < attempts; i++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 90000)
      try {
        const size = IMAGE_SIZES[kind] || IMAGE_SIZES.logo
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${model}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              width: size.width,
              height: size.height,
              guidance: 4.5,
              num_steps: 20,
            }),
            signal: controller.signal,
          }
        )
        if (res.status === 429) {
          const body = await res.json().catch(() => ({}))
          if (isQuotaError(body)) {
            markQuotaExhausted(account)
            lastErr = new Error('Cloudflare kwota gutardy')
            break
          }
          lastErr = new Error('Cloudflare HTTP 429')
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
          continue
        }
        if (res.status === 503) {
          lastErr = new Error('Cloudflare HTTP 503')
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
          continue
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            (body && body.errors && body.errors[0] && body.errors[0].message) ||
              `Cloudflare HTTP ${res.status}`
          )
        }
        const data = await res.json()
        const b64 = data?.result?.image || data?.image
        if (!b64) throw new Error('Cloudflare boş jogap')
        const raw = String(b64).replace(/^data:image\/(png|jpe?g);base64,/, '')
        return `data:image/jpeg;base64,${raw}`
      } catch (e) {
        lastErr = e
        if (e.name === 'AbortError') await new Promise((r) => setTimeout(r, 1000))
      } finally {
        clearTimeout(timer)
      }
    }
  }
  throw lastErr || new Error('Cloudflare AI işlemedi')
}

const NV_QUOTA_RE = /quota|credit|payment|insufficient|limit|402/i

function isNVQuotaError(status, bodyText) {
  if (status === 402) return true
  return NV_QUOTA_RE.test(String(bodyText || ''))
}

async function callLLM(prompt, attempts = 3) {
  const baseUrl = (process.env.NV_API_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '')
  const model = process.env.NV_LLM_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1'
  const creds = listNVCreds()
  let lastErr = null

  for (const token of creds) {
    if (isQuotaExhausted('nv:' + token)) continue
    for (let i = 0; i < attempts; i++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 60000)
      try {
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content:
                  'Sen AAAA derejeli professional SVG brend dizaýneri we tipografsy. ' +
                  'DIŇE bir sany doly, ulanylmaga taýýar <svg>...</svg> kody gaytar — başga hiç zat (markdown, düşündiriş, sözbaşy) ýazma. ' +
                  'Ähli atributlar doly, tekstler &amp; &lt; &gt; bilen goragly, ýapylan tegler. ' +
                  'Kompaniýa ady we ähli tekstler DIŇE soraýjynyň beren maglumatlary — başga hiç zat goşma. ' +
                  'Teksti doly, takyk, ýalňyşsyz ýaz. ' +
                  'Şrift adyny Arial, Helvetica, Georgia ýa-da generic serif/sans-serif edip goý — başga şrift adyny goşma.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 6000,
          }),
          signal: controller.signal,
        })
        if (res.status === 429 || res.status === 402) {
          const bodyText = await res.text().catch(() => '')
          if (isNVQuotaError(res.status, bodyText)) {
            markQuotaExhausted('nv:' + token)
            lastErr = new Error('NVIDIA kwota gutardy')
            break
          }
          lastErr = new Error(`NVIDIA HTTP ${res.status}`)
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
          continue
        }
        if (res.status === 503) {
          lastErr = new Error('NVIDIA HTTP 503')
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
          continue
        }
        if (!res.ok) throw new Error(`NVIDIA HTTP ${res.status}`)
        const data = await res.json()
        const text = data?.choices?.[0]?.message?.content
        if (!text || !String(text).trim()) throw new Error('NVIDIA boş jogap')
        return String(text).trim()
      } catch (e) {
        lastErr = e
        if (e.name === 'AbortError') await new Promise((r) => setTimeout(r, 1000))
      } finally {
        clearTimeout(timer)
      }
    }
  }
  throw lastErr || new Error('NVIDIA AI işlemedi')
}

function extractSVG(text = '') {
  const m = String(text).match(/<svg[\s\S]*?<\/svg>/i)
  if (!m) throw new Error('SVG tapylmady')
  return m[0]
}

function safeTitle(s) {
  return String(s || '')
    .replace(/[^a-z0-9\u00c0-\u024f\s-]/gi, '')
    .trim()
    .slice(0, 60) || 'logo'
}

function initialsOf(s = '') {
  const parts = String(s).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'BI'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export async function aiGenerateDesign(design = {}) {
  const opts = designOptions()
  const name = safeTitle(design.business_name || design.name || '')
  const industry = design.industry || opts.industries[0]
  const color = design.color || opts.colors[0].name
  const style = design.style || opts.logoStyles[0]
  const card_style = design.card_style || opts.cardStyles[0]
  const contact = design.phone || ''
  const email = design.email || ''
  const ig = design.instagram || ''

  const enName = toLatin(name)
  const enIndustry = INDUSTRY_EN[industry] || toLatin(industry) || 'Services'
  const enColor = COLOR_EN[color] || toLatin(color) || 'blue'

  const base = {
    business_name: design.business_name || design.name || '',
    industry,
    color,
    style,
    card_style,
    phone: contact,
    email,
    instagram: ig,
  }

  const styleHints = {
    monogram: 'elegant monogram emblem motif with overlapping letters and a luxurious feel',
    minimal: 'minimalist clean logo composition with simple lines and lots of negative space',
    badge: 'badge / crest shaped logo with an ornamental frame',
    boxed: 'geometric frame / box border logo with balanced symmetry',
    line: 'thin elegant line art geometric logo',
    neon: 'vibrant neon glow light streaks logo on a dark background',
    gold: 'premium gold foil elegant flowing metallic ribbon logo',
    retro: 'retro vintage ornamental logo with classic symmetrical art',
    circle: 'concentric circles and circular geometric logo pattern',
  }
  const styleHint = styleHints[style] || 'modern professional abstract logo'

  const cardStyleHints = {
    modern: 'modern clean professional business card layout',
    premium: 'premium elegant business card with gold accents and silk textures',
    minimal: 'minimalist soft subtle business card with lots of clean space',
    bold: 'bold vibrant business card with energetic color blocks',
    classic: 'classic timeless business card with fine ornamental lines',
  }
  const cardStyleHint = cardStyleHints[card_style] || 'professional elegant business card'

  const contactLine = [contact, email, ig].filter(Boolean).join('  ·  ')
  const contactItems = []
  if (contact) contactItems.push(`phone number EXACTLY as written: "${contact}"`)
  if (email) contactItems.push(`email EXACTLY as written: "${email}"`)
  if (ig) contactItems.push(`instagram EXACTLY as written: "${ig}"`)

  const forbiddenText =
    `STRICT RULES: Render ONLY the exact texts listed above, and nothing else. ` +
    `Never invent, guess, substitute, or add anything. ` +
    `Never create extra company names, slogans, taglines, words, or phrases. ` +
    `Never add any phone number, home number, fax, address, website, or social handle ` +
    `that is not listed above. Every digit of the given phone number and every character ` +
    `of the given email must be preserved exactly — do not change, drop, or add any digit. ` +
    `Do not repeat, rewrite, or rearrange the given texts. `

  const logoPrompt =
    `Design a complete professional LOGO for a ${enIndustry} company. ` +
    `The image is SQUARE 1024x1024. Main brand color: ${enColor}. Style: ${styleHint}. ` +
    `The logo must display the company name as readable text, written EXACTLY like this: "${enName}". ` +
    `Spell every character of "${enName}" correctly and legibly. ` +
    `Combine the name with a matching ${enIndustry} icon/symbol in the same style. ` +
    forbiddenText +
    `Composition balanced, premium, flat vector look, crisp edges, ` +
    `no watermark, no frame around the whole image.`

  const cardPrompt =
    `Design a complete professional business card FRONT for a ${enIndustry} company. ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), like a real business card. ` +
    `Main brand color: ${enColor}. Style: ${cardStyleHint}. ` +
    `The card must display ONLY these exact texts and NOTHING ELSE: ` +
    `1) company name "${enName}", ` +
    `2) industry "${enIndustry}", ` +
    `3) the contact line exactly as a single line of text: "${contactLine}". ` +
    `The contact line consists of these exact items: ${contactItems.join('; ')}. ` +
    forbiddenText +
    `Spell every character correctly, use clean professional typography, ` +
    `layout balanced, no watermark, no frame around the whole image.`

  const backPrompt =
    `Design a complete professional business card BACK for a ${enIndustry} company. ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), like a real business card. ` +
    `Main brand color: ${enColor}. Style: ${cardStyleHint}. ` +
    `The card back must display ONLY a large elegant monogram with the initials "${initialsOf(enName)}" ` +
    `and the company name "${enName}" written EXACTLY and legibly as readable text. ` +
    forbiddenText +
    `Spell every character correctly, premium, professional typography, ` +
    `no watermark, no frame around the whole image.`

  const logoSvgPrompt =
    `Design a complete professional LOGO SVG for a ${enIndustry} company named "${enName}". ` +
    `viewBox="0 0 850 850" width="850" height="850". Main brand color: ${enColor}. Style: ${styleHint}. ` +
    `Include: (a) a geometric emblem/symbol built from shapes, lines, circles or gradients in ${styleHint} style, ` +
    `(b) the full company name "${enName}" in elegant type with good letter-spacing, ` +
    `(c) a small industry tagline "${enIndustry}" below. ` +
    `Use gradients, opacity, decorative dots/lines and clean negative space. ` +
    `Write ALL texts exactly as given: "${enName}" and "${enIndustry}" — nothing else, no watermark, no frame. ` +
    `Only the SVG code.`

  const cardSvgPrompt =
    `Design a professional business card FRONT SVG for a ${enIndustry} company named "${enName}". ` +
    `viewBox="0 0 850 550" width="850" height="550". Main brand color: ${enColor}. Style: ${cardStyleHint}. ` +
    `Include exactly: (a) the company name "${enName}", (b) the industry "${enIndustry}", ` +
    (contactLine ? `(c) the contact line exactly as a single line: "${contactLine}". ` : `(c) a matching emblem/monogram. `) +
    `Write ALL texts exactly as given and nothing else. ` +
    `Premium typography, balanced layout, gradients, keep everything inside the 850x550 bounds, no watermark. ` +
    `Only the SVG code.`

  const backSvgPrompt =
    `Design a professional business card BACK SVG for a ${enIndustry} company named "${enName}". ` +
    `viewBox="0 0 850 550" width="850" height="550". Main brand color: ${enColor}. Style: ${cardStyleHint}. ` +
    `Show a large elegant centered monogram with initials "${initialsOf(enName)}" and the company name "${enName}" ` +
    `written exactly and legibly as readable text. ` +
    `Write ALL texts exactly as given and nothing else. ` +
    `Elegant, minimal, premium typography, no watermark. Only the SVG code.`

  if (!isConfigured()) {
    return {
      ok: true,
      ai: false,
      logo: generateLogo(base),
      cardFront: generateCard(base),
      cardBack: generateCardBack(base),
      base,
    }
  }

  const cfCreds = listCredentials()
  const nvCreds = listNVCreds()

  if (cfCreds.length > 0) {
    try {
      const images = {}
      for (const [kind, prompt] of [
        ['logo', logoPrompt],
        ['card', cardPrompt],
        ['cardBack', backPrompt],
      ]) {
        images[kind] = await callCF(kind, prompt)
      }
      return {
        ok: true,
        ai: true,
        images: { logo: images.logo, card: images.card, cardBack: images.cardBack },
        base,
      }
    } catch (e) {
      console.error('[aiDesign] Cloudflare başa barmady, NVIDIA synanýar:', String(e.message || e))
    }
  }

  if (nvCreds.length > 0) {
    try {
      const [logo, cardFront, cardBack] = await Promise.all([
        callLLM(logoSvgPrompt).then(extractSVG).then(sanitizeSVG),
        callLLM(cardSvgPrompt).then(extractSVG).then(sanitizeSVG),
        callLLM(backSvgPrompt).then(extractSVG).then(sanitizeSVG),
      ])
      return { ok: true, ai: true, logo, cardFront, cardBack, base }
    } catch (e) {
      console.error('[aiDesign] NVIDIA başa barmady, şablona gaýdýar:', String(e.message || e))
    }
  }

  return {
    ok: true,
    ai: false,
    error: 'AI kwotasy gutardy, şablon ulanyldy',
    logo: generateLogo(base),
    cardFront: generateCard(base),
    cardBack: generateCardBack(base),
    base,
  }
}

export function aiDesignStatus() {
  const cfCreds = listCredentials()
  const nvCreds = listNVCreds()
  const parts = []
  if (cfCreds.length) {
    parts.push(`Cloudflare (${process.env.CF_AI_MODEL || '@cf/leonardo/lucid-origin'}) [${cfCreds.length} açar]`)
  }
  if (nvCreds.length) {
    parts.push(`NVIDIA (${process.env.NV_LLM_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1'}) [${nvCreds.length} açar]`)
  }
  return {
    ai: cfCreds.length > 0 || nvCreds.length > 0,
    provider: parts.length ? parts.join(' + ') : null,
  }
}
