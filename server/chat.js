import { botReply } from './bot.js'

const SYSTEM_PROMPT =
  'Sen BIRDE sanly hyzmatlar birleşiginiň resmi kömekçi boty. ' +
  'BIRDE Türkmenistanda logo dizaýny, wizitka, sosial media postlary, ' +
  'logo animasiýasy, web sahypa, 3D dizaýn we düşündiriş wideolar (explainer/training/tender) ' +
  'hödürleýän sanly hyzmatlar birleşigidir. ' +
  'Telefonlar: +993 62 017 373 we +993 61 847 337. E-poçta: dovrantaganov0@gmail.com. ' +
  'Hyzmatlar üç dildedir: türkmen, rus, iňlis. ' +
  'Jogaby türkmen dilinde ber, soragyň diline laýyk gelse beýleki dilde hem jogap ber. ' +
  'Sorag düşündiriş talap edýän bolsa (näme üçin, näme peýdasy bar, nämä gerek, haýsy peýda, ' +
  'haýsy netije, nädip kömek edýär, biznes barada, kiçi biznes ideýalary barada): ' +
  'doly we jikme-jik düşündirişli jogap ber. ' +
  'Jogapda başlangyç gysga netije (1-2 sözlem), soň 4-8 sany aýratyn düşündiriş nokady, ' +
  'her nokadyň aşagynda mysal ýa-da düşündiriş, soň ýeketäk goşmaça teklip (teklip: BIRDE-niň hyzmatlary) goş. ' +
  'Kiçi biznes ideýalary barada soralanda Türkmenistana laýyk, kiçi maýa bilen başlap bolýan ' +
  '5-8 sany anyk ideýany sanlap, her biriniň nämä gerekdigini we nädip başlamaly bolandygyny gysgaça düşündir. ' +
  'Logo ýa-da wizitkanyň peýdasy soralanda: ykrar edilme, özboluşlylyk, ynam, ilkinji täsir, ' +
  'abraý, her ýerde işleýänligi (wizitka, web, sosial media, wideo, çap), ' +
  'satuw we müşderi bilen aragatnaşyk gowulandyrmak ýaly tarap-laryny jikme-jik beýan et. ' +
  'Mahabatyň peýdasy soralanda: köpçülige tanatmak, müşderi çekmek, ýatda galmak, ' +
  'bäsdeşlerden aýrylmak, satuwy artdyrmak ýaly tarap-laryny jikme-jik düşündir. ' +
  'Jogabyň uzynlygy soraga bagly: sada soraga gysga, düşündiriş talap edýän soraga has giňişleýin jogap ber. ' +
  'Sargyt etmek islese, ady we telefon belgini sorag et. ' +
  'Hiç haçan ýalan maglumat berme; takyk bilmeýän zatlaryňy aç-açan aýt.'

function isConfigured() {
  return !!(process.env.USER_LLM_API_KEY && process.env.USER_LLM_BASE_URL)
}

async function callLLM(messages, attempts = 3) {
  const apiKey = process.env.USER_LLM_API_KEY
  const baseUrl = (process.env.USER_LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'deepseek-chat'

  let lastErr = null
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      })
      if (res.status === 429 || res.status === 503) {
        lastErr = new Error(`LLM HTTP ${res.status}`)
        await new Promise((r) => setTimeout(r, 1200 * (i + 1)))
        continue
      }
      if (!res.ok) throw new Error(`LLM HTTP ${res.status}`)
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('LLM boş jogap')
      return String(text).trim()
    } catch (e) {
      lastErr = e
      if (e.name === 'AbortError') await new Promise((r) => setTimeout(r, 800))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr || new Error('LLM işlemedi')
}

export async function chatReply(userText = '', history = []) {
  const configured = isConfigured()

  if (configured) {
    try {
      const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
      const tail = Array.isArray(history) ? history.slice(-8) : []
      for (const m of tail) {
        if (m && m.role && typeof m.content === 'string') {
          messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })
        }
      }
      messages.push({ role: 'user', content: userText })
      const text = await callLLM(messages)
      return { text, source: 'ai' }
    } catch (e) {
      const fallback = botReply(userText)
      return { text: fallback.text, source: 'fallback', error: String(e.message || e) }
    }
  }

  const fallback = botReply(userText)
  return { text: fallback.text, source: 'rule' }
}

export function chatStatus() {
  return {
    ai: isConfigured(),
    provider: process.env.USER_LLM_MODEL || (process.env.USER_LLM_BASE_URL ? 'custom' : null),
  }
}
