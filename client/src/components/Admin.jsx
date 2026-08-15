import React, { useEffect, useState } from 'react'
import {
  getOrders,
  getCustomers,
  getMessages,
  getStats,
  getWorks,
  createWork,
  deleteWork,
  updateOrderStatus,
  deleteOrder,
  verifyAdmin,
} from '../api.js'
import StatsPanel from './StatsPanel.jsx'
import WorksManager from './WorksManager.jsx'

const STATUS_LABELS = {
  new: 'Täze',
  contacted: 'Habarlaşyldy',
  in_progress: 'Işde',
  paid: 'Töleg tassyklandy',
  done: 'Tamamlandy',
}

export default function Admin({ onBack }) {
  const [authed, setAuthed] = useState(false)
  const [token, setToken] = useState('')
  const [tried, setTried] = useState(false)
  const [tab, setTab] = useState('stats')
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [messages, setMessages] = useState([])
  const [works, setWorks] = useState([])
  const [stats, setStats] = useState(null)

  const load = async () => {
    const [o, c, m, s, w] = await Promise.all([
      getOrders(),
      getCustomers(),
      getMessages(),
      getStats(),
      getWorks(),
    ])
    setOrders(o)
    setCustomers(c)
    setMessages(m)
    setStats(s)
    setWorks(w)
  }

  useEffect(() => {
    if (authed) load()
  }, [authed])

  const login = async (e) => {
    e.preventDefault()
    const ok = await verifyAdmin(token.trim())
    setAuthed(ok)
    setTried(true)
    if (ok) load()
  }

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Bu sargydy pozmalymy?')) return
    await deleteOrder(id)
    load()
  }

  const addWork = async (form) => {
    await createWork(form)
    load()
  }

  const removeWork = async (id, title) => {
    if (!confirm(`"${title}" işini pozmalymy?`)) return
    await deleteWork(id)
    load()
  }

  if (!authed) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h2>Admin giriş</h2>
          <p>Dolandyryş paneline girmek üçin paroly ýazyň.</p>
          <form onSubmit={login}>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin paroly"
            />
            <button className="btn btn-primary btn-block">Gir</button>
          </form>
          {tried && !authed && <div className="form-status error">Ýalňyş parol</div>}
          <button className="link-btn" onClick={onBack}>
            ← Sahypa gaýdyn
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div className="container admin-head-inner">
          <div>
            <h1>BIRDE Dolandyryş</h1>
          </div>
          <div className="admin-actions">
            <button className="btn btn-outline btn-sm" onClick={onBack}>
              Sahypa
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setAuthed(false)}>
              Çyk
            </button>
          </div>
        </div>
      </header>
      <div className="container admin-body">
        <div className="admin-stats">
          <div className="stat-box"><strong>{stats?.totals?.orders ?? 0}</strong><span>Ähli sargyt</span></div>
          <div className="stat-box warn"><strong>{stats?.byStatus?.new ?? 0}</strong><span>Täze</span></div>
          <div className="stat-box info"><strong>{stats?.byStatus?.in_progress ?? 0}</strong><span>Işde</span></div>
          <div className="stat-box ok"><strong>{stats?.byStatus?.done ?? 0}</strong><span>Tamamlanan</span></div>
          <div className="stat-box"><strong>{stats?.totals?.customers ?? 0}</strong><span>Müşderi</span></div>
          <div className="stat-box"><strong>{stats?.totals?.messages ?? 0}</strong><span>Çat ýazgy</span></div>
        </div>
        <div className="admin-tabs">
          <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>
            Statistika
          </button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
            Sargytlar ({orders.length})
          </button>
          <button className={tab === 'customers' ? 'active' : ''} onClick={() => setTab('customers')}>
            Müşderiler ({customers.length})
          </button>
          <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
            Çat ýazgylary ({messages.length})
          </button>
          <button className={tab === 'works' ? 'active' : ''} onClick={() => setTab('works')}>
            Portfolio ({works.length})
          </button>
        </div>

        {tab === 'stats' && <StatsPanel stats={stats} />}

        {tab === 'works' && (
          <WorksManager works={works} onAdd={addWork} onDelete={removeWork} />
        )}

        {tab === 'orders' && (
          <div className="admin-list">
            {orders.length === 0 && <p className="empty">Entäk sargyt ýok.</p>}
            {orders.map((o) => (
              <div className={`order-row status-${o.status}`} key={o.id}>
                <div className="order-main">
                  <span className="order-id">#{o.id}</span>
                  <div>
                    <strong>{o.service}</strong>
                    <p>
                      {o.name || 'Ady ýok'} • {o.phone}
                      {o.email && ` • ${o.email}`}
                    </p>
                    {o.details && <p className="order-details">{o.details}</p>}
                  </div>
                </div>
                <div className="order-side">
                  <span className={`status-badge ${o.status}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                  <span className="order-date">{new Date(o.createdAt).toLocaleString()}</span>
                  <span className="order-source">{o.source}</span>
                  <div className="order-actions">
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <button className="btn-danger btn-sm" onClick={() => remove(o.id)}>
                      Poz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'customers' && (
          <div className="admin-list">
            {customers.length === 0 && <p className="empty">Entäk müşderi ýok.</p>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ady</th>
                  <th>Telefon</th>
                  <th>Instagram</th>
                  <th>Sargytlary</th>
                  <th>Soňky görnüş</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.instagram || '—'}</td>
                    <td>{c.ordersCount}</td>
                    <td>{new Date(c.lastSeen).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'messages' && (
          <div className="admin-list">
            {messages.length === 0 && <p className="empty">Entäk ýazgy ýok.</p>}
            {[...messages].reverse().map((m) => (
              <div className={`msg-row ${m.from}`} key={m.id}>
                <span className="msg-from">{m.from === 'bot' ? '🤖' : '👤'}</span>
                <div>
                  <p>{m.text}</p>
                  <span className="msg-meta">
                    {m.channel} • {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
