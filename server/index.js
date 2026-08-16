import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  listOrders,
  createOrder,
  updateOrderStatus,
  getOrder,
  updateOrder,
  deleteOrder,
  listCustomers,
  addCustomer,
  addMessage,
  listMessages,
  getStats,
  listWorks,
  createWork,
  updateWork,
  deleteWork,
  saveUpload,
} from './store.js'
import { botReply, servicesList, detectOrderIntent } from './bot.js'
import {
  generateLogo,
  generateCard,
  generateCardBack,
  designOptions,
  injectWatermark,
  stripWatermark,
  sanitizeSVG,
} from './logo.js'
import { aiGenerateDesign, aiDesignStatus } from './aiDesign.js'
import { chatReply, chatStatus } from './chat.js'
const app = express()
const PORT = process.env.PORT || 3001

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist')

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'BIRDE API', time: new Date().toISOString() })
})

app.get('/api/services', (req, res) => {
  res.json(servicesList())
})

app.get('/api/orders', (req, res) => {
  res.json(listOrders())
})

app.post('/api/orders', (req, res) => {
  const { service, name, phone, email, details, source, design } = req.body || {}
  if (!service || !phone) {
    return res.status(400).json({ error: 'Service we phone hökmany' })
  }
  const order = createOrder({ service, name, phone, email, details, source, design })
  addCustomer({ name, phone, ordersCount: 1 })
  addMessage({
    from: 'user',
    channel: source === 'bot' ? 'bot' : 'web',
    text: `Sargyt: ${service} / ${name || 'adatdan'} / ${phone}`,
    orderId: order.id,
  })
  res.status(201).json(order)
})

app.patch('/api/orders/:id', (req, res) => {
  const { status } = req.body || {}
  const order = updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ error: 'Tapylmady' })
  res.json(order)
})

app.delete('/api/orders/:id', (req, res) => {
  const ok = deleteOrder(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Tapylmady' })
  res.json({ ok: true })
})

app.get('/api/customers', (req, res) => {
  res.json(listCustomers())
})

app.get('/api/messages', (req, res) => {
  res.json(listMessages())
})

app.get('/api/stats', (req, res) => {
  res.json(getStats())
})

app.get('/api/works', (req, res) => {
  const works = listWorks()
  works.sort((a, b) => b.sort - a.sort)
  res.json(works)
})

app.post('/api/works', (req, res) => {
  const work = createWork(req.body || {})
  res.status(201).json(work)
})

app.patch('/api/works/:id', (req, res) => {
  const work = updateWork(req.params.id, req.body || {})
  if (!work) return res.status(404).json({ error: 'Tapylmady' })
  res.json(work)
})

app.delete('/api/works/:id', (req, res) => {
  const ok = deleteWork(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Tapylmady' })
  res.json({ ok: true })
})

app.post('/api/bot/message', (req, res) => {
  const { text, from = 'user', channel = 'web' } = req.body || {}
  addMessage({ from, channel, text: text || '' })
  const reply = botReply(text)
  if (reply.intent === 'order' || detectOrderIntent(text)) {
    createOrder({
      service: detectOrderIntent(text) ? 'Bot sargydy' : 'Web çat',
      name: '',
      phone: (text.match(/\d{8,}/) || [''])[0],
      details: text,
      source: channel,
    })
  }
  addMessage({ from: 'bot', channel, text: reply.text })
  res.json({ ...reply, received: true })
})

app.get('/api/instagram/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']
  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN
  if (!VERIFY_TOKEN) {
    return res.sendStatus(403)
  }
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }
  res.sendStatus(403)
})

