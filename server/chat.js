import { botReply } from './bot.js'

const SYSTEM_PROMPT =
  'Sen BIRDE sanly hyzmatlar birleşiginiň resmi kömekçi boty. ' +
  'BIRDE Türkmenistanda logo dizaýny, wizitka, sosial media postlary, ' +
  'logo animasiýasy, web sahypa, 3D dizaýn we düşündiriş wideolar (explainer/training/tender) ' +
  'hödürleýän sanly hyzmatlar birleşigidir. ' +
  'Telefonlar: +993 62 017 373 we +993 61 847 337. E-poçta: dovrantaganov0@gmail.com. ' +
  'Hyzmatlar üç dildedir: türkmen, rus, iňlis. ' +
  'Jogapy gysga we türkmen dilinde ber. Sargyt etmek islese, ady we telefon belgini sorag et.'

function isConfigured() {
  return !!(process.env.USER_LLM_API_KEY && process.env.USER_LLM_BASE_URL)
}

async function callLLM(messages) {
  const apiKey = process.env.USER_LLM_API_KEY
  const baseUrl = (process.env.USER_LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'deepseek-chat'

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)

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
        max_tokens: 500,
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('LLM boş jogap')
    return String(text).trim()
  } finally {
    clearTimeout(timer)
  }
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
