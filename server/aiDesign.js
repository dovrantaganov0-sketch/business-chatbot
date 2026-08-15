import { generateLogo, generateCard, generateCardBack, designOptions } from './logo.js'

function isConfigured() {
  return !!(process.env.CF_API_TOKEN && process.env.CF_ACCOUNT_ID)
}

async function callCF(kind, prompt, attempts = 3) {
  const token = process.env.CF_API_TOKEN
  const account = process.env.CF_ACCOUNT_ID
  const model = process.env.CF_AI_MODEL || '@cf/black-forest-labs/flux-1-schnell'

  let lastErr = null
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
      if (res.status === 429 || res.status === 503) {
        lastErr = new Error(`Cloudflare HTTP ${res.status}`)
        await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
        continue
      }
      if (!res.ok) throw new Error(`Cloudflare HTTP ${res.status}`)
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
    `This is a decorative background only: gradient, soft shapes, subtle texture. ` +
    `NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO NUMBERS, NO CONTACT INFO — strictly no writing anywhere. ` +
    `The center area should be clean and calm so a company name and contact lines can be placed on top. ` +
    `Landscape business card proportions, premium look, no watermark, no frame around the whole image.`

  const backPrompt =
    `Beautiful abstract decorative BACKGROUND for a professional business card BACK, ${industry} company. ` +
    `Main brand color: ${color}. Style: ${cardStyleHint}. ` +
    `This is a decorative background only: subtle gradient, elegant geometric motifs, soft glow. ` +
    `NO TEXT, NO LETTERS, NO WORDS, NO CHARACTERS, NO NUMBERS — strictly no writing anywhere. ` +
    `The center should be calm and empty so a monogram and name can be placed on top. ` +
    `Landscape business card proportions, premium look, no watermark, no frame around the whole image.`

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
  return {
    ai: isConfigured(),
    provider: isConfigured() ? 'Cloudflare AI (FLUX.1 Schnell)' : null,
  }
}
