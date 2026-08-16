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

function listGroqKeys() {
  const keys = []
  const push = (k) => {
    const s = String(k || '')
    if (s && s.length >= 8 && !/^PENDING/i.test(s)) keys.push(s)
  }
  push(process.env.GROQ_API_KEY)
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`GROQ_API_KEY_${i}`]
    if (k) push(k)
    else if (i > 1) break
  }
  return keys
}

async function callProvider(baseUrl, apiKey, model, messages, attempts = 3) {
  let lastErr = null
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
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
        lastErr = new Error(`${model} HTTP ${res.status}`)
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)))
        continue
      }
      if (!res.ok) throw new Error(`${model} HTTP ${res.status}`)
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error(`${model} boş jogap`)
      return String(text).trim()
    } catch (e) {
      lastErr = e
      if (e.name === 'AbortError') await new Promise((r) => setTimeout(r, 1500))
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr || new Error(`${model} işlemedi`)
}

async function callLLM(messages) {
  const apiKey = process.env.USER_LLM_API_KEY
  const baseUrl = (process.env.USER_LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'gemini-3.5-flash'
  let lastErr = null

  if (apiKey) {
    try {
      return await callProvider(baseUrl, apiKey, model, messages, 5)
    } catch (e) {
      lastErr = e
    }
  }

  const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  for (const key of listGroqKeys()) {
    try {
      return await callProvider('https://api.groq.com/openai/v1', key, groqModel, messages, 3)
    } catch (e) {
      lastErr = e
    }
  }

  throw lastErr || new Error('LLM işlemedi')
}

export async function chatReply(userText = '', history = []) {
  const configured = isConfigured()
  const hasGroq = listGroqKeys().length > 0

  if (configured || hasGroq) {
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
  const parts = []
  if (isConfigured()) parts.push(process.env.USER_LLM_MODEL || 'custom')
  if (listGroqKeys().length) parts.push(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
  return {
    ai: isConfigured() || listGroqKeys().length > 0,
    provider: parts.length ? parts.join(' + ') : null,
  }
}
