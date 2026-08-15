import React, { useState, useRef, useEffect } from 'react'
import { sendChatMessage, createOrder } from '../api.js'

const QUICK = ['Salam', 'Hyzmatlar', 'Baha', 'Möhlet', 'Töleg', 'Kontakt', 'Sargyt']

const WELCOME =
  "Salam! BIRDE sanly hyzmatlar birleşigi hoş geldiňiz 👋\n" +
  'Aşakdaky düwmelerden saýlaň ýa-da soragyňyzy ýazyň.'

export default function ChatWidget({ services }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [orderStep, setOrderStep] = useState(null)
  const [orderData, setOrderData] = useState({})
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, open])

  const push = (from, text) => setMessages((m) => [...m, { from, text }])

  const askOrder = (step) => {
    if (step === 'service') {
      const list = (services.length ? services : [{ id: 'x', name: 'Logo dizaýny' }, { id: 'y', name: 'Wizitka' }, { id: 'z', name: 'Web sahypa' }])
        .map((s) => s.name)
        .join(', ')
      push('bot', `Haýsy hyzmat gerek? (Mysal: ${list})`)
      setOrderStep('service')
    } else if (step === 'name') {
      push('bot', 'Adyňyz näme?')
      setOrderStep('name')
    } else if (step === 'phone') {
      push('bot', 'Telefon belgiňizi ýazyň 📞')
      setOrderStep('phone')
    } else if (step === 'done') {
      const { service, name, phone } = orderData
      createOrder({ service: service || 'Bot sargydy', name: name || '', phone: phone || '', source: 'bot' })
        .then(() => {
          push('bot', `Sargydyňyz kabul edildi! ✅\n${service} • ${name || '—'} • ${phone}\nÝakyn wagtda operatorymyz size habarlaşar.`)
          setOrderStep(null)
          setOrderData({})
        })
        .catch((e) => push('bot', `Ýalňyşlyk boldy: ${e.message}`))
    }
  }

  const handleSend = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || busy) return
    setInput('')
    push('user', text)

    if (orderStep) {
      if (orderStep === 'service') {
        const nd = { ...orderData, service: text }
        setOrderData(nd)
        setOrderStep('name')
        push('bot', `Düşündi: ${text}. Indi adyňyzy ýazyň.`)
      } else if (orderStep === 'name') {
        setOrderData({ ...orderData, name: text })
        setOrderStep('phone')
        push('bot', 'Telefon belgiňizi ýazyň 📞')
      } else if (orderStep === 'phone') {
        if (text.replace(/\D/g, '').length < 8) {
          push('bot', 'Telefon belgi doly däl. Ýene ýazyň (mysal: +993 62 017 373)')
          return
        }
        setOrderData({ ...orderData, phone: text })
        setOrderStep('done')
        askOrder('done')
      }
      return
    }

    const low = text.toLowerCase()
    if (low.includes('sargyt')) {
      setOrderStep('service')
      askOrder('service')
      return
    }

    setBusy(true)
    try {
      const reply = await sendChatMessage(text, messages.slice(1))
      push('bot', reply.text)
    } catch (e) {
      push('bot', 'Jogap almada ýalňyşlyk boldy. Soňra synanyşyň.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      {open && (
        <div className="chat-window">
          <div className="chat-head">
            <span className="chat-avatar">B</span>
            <div>
              <strong>BIRDE Bot</strong>
              <span className="chat-online">● Onlaýn</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.text.split('\n').map((l, j) => (
                  <span key={j}>
                    {l}
                    <br />
                  </span>
                ))}
              </div>
            ))}
            {busy && <div className="chat-msg bot typing">Ýazýar...</div>}
          </div>
          <div className="chat-quick">
            {QUICK.map((q) => (
              <button key={q} onClick={() => handleSend(q)} disabled={busy}>
                {q}
              </button>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Soragyňyzy ýazyň..."
            />
            <button onClick={() => handleSend()} disabled={busy}>
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Çat">
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
