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

async function callCF(kind, prompt, attempts = 3) {
  const model = process.env.CF_AI_MODEL || '@cf/black-forest-labs/flux-1-schnell'
  const creds = listCredentials()
  let lastErr = null

  for (const cred of creds) {
    if (isQuotaExhausted(cred.account)) continue
    const { token, account } = cred
    for (let i = 0; i < attempts; i++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 90000)
      try {
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${model}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              prompt,
              steps: 4,
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
        const b64 = data?.result?.image
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
    monogram: 'elegant abstract geometric emblem motif with overlapping shapes and a luxurious feel',
    minimal: 'minimalist clean abstract composition with simple lines and lots of negative space',
    badge: 'badge / crest shaped ornamental frame decoration',
    boxed: 'geometric frame / box border decoration with balanced symmetry',
    line: 'thin elegant line art geometric decoration',
    neon: 'vibrant neon glow light streaks on a dark background',
    gold: 'premium gold foil elegant flowing metallic ribbon shapes',
    retro: 'retro vintage ornamental pattern with classic symmetrical art',
    circle: 'concentric circles and circular geometric patterns',
  }
  const styleHint = styleHints[style] || 'modern professional abstract decoration'

  const cardStyleHints = {
    modern: 'modern clean abstract gradient background with soft shapes',
    premium: 'premium elegant background with gold accents and silk textures',
    minimal: 'minimalist soft subtle background with lots of clean space',
    bold: 'bold vibrant abstract background with energetic color blocks',
    classic: 'classic timeless elegant background with fine ornamental lines',
  }
  const cardStyleHint = cardStyleHints[card_style] || 'professional elegant background'

  const logoPrompt =
    `Beautiful abstract brand mark / emblem BACKGROUND decoration for a ${industry} company. ` +
    `Main brand color: ${color}. Style: ${styleHint}. ` +
    `This is a decorative background only: geometric shapes, gradients, soft shapes, flowing lines. ` +
    `NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO LOGOTYPE, NO NUMBERS — strictly no writing anywhere. ` +
    `Composition leaves clean empty space in the LEFT part and the CENTER-RIGHT, suitable for placing a company name. ` +
    `High quality, premium, flat vector look, crisp edges, no watermark, no frame around the whole image.`

  const cardPrompt =
    `Beautiful abstract decorative BACKGROUND for a professional business card FRONT, ${industry} company. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `WIDE HORIZONTAL BAND composition: all decoration is concentrated in the CENTER horizontal strip, ` +
    `top and bottom edges stay calm and empty (they will be cropped). ` +
    `This is a decorative background only: gradient, soft shapes, subtle texture. ` +
    `NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO NUMBERS, NO CONTACT INFO — strictly no writing anywhere, a plain abstract background. ` +
    `The center-left area should be clean and calm so a company name and contact lines can be placed on top. ` +
    `Premium look, no watermark, no frame around the whole image.`

  const backPrompt =
    `Beautiful abstract decorative BACKGROUND for a professional business card BACK, ${industry} company. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `WIDE HORIZONTAL BAND composition: all decoration is concentrated in the CENTER horizontal strip, ` +
    `top and bottom edges stay calm and empty (they will be cropped). ` +
    `This is a decorative background only: subtle gradient, elegant geometric motifs, soft glow. ` +
    `NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO NUMBERS — strictly no writing anywhere, a plain abstract background. ` +
    `The center should be calm and empty so a monogram and name can be placed on top. ` +
    `Premium look, no watermark, no frame around the whole image.`

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
    provider: creds.length ? `Cloudflare AI (FLUX.1 Schnell) [${creds.length} açar]` : null,
  }
}
