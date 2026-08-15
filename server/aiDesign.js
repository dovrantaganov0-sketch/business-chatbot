import { generateLogo, generateCard, generateCardBack, designOptions } from './logo.js'

function isConfigured() {
  return !!(process.env.USER_LLM_API_KEY && process.env.USER_LLM_BASE_URL)
}

async function callLLM(prompt, attempts = 3) {
  const apiKey = process.env.USER_LLM_API_KEY
  const baseUrl = (process.env.USER_LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'deepseek-chat'

  let lastErr = null
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 40000)
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                'Sen professional SVG dizaýneri. Soraýjynyň haýyşy boýunça DIŇE one-tag SVG kod gaytar. ' +
                'Markdown blok belgilerini (```) ýazma, başga hiç zat ýazma, diňe <svg>...</svg>. ' +
                'Kod dürli stil we döwrebap bolmaly. Teksti doly we takyk ýazmaly.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.9,
          max_tokens: 8192,
        }),
        signal: controller.signal,
      })
      if (res.status === 429 || res.status === 503) {
        lastErr = new Error(`LLM HTTP ${res.status}`)
        await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
        continue
      }
      if (!res.ok) throw new Error(`LLM HTTP ${res.status}`)
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('LLM boş jogap')
      return String(text).trim()
    } catch (e) {
      lastErr = e
      if (e.name === 'AbortError') await new Promise((r) => setTimeout(r, 1000))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr || new Error('LLM işlemedi')
}

function extractSVG(text = '') {
  const m = text.match(/<svg[\s\S]*?<\/svg>/i)
  if (!m) throw new Error('SVG tapylmady')
  return m[0]
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

  try {
    const logoPrompt =
      `Kompaniýa ady: "${name}". Ugur: ${industry}. Reňk: ${color}. Stil: ${style}. ` +
      `"${name}" atly kompaniýa üçin minimal professional logo SVG döret. ` +
      `Ölçeg viewBox="0 0 400 160". Kompaniýa adyny logo-da takyk ýaz. Logo markasy we tekst bölekleri bolsun.`

    const cardPrompt =
      `Kompaniýa ady: "${name}". Ugur: ${industry}. Reňk: ${color}. Wizitka stili: ${card_style}. ` +
      (contact ? `Telefon: ${contact}. ` : '') +
      (email ? `E-poçta: ${email}. ` : '') +
      (ig ? `Instagram: ${ig}. ` : '') +
      `Professional wizitkanyň ÖŇ tarapyny SVG edip döret, viewBox="0 0 400 240". ` +
      `Kompaniýa ady, ugry we görnükli konta maglumatlary bolsun. Biziň ýa-da üçünji tarapyň maglumatlaryny goşma.`

    const backPrompt =
      `Kompaniýa ady: "${name}". Reňk: ${color}. Wizitkanyň ARKA tarapyny döret, viewBox="0 0 400 240". ` +
      `Arka tarapda logo nyşany (monogram), kompaniýa ady we ugry bolsun. Biziň ýa-da üçünji tarapyň maglumatlaryny goşma.`

    const [logo, cardFront, cardBack] = await Promise.all([
      callLLM(logoPrompt).then(extractSVG),
      callLLM(cardPrompt).then(extractSVG),
      callLLM(backPrompt).then(extractSVG),
    ])

    return { ok: true, ai: true, logo, cardFront, cardBack, base }
  } catch (e) {
    console.error('[aiDesign] AI generasiýa ýalňyşdy:', String(e.message || e))
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
  return { ai: isConfigured(), provider: process.env.USER_LLM_MODEL || null }
}
