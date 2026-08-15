import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

const DEFAULT_DB = {
  orders: [],
  customers: [],
  messages: [],
  works: [],
  seq: 1,
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2))
  }
}

function load() {
  ensureFile()
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return { ...DEFAULT_DB, ...data }
  } catch (e) {
    return { ...DEFAULT_DB }
  }
}

function save(data) {
  ensureFile()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function nextId(data, key) {
  const id = data.seq
  data.seq += 1
  return id
}

export function listOrders() {
  return load().orders
}

export function createOrder(order) {
  const data = load()
  const id = nextId(data)
  const now = new Date().toISOString()
  const rec = {
    id,
    service: order.service || 'Beýleki',
    name: order.name || '',
    phone: order.phone || '',
    email: order.email || '',
    details: order.details || '',
    source: order.source || 'web',
    status: 'new',
    createdAt: now,
    design: order.design || null,
  }
  data.orders.unshift(rec)
  save(data)
  return rec
}

export function updateOrderStatus(id, status) {
  const data = load()
  const rec = data.orders.find((o) => o.id === Number(id))
  if (!rec) return null
  rec.status = status
  save(data)
  return rec
}

export function getOrder(id) {
  return load().orders.find((o) => o.id === Number(id)) || null
}

export function updateOrder(id, patch) {
  const data = load()
  const rec = data.orders.find((o) => o.id === Number(id))
  if (!rec) return null
  for (const k of Object.keys(patch)) {
    if (k === 'design') {
      rec.design = { ...(rec.design || {}), ...(patch.design || {}) }
    } else if (patch[k] !== undefined) {
      rec[k] = patch[k]
    }
  }
  save(data)
  return rec
}

export function deleteOrder(id) {
  const data = load()
  const before = data.orders.length
  data.orders = data.orders.filter((o) => o.id !== Number(id))
  if (data.orders.length === before) return false
  save(data)
  return true
}

export function addCustomer(customer) {
  const data = load()
  let existing = data.customers.find(
    (c) => c.phone === customer.phone || c.instagram === customer.instagram
  )
  if (existing) {
    existing.lastSeen = new Date().toISOString()
    existing.ordersCount = (existing.ordersCount || 0) + (customer.ordersCount || 0)
    save(data)
    return existing
  }
  const id = nextId(data)
  const rec = {
    id,
    name: customer.name || '',
    phone: customer.phone || '',
    instagram: customer.instagram || '',
    tiktok: customer.tiktok || '',
    ordersCount: customer.ordersCount || 0,
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  }
  data.customers.unshift(rec)
  save(data)
  return rec
}

export function listCustomers() {
  return load().customers
}

export function addMessage(msg) {
  const data = load()
  const id = nextId(data)
  const rec = {
    id,
    from: msg.from || 'user',
    channel: msg.channel || 'web',
    text: msg.text || '',
    orderId: msg.orderId || null,
    createdAt: new Date().toISOString(),
  }
  data.messages.push(rec)
  if (data.messages.length > 500) data.messages = data.messages.slice(-500)
  save(data)
  return rec
}

export function listMessages() {
  return load().messages
}

export function listWorks() {
  return load().works
}

export function saveUpload({ data, ext = 'png' }) {
  const name = `w-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`
  const dir = path.join(DATA_DIR, 'uploads')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, name)
  fs.writeFileSync(file, data)
  return `/uploads/${name}`
}

export function createWork(work) {
  const data = load()
  const id = nextId(data)
  const rec = {
    id,
    title: work.title || 'Adsyz iş',
    type: work.type || 'Dizaýn',
    tag: work.tag || 'Dizaýn',
    image: work.image || '',
    description: work.description || '',
    sort: work.sort != null ? Number(work.sort) : Date.now(),
    createdAt: new Date().toISOString(),
  }
  data.works.push(rec)
  save(data)
  return rec
}

export function updateWork(id, patch) {
  const data = load()
  const rec = data.works.find((w) => w.id === Number(id))
  if (!rec) return null
  for (const k of ['title', 'type', 'tag', 'image', 'description', 'sort']) {
    if (k in patch && patch[k] != null) rec[k] = patch[k]
  }
  save(data)
  return rec
}

export function deleteWork(id) {
  const data = load()
  const before = data.works.length
  data.works = data.works.filter((w) => w.id !== Number(id))
  if (data.works.length === before) return false
  save(data)
  return true
}

export function getStats() {
  const data = load()
  const orders = data.orders
  const customers = data.customers
  const messages = data.messages
  const now = Date.now()
  const DAY = 24 * 60 * 60 * 1000

  const dayLabels = ['Ýek', 'Duş', 'Siş', 'Çar', 'Pen', 'Ann', 'Şen']

  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const start = new Date(now - i * DAY)
    start.setHours(0, 0, 0, 0)
    const end = start.getTime() + DAY
    const count = orders.filter((o) => {
      const d = new Date(o.createdAt).getTime()
      return d >= start.getTime() && d < end
    }).length
    last7.push({
      date: start.toISOString().slice(0, 10),
      label: dayLabels[start.getDay()],
      count,
    })
  }

  const byStatus = {
    new: 0,
    contacted: 0,
    in_progress: 0,
    done: 0,
  }
  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1
  }

  const byService = {}
  for (const o of orders) {
    byService[o.service] = (byService[o.service] || 0) + 1
  }
  const serviceRows = Object.entries(byService)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  const bySource = {}
  for (const o of orders) {
    bySource[o.source] = (bySource[o.source] || 0) + 1
  }
  const sourceRows = Object.entries(bySource).map(([name, count]) => ({ name, count }))

  const weekAgo = now - 7 * DAY
  const newCustomers7d = customers.filter((c) => new Date(c.createdAt).getTime() >= weekAgo).length
  const newOrders7d = orders.filter((o) => new Date(o.createdAt).getTime() >= weekAgo).length

  const byChannel = {}
  for (const m of messages) {
    byChannel[m.channel] = (byChannel[m.channel] || 0) + 1
  }

  return {
    totals: {
      orders: orders.length,
      customers: customers.length,
      messages: messages.length,
    },
    byStatus,
    byService: serviceRows,
    bySource: sourceRows,
    last7,
    newOrders7d,
    newCustomers7d,
    byChannel,
  }
}
