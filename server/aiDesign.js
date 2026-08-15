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
                'Sen AAAA derejeli professional SVG brend dizaýneri we tipografsy. ' +
                'DIŇE bir sany doly, ulanylmaga taýýar <svg>...</svg> kody gaytar — başga hiç zat (markdown ```, düşündiriş, sözbaşy) ýazma. ' +
                'Kod sintaktik dogry bolmaly: ähli atrıbutlar doly, tekstler &amp; &lt; &gt; bilen goragly, ýapylan tegler. ' +
                'Dizaýn prinsipleri: ' +
                '1) Açyk, deňagramly kompozisiýa — markanyň we tekstiniň arasynda howa (negative space). ' +
                '2) Professional tipografiýa — şrift ölçegleri, agram (font-weight) we harp aralygy (letter-spacing) çuňňur pikirlen. ' +
                '3) Reňk — berlen reňk gammasyny we onuň derňewini (light/dark) dogry ulanyň, gradient we şekil bilen çuňluk goşyň. ' +
                '4) Döwrebap, minimal, ýöne hatyrdan galmajak dizaýn. ' +
                'Kompaniýa ady we ähli tekstler DIŇE soraýjynyň beren maglumatlary — biziň ýa-da üçünji tarapyň maglumatlaryny goşma. ' +
                'Teksti doly, takyk, ýalňyşsyz ýaz. Açyk tekst uzyn bolsa iki setir edip dogry ýerleşdir.',
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
    const styleHints = {
      monogram: 'monogram (harplardan düzülen nyşan)',
      minimal: 'minimalist we arassa çyzykly',
      badge: 'badge/greýba görnüşinde',
      boxed: 'çarçuwa (frame) içinde',
      line: 'çyzykly we geometrik',
      neon: 'neon ýagtylyk effektli',
      gold: 'altyn ýalpyldawuk premium',
      retro: 'retro / klasik',
      circle: 'tegelek nyşanly',
    }
    const styleHint = styleHints[style] || 'döwrebap'

    const logoPrompt =
      `Kompaniýa: "${name}". Ugur: ${industry}. Esasy reňk: ${color}. Islenýän stil: ${styleHint}. ` +
      `"${name}" atly kompaniýa üçin owadan, zynjyryna ýetýän professional brend logo döret, viewBox="0 0 400 160" ölçegli. ` +
      `Logoda aşakdakylar bolmaly: ` +
      `(a) Emblema/nyşan — düşnükli we ýatda galýan, geometrik şekiller, çyzyklar, tegelekler ýa-da gradiýentler bilen gurlan, ${styleHint} stilinde. ` +
      `(b) Kompaniýa adynyň doly we takyk ýazgysy — owadan şrift, dogry harp aralygy (letter-spacing). ` +
      `(c) Kiçi ugur ýa-da slogan ýazgysy (${industry} bilen bagly), has kiçi we aşakda. ` +
      `Wizualla kömek etmek üçin: gradýentler, şeffaflyk (opacity), dekoratiw nokatlar/çyzyklar we arassa negative space ulanyň. ` +
      `Logo ajaýyp görünmeli: döwrebap, arassa we professional, logo banklarynda bolşy ýaly. ` +
      `Kompaniýa adyny we ähli tekstleri doly we takyk ýaz. ` +
      `Şrift adyny Arial, Helvetica, "Trebuchet MS", Georgia ýa-da generic serif/sans-serif edip goý — beýlekileri goşma.`

    const cardPrompt =
      `Kompaniýa: "${name}". Ugur: ${industry}. Esasy reňk: ${color}. Wizitka stili: ${card_style}. ` +
      (contact ? `Telefon: ${contact}. ` : '') +
      (email ? `E-poçta: ${email}. ` : '') +
      (ig ? `Instagram: ${ig}. ` : '') +
      `Professional, owadan wizitkanyň ÖŇ tarapyny döret, viewBox="0 0 400 240" ölçegli. ` +
      `Wizitkada bolmaly: (a) kompaniýanyň ady doly we aýdyň, (b) ugry ýa-da kiçi slogan, ` +
      (contact || email || ig
        ? `(c) konta maglumatlar (diňe ${[contact, email, ig].filter(Boolean).join(', ')} — başga hiç zat goşma). `
        : '(c) kompaniýanyň nyşany/monogramy. ') +
      `Stil: döwrebap, ýokary hilli, doly ýerleşdirlen kompozisiýa. ` +
      `Owadan şrift, reňk kontrasty, gradýentler we dekoratiw elementler bilen premium görnüş ber. ` +
      `Kart 400x240 ölçegden daşary çykmadyk bolsun, tekstler kesilmesin. ` +
      `Biziň ýa-da üçünji tarapyň maglumatlaryny goşma.`

    const backPrompt =
      `Kompaniýa: "${name}". Ugur: ${industry}. Esasy reňk: ${color}. ` +
      `Wizitkanyň ARKA tarapyny döret, viewBox="0 0 400 240" ölçegli. ` +
      `Arka tarapda: (a) kompaniýanyň monogramy ýa-da nyşany — owadan, dekoratiw we ortada, ` +
      `(b) kompaniýanyň ady, (c) ugry ýa-da slogan. ` +
      `Dizaýn öňi bilen sazlaşykly, emma arka tarap has ýönekeý we estetiki bolmaly. ` +
      `Gradýentler, şeffaflyk we dekoratiw şekiller ulanyň. ` +
      `Şrift we reňk saýlamasy professional. Biziň ýa-da üçünji tarapyň maglumatlaryny goşma.`

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
