import { generateLogo, generateCard, generateCardBack, designOptions } from './logo.js'

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
  return listCredentials().length > 0
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

  const logoPrompt =
    `Design a complete professional LOGO for a ${industry} company named "${name}". ` +
    `The image is SQUARE 1024x1024. Main brand color: ${color}. Style: ${styleHint}. ` +
    `The logo must include the company name "${name}" written clearly and spelled EXACTLY as given. ` +
    `Use elegant typography for the name, combined with a matching ${industry} icon/symbol. ` +
    `Composition balanced, premium, flat vector look, crisp edges, ` +
    `no watermark, no frame around the whole image.`

  const cardPrompt =
    `Design a complete professional business card FRONT for a ${industry} company named "${name}". ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), like a real business card. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `The card must include the company name "${name}" spelled EXACTLY as given, ` +
    `the industry "${industry}", ` +
    `and contact details "${contactLine}" (phone/email/instagram) ` +
    `all as readable, correctly spelled text. ` +
    `Premium, professional typography, no watermark, no frame around the whole image.`

  const backPrompt =
    `Design a complete professional business card BACK for a ${industry} company named "${name}". ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), like a real business card. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `The card back must show an elegant monogram with the initials "${initialsOf(name)}" ` +
    `and the company name "${name}" spelled EXACTLY as given, as readable text. ` +
    `Premium, professional typography, no watermark, no frame around the whole image.`

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
    console.error('[aiDesign] Cloudflare AI generasiýa ýalňyşdy:', String(e.message || e))
    return {
      ok: true,
      ai: false,
      error: String(e.message || e),
      logo: generateLogo(base),
      cardFront: generateCard(base),
      cardBack: generateCardBack(base),
      base,
    }
  }
}

export function aiDesignStatus() {
  const creds = listCredentials()
  return {
    ai: creds.length > 0,
    provider: creds.length
      ? `Cloudflare AI (${process.env.CF_AI_MODEL || '@cf/leonardo/lucid-origin'}) [${creds.length} açar]`
      : null,
  }
}