app.post('/api/instagram/webhook', (req, res) => {
  const body = req.body || {}
  let inbox = []
  const entry = body.entry && body.entry[0]
  const changes = entry && entry.changes
  if (Array.isArray(changes)) {
    for (const ch of changes) {
      const msg = ch.value && (ch.value.messages || [])[0]
      if (msg) inbox.push(msg)
    }
  } else if (body.messages && body.messages.length) {
    inbox = body.messages
  }
  for (const msg of inbox) {
    const text = (msg.text && msg.text.body) || ''
    const reply = botReply(text)
    addMessage({ from: 'user', channel: 'instagram', text })
    addMessage({ from: 'bot', channel: 'instagram', text: reply.text })
    if (reply.intent === 'order') {
      createOrder({
        service: 'Instagram sargyt',
        phone: (text.match(/\d{8,}/) || [''])[0] || 'Instagram müşderi',
        details: text,
        source: 'instagram',
      })
    }
  }
  res.status(200).json({ ok: true, processed: inbox.length })
})

app.get('/api/design/options', (req, res) => {
  res.json(designOptions())
})

app.get('/api/design/ai-status', (req, res) => {
  res.json(aiDesignStatus())
})

function designConfig(order = {}) {
  const d = order.design || {}
  const base = d.base || {}
  return {
    ...order,
    ...d,
    ...base,
    name: d.business_name || order.name || '',
    phone: base.phone || d.phone || order.phone || '',
    email: base.email || d.email || order.email || '',
  }
}

function watermark(vw, vh) {
  const cx = vw / 2
  const cy = vh / 2
  const fs = Math.round(vw / 24)
  const fs2 = Math.round(vw / 48)
  return (
    '<g opacity="0.55">' +
    `<text transform="rotate(-18 ${cx} ${cy})" x="${cx}" y="${cy - fs * 0.5}" font-family="Arial, sans-serif" font-weight="800" font-size="${fs}" fill="#ff5c8a" text-anchor="middle">NUSGA · PREVIEW</text>` +
    `<text transform="rotate(-18 ${cx} ${cy})" x="${cx}" y="${cy + fs * 0.9}" font-family="Arial, sans-serif" font-weight="700" font-size="${fs2}" fill="#ffffff" text-anchor="middle">TÖLEG SOŇUNDAN DOLY NUSGA</text>` +
    '</g>'
  )
}

const DESIGN_SIZES = {
  logo: { vw: 850, vh: 850 },
  card: { vw: 856, vh: 540 },
  cardBack: { vw: 856, vh: 540 },
}

function pngBackgroundSVG(imgDataUri, kind, cfg, final = false) {
  const { vw, vh } = DESIGN_SIZES[kind] || DESIGN_SIZES.card
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}">` +
    `<image href="${imgDataUri}" x="0" y="0" width="${vw}" height="${vh}" preserveAspectRatio="xMidYMid slice"/>` +
    (final ? '' : watermark(vw, vh)) +
    '</svg>'
  )
}

function designImage(order, kind) {
  const images = order.design && order.design.images
  const raw = images && images[kind]
  if (!raw) return null
  const s = String(raw)
  const mime = /^data:image\/(png|jpe?g);/.test(s) ? s.slice(5, s.indexOf(';')) : 'image/jpeg'
  const b64 = s.replace(/^data:image\/(png|jpe?g);base64,/, '')
  return { mime, body: Buffer.from(b64, 'base64') }
}

function designAsset(order, kind, final = false) {
  const stored = order.design && order.design.svg
  const images = order.design && order.design.images
  const cfg = designConfig(order)

  if (images && images[kind]) {
    return { type: 'image/svg+xml', body: pngBackgroundSVG(images[kind], kind, cfg, final) }
  }
  if (stored && stored[kind]) {
    const svg = sanitizeSVG(stored[kind])
    return { type: 'image/svg+xml', body: final ? stripWatermark(svg) : injectWatermark(svg) }
  }
  const variant = (order.design && order.design.variant) || 0
  let body
  if (kind === 'logo') body = generateLogo(cfg, { final, variant })
  else if (kind === 'card') body = generateCard(cfg, { final, variant })
  else body = generateCardBack(cfg, { final, variant })
  return { type: 'image/svg+xml', body }
}

