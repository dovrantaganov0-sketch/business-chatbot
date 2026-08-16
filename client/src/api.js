const API = '/api'

async function request(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Sorag ýalňyş boldy (${res.status})`)
  }
  return res.json()
}

export const getServices = () => request('/services')
export const getOrders = () => request('/orders')
export const getCustomers = () => request('/customers')
export const getMessages = () => request('/messages')
export const getStats = () => request('/stats')

export const getWorks = () => request('/works')
export const createWork = (work) =>
  request('/works', { method: 'POST', body: JSON.stringify(work) })
export const updateWork = (id, patch) =>
  request(`/works/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
export const deleteWork = (id) => request(`/works/${id}`, { method: 'DELETE' })

export const createOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) })

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })

export const deleteOrder = (id) =>
  request(`/orders/${id}`, { method: 'DELETE' })

export const sendBotMessage = (text, channel = 'web') =>
  request('/bot/message', { method: 'POST', body: JSON.stringify({ text, channel }) })

export const sendChatMessage = (text, messages, channel = 'web') =>
  request('/chat', { method: 'POST', body: JSON.stringify({ text, messages, channel }) })

export const getChatStatus = () => request('/chat/status')

export const getDesignOptions = () => request('/design/options')

export const getDesignAIStatus = () => request('/design/ai-status')

export const generateDesign = (data) =>
  request('/design/generate', { method: 'POST', body: JSON.stringify(data) })

export const regenerateDesign = (id) =>
  request(`/design/${id}/regenerate`, { method: 'POST' })

export const getDesignStatus = (id) => request(`/design/${id}/status`)

export const getDesignDownload = (id) => request(`/design/${id}/download`)

export const uploadImage = async (file) => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onerror = () => reject(new Error('Faýl okap bolmady'))
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result, name: file.name }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Ýüklemek ýalňyşdy')
        resolve(data.url)
      } catch (e) {
        reject(e)
      }
    }
    reader.readAsDataURL(file)
  })
}

export const verifyAdmin = async (token) => {
  const data = await request('/admin/verify', { headers: { 'x-admin-token': token } })
  return !!(data && data.ok)
}
