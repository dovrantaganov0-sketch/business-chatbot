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
  const model = process.env.CF_AI_MODEL || '@cf/black-forest-labs/flux-2-klein-4b'
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
        const form = new FormData()
        form.append('prompt', prompt)
        form.append('width', String(size.width))
        form.append('height', String(size.height))
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${model}`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form,
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

function toEnglish(s = '') {
  const map = {
    ä: 'a', á: 'a', â: 'a', ã: 'a', à: 'a', å: 'a',
    ç: 'ch', č: 'ch',
    ğ: 'g',
    ý: 'y',
    ň: 'n', ñ: 'n', ń: 'n',
    ö: 'o', ô: 'o', õ: 'o', ó: 'o', ò: 'o',
    ş: 'sh', š: 'sh',
    ü: 'u', û: 'u', ú: 'u', ù: 'u', ū: 'u',
    ž: 'zh', ź: 'z', ż: 'z',
    í: 'i', î: 'i', ï: 'i', ı: 'i',
    é: 'e', ê: 'e', ë: 'e',
  }
  return String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]/g, (ch) => map[ch.toLowerCase()] || '')
    .replace(/[^a-zA-Z0-9 .'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
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

  const brandName = toEnglish(base.business_name) || 'Company'
  const initials =
    brandName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || brandName.slice(0, 2).toUpperCase()
  const contactDigits = String(contact).replace(/[^+0-9 ]/g, '').trim()

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
    `A complete LOGO design for "${brandName}", a ${industry} company. ` +
    `The image is SQUARE 1024x1024. Main brand color: ${color}. Style: ${styleHint}. ` +
    `The company name "${brandName}" is written in CLEAR, CORRECT English text inside the image, ` +
    `elegant typography, placed in the lower-center of the logo. ` +
    `Above it an abstract geometric emblem / icon decoration in the same brand color. ` +
    `A complete finished logo, not a placeholder, no gibberish characters, no watermark, ` +
    `no frame around the whole image. Premium flat vector look, crisp edges.`

  const cardPrompt =
    `A complete FRONT side of a professional business card for "${brandName}", a ${industry} company. ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), exactly like a real business card. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `The company name "${brandName}" is written in CLEAR, CORRECT English text, ` +
    `horizontally centered in the upper-middle of the image, elegant typography. ` +
    (contactDigits
      ? `Below the name write the phone number ${contactDigits} in clear readable digits. `
      : '') +
    `A complete finished business card design, not a background only. ` +
    `No gibberish characters, no watermark, no frame around the whole image. Premium look.`

  const backPrompt =
    `A complete BACK side of the same professional business card for "${brandName}", a ${industry} company. ` +
    `The image is WIDE LANDSCAPE 16:10 (1024x640), exactly like a real business card. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `A centered elegant monogram with the initials "${initials}" and the company name "${brandName}" ` +
    `in CLEAR, CORRECT English text in the center of the image. ` +
    `A complete finished business card design. No gibberish characters, no watermark, no frame. Premium look.`

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
      ? `Cloudflare AI (${process.env.CF_AI_MODEL || '@cf/black-forest-labs/flux-2-klein-4b'}) [${creds.length} açar]`
      : null,
  }
}