app.get('/api/design/:id/raw/:kind', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const kind = ['logo', 'card', 'cardBack'].includes(req.params.kind) ? req.params.kind : null
  if (!kind) return res.status(404).json({ error: 'Tapylmady' })
  const img = designImage(order, kind)
  if (!img) return res.status(404).json({ error: 'Tapylmady' })
  res.type(img.mime).send(img.body)
})

function requireDesignOrder(req, res) {
  const order = getOrder(req.params.id)
  if (!order || !order.design) {
    res.status(404).json({ error: 'Tapylmady' })
    return null
  }
  return order
}

const DESIGN_STATUS_OK = ['paid', 'done']

app.get('/api/design/:id/logo', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const final = req.query.final === '1'
  if (final && !DESIGN_STATUS_OK.includes(order.status)) {
    return res.status(403).json({ error: 'Töleg tassyklanandan soň açylýar' })
  }
  const asset = designAsset(order, 'logo', final)
  res.type(asset.type).send(asset.body)
})

app.get('/api/design/:id/card', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const final = req.query.final === '1'
  if (final && !DESIGN_STATUS_OK.includes(order.status)) {
    return res.status(403).json({ error: 'Töleg tassyklanandan soň açylýar' })
  }
  const asset = designAsset(order, 'card', final)
  res.type(asset.type).send(asset.body)
})

app.get('/api/design/:id/card-back', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const final = req.query.final === '1'
  if (final && !DESIGN_STATUS_OK.includes(order.status)) {
    return res.status(403).json({ error: 'Töleg tassyklanandan soň açylýar' })
  }
  const asset = designAsset(order, 'cardBack', final)
  res.type(asset.type).send(asset.body)
})

app.post('/api/design/generate', async (req, res) => {
  const body = req.body || {}
  const business_name = String(body.business_name || body.name || '').trim()
  const phone = String(body.phone || '').trim()
  if (!business_name) return res.status(400).json({ error: 'Kompaniýa ady hökmany' })
  if (phone.replace(/\D/g, '').length < 8) {
    return res.status(400).json({ error: 'Telefon belgi doly däl (azyndan 8 san)' })
  }

  const design = {
    business_name,
    phone,
    email: String(body.email || '').trim(),
    industry: body.industry || designOptions().industries[0],
    color: body.color || designOptions().colors[0].name,
    style: body.style || designOptions().logoStyles[0],
    card_style: body.card_style || designOptions().cardStyles[0],
    variant: 1,
    attempts: 0,
    max_attempts: 3,
  }

  const generated = await aiGenerateDesign(design)
  if (generated.ai) {
    design.images = {
      logo: generated.images.logo,
      card: generated.images.card,
      cardBack: generated.images.cardBack,
    }
    design.ai = true
  }
  design.base = generated.base

  const order = createOrder({
    service: 'Logo + Wizitka (dizaýn studia)',
    name: String(body.name || '').trim() || business_name,
    phone,
    email: design.email,
    details: `Dizaýn studia: ${business_name}`,
    source: 'design',
    design,
  })

  addCustomer({ name: order.name, phone })
  addMessage({
    from: 'user',
    channel: 'design',
    text: `Dizaýn sargydy: ${business_name} / ${phone}`,
    orderId: order.id,
  })

  res.status(201).json({
    id: order.id,
    status: order.status,
    attempts: design.attempts,
    max_attempts: design.max_attempts,
    remaining: design.max_attempts - design.attempts,
    ai: !!design.ai,
    preview: {
      logo: `/api/design/${order.id}/logo`,
      card: `/api/design/${order.id}/card`,
      cardBack: `/api/design/${order.id}/card-back`,
    },
  })
})

app.post('/api/design/:id/regenerate', async (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const d = order.design || {}
  if (d.attempts >= d.max_attempts) {
    return res.status(403).json({ error: '3 gezek üýtgetme çägi gutardy', remaining: 0 })
  }
  const variant = (d.variant || 0) + 1
  const design = {
    ...d,
    variant,
    attempts: (d.attempts || 0) + 1,
    ai: false,
  }
  delete design.svg
  delete design.images
  const generated = await aiGenerateDesign(design)
  if (generated.ai) {
    design.images = {
      logo: generated.images.logo,
      card: generated.images.card,
      cardBack: generated.images.cardBack,
    }
    design.ai = true
  }
  design.base = generated.base
  updateOrder(order.id, { design })
  res.json({
    id: order.id,
    attempts: design.attempts,
    max_attempts: design.max_attempts,
    remaining: design.max_attempts - design.attempts,
    ai: !!design.ai,
    preview: {
      logo: `/api/design/${order.id}/logo`,
      card: `/api/design/${order.id}/card`,
      cardBack: `/api/design/${order.id}/card-back`,
    },
  })
})

app.get('/api/design/:id/status', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  const d = order.design || {}
  res.json({
    id: order.id,
    status: order.status,
    confirmed: DESIGN_STATUS_OK.includes(order.status),
    attempts: d.attempts || 0,
    max_attempts: d.max_attempts || 3,
    remaining: (d.max_attempts || 3) - (d.attempts || 0),
    downloadReady: DESIGN_STATUS_OK.includes(order.status),
  })
})

app.get('/api/design/:id/download', (req, res) => {
  const order = requireDesignOrder(req, res)
  if (!order) return
  if (!DESIGN_STATUS_OK.includes(order.status)) {
    return res.status(403).json({ error: 'Töleg tassyklanandan soň ýüklemek açylýar' })
  }
  res.json({
    id: order.id,
    logo: `/api/design/${order.id}/logo?final=1`,
    card: `/api/design/${order.id}/card?final=1`,
    cardBack: `/api/design/${order.id}/card-back?final=1`,
  })
})

app.get('/api/chat/status', (req, res) => {
  res.json(chatStatus())
})

app.post('/api/chat', async (req, res) => {
  const { text = '', messages = [], channel = 'web' } = req.body || {}
  const reply = await chatReply(text, messages)
  addMessage({ from: 'user', channel, text })
  addMessage({ from: 'bot', channel, text: reply.text })
  if (reply.intent === 'order' || detectOrderIntent(text)) {
    createOrder({
      service: detectOrderIntent(text) ? 'Bot sargydy' : 'Web çat',
      name: '',
      phone: (text.match(/\d{8,}/) || [''])[0],
      details: text,
      source: channel,
    })
  }
  res.json(reply)
})

app.post('/api/upload', (req, res) => {
  const { data, name } = req.body || {}
  if (!data || typeof data !== 'string') {
    return res.status(400).json({ error: 'Faýl gerek' })
  }
  const m = data.match(/^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,(.+)$/i)
  if (!m) {
    return res.status(400).json({ error: 'Kabul edilmeýän format (png/jpg/gif/webp/svg gerek)' })
  }
  const ext = m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].replace('svg+xml', 'svg').toLowerCase()
  const buf = Buffer.from(m[2], 'base64')
  if (buf.length > 5 * 1024 * 1024) {
    return res.status(413).json({ error: 'Faýl 5MB-dan uly' })
  }
  const url = saveUpload({ data: buf, ext })
  res.status(201).json({ url, name: name || 'surat' })
})

app.get('/api/admin/verify', (req, res) => {
  const secret = req.headers['x-admin-token']
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN
  if (!ADMIN_TOKEN) {
    return res.json({ ok: false, error: 'ADMIN_TOKEN düzülmedik' })
  }
  const valid = typeof secret === 'string' && secret.length > 0
  res.json({ ok: valid && secret === ADMIN_TOKEN })
})

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API ýoly tapylmady' })
})

const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads')
app.use('/uploads', express.static(UPLOADS_DIR))

app.use(express.static(CLIENT_DIST))

app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`BIRDE API ${PORT} portda işleýär`)
})
