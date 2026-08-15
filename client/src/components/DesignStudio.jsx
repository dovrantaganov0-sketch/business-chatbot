import React, { useEffect, useState } from 'react'
import {
  getDesignOptions,
  getDesignAIStatus,
  generateDesign,
  regenerateDesign,
  getDesignStatus,
  getDesignDownload,
} from '../api.js'

const STEPS = ['info', 'logo', 'card', 'preview', 'pay', 'confirm']

const CONTACTS = {
  phones: ['+993 62 017 373', '+993 61 847 337'],
  email: 'dovrantaganov0@gmail.com',
  wa: 'https://wa.me/99362017373',
  tg: 'https://t.me/+99362017373',
}

export default function DesignStudio({ open, onClose }) {
  const [opts, setOpts] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)
  const [step, setStep] = useState('info')
  const [form, setForm] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
  })
  const [design, setDesign] = useState({})
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState(3)
  const [download, setDownload] = useState(null)

  useEffect(() => {
    if (!open) return
    setStep('info')
    setOrder(null)
    setDownload(null)
    setError('')
    setRemaining(3)
    getDesignOptions().then(setOpts).catch(() => {})
    getDesignAIStatus().then(setAiStatus).catch(() => {})
  }, [open])

  useEffect(() => {
    if (!opts) return
    setDesign((d) => ({
      business_name: d.business_name || '',
      industry: d.industry || opts.industries[0],
      color: d.color || opts.colors[0].name,
      style: d.style || opts.logoStyles[0],
      card_style: d.card_style || opts.cardStyles[0],
    }))
  }, [opts])

  if (!open || !opts) return null

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setD = (k) => (v) => setDesign({ ...design, [k]: v })

  const validateInfo = () => {
    if (!form.business_name.trim()) return 'Kompaniýa ady hökmany'
    if (form.phone.replace(/\D/g, '').length < 8) return 'Telefon belgi doly däl (azyndan 8 san)'
    return ''
  }

  const create = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await generateDesign({ ...form, ...design })
      setOrder(res)
      setRemaining(res.remaining)
      setStep('preview')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const regenerate = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await regenerateDesign(order.id)
      setOrder(res)
      setRemaining(res.remaining)
      setStep('preview')
    } catch (e) {
      setError(e.message)
      if (e.message.includes('çägi')) setRemaining(0)
    } finally {
      setBusy(false)
    }
  }

  const pay = async () => {
    setStep('confirm')
    const poll = async () => {
      const st = await getDesignStatus(order.id)
      if (st.downloadReady) {
        const dl = await getDesignDownload(order.id)
        setDownload(dl)
        setStep('confirm')
        return
      }
      setTimeout(poll, 5000)
    }
    poll()
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div className="ds-overlay">
      <div className="ds-window">
        <div className="ds-head">
          <div className="ds-head-left">
            <span className="ds-logo">B</span>
            <div>
              <strong>Logo + Wizitka dizaýn studia</strong>
              <span className="ds-sub">
                {aiStatus?.ai
                  ? `AI generasiýa (${aiStatus.provider || 'AI'})`
                  : 'Şablon generasiýa'}
              </span>
            </div>
          </div>
          <button className="ds-close" onClick={onClose} aria-label="Ýap">✕</button>
        </div>

        <div className="ds-body">
          <div className="ds-steps">
            {STEPS.slice(0, 4).map((s, i) => (
              <div key={s} className={`ds-step${i === stepIndex ? ' active' : ''}${i < stepIndex ? ' done' : ''}`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
            ))}
          </div>

          {step === 'info' && (
            <div className="ds-section">
              <h3>Esasy maglumatlar</h3>
              <p className="ds-hint">Kompaniýaňyz barada aýdyň — dizaýny şoňa görä dözeris.</p>
              <label className="ds-field">
                Kompaniýa ady <span className="req">*</span>
                <input value={form.business_name} onChange={set('business_name')} placeholder="Meselem: Aşgabat Motors" />
              </label>
              <div className="ds-field">
                <span className="ds-label">Ugur</span>
                <div className="chip-row">
                  {opts.industries.map((i) => (
                    <button type="button" key={i} className={`chip${design.industry === i ? ' sel' : ''}`} onClick={() => setD('industry')(i)}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <label className="ds-field">
                Telefon belgi <span className="req">*</span>
                <input value={form.phone} onChange={set('phone')} placeholder="+993 ..." inputMode="tel" />
              </label>
              <label className="ds-field">
                Adyňyz
                <input value={form.name} onChange={set('name')} placeholder="Adyňyz (hökmany däl)" />
              </label>
              <label className="ds-field">
                E-poçta (hökmany däl)
                <input value={form.email} onChange={set('email')} placeholder="email@mysal.tm" type="email" />
              </label>
              <div className="ds-nav">
                <button className="btn btn-primary btn-lg" onClick={() => setStep('logo')}>Dowam →</button>
              </div>
            </div>
          )}

          {step === 'logo' && (
            <div className="ds-section">
              <h3>Logo saýlawlary</h3>
              <div className="ds-field">
                <span className="ds-label">Reňk</span>
                <div className="chip-row">
                  {opts.colors.map((c) => (
                    <button type="button" key={c.name} className={`chip${design.color === c.name ? ' sel' : ''}`} onClick={() => setD('color')(c.name)}>
                      <span className="chip-swatch" style={{ background: c.color }}></span>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ds-field">
                <span className="ds-label">Logo stili</span>
                <div className="chip-row">
                  {opts.logoStyles.map((s) => (
                    <button type="button" key={s} className={`chip${design.style === s ? ' sel' : ''}`} onClick={() => setD('style')(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ds-nav">
                <button className="btn btn-outline btn-lg" onClick={() => setStep('info')}>← Yza</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep('card')}>Dowam →</button>
              </div>
            </div>
          )}

          {step === 'card' && (
            <div className="ds-section">
              <h3>Wizitka saýlawlary</h3>
              <div className="ds-field">
                <span className="ds-label">Wizitka stili</span>
                <div className="chip-row">
                  {opts.cardStyles.map((s) => (
                    <button type="button" key={s} className={`chip${design.card_style === s ? ' sel' : ''}`} onClick={() => setD('card_style')(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ds-nav">
                <button className="btn btn-outline btn-lg" onClick={() => setStep('logo')}>← Yza</button>
                <button className="btn btn-primary btn-lg" onClick={create} disabled={busy}>
                  {busy ? 'Generasiýa edilýär...' : 'Generasiýa et'}
                </button>
              </div>
              {error && <div className="form-status error">{error}</div>}
            </div>
          )}

          {step === 'preview' && order && (
            <div className="ds-section">
              <div className="ds-preview-head">
                <h3>Nusgalar</h3>
                <span className="ds-remaining">Galýan üýtgetme: {remaining}</span>
              </div>
              <p className="ds-note">⚠️ Bu nusga suw alamatly. Doly faýl töleg tassyklanandan soň berilýär.</p>
              <div className="ds-previews">
                <div className="ds-preview-item">
                  <span className="ds-preview-tag">Logo</span>
                  <img src={`${order.preview.logo}?t=${order.attempts}`} alt="Logo nusgasy" />
                </div>
                <div className="ds-preview-item">
                  <span className="ds-preview-tag">Wizitka — öňi</span>
                  <img src={`${order.preview.card}?t=${order.attempts}`} alt="Wizitka öňi" />
                </div>
                <div className="ds-preview-item">
                  <span className="ds-preview-tag">Wizitka — arkasy</span>
                  <img src={`${order.preview.cardBack}?t=${order.attempts}`} alt="Wizitka arkasy" />
                </div>
              </div>
              <div className="ds-nav">
                <button className="btn btn-outline btn-lg" onClick={() => setStep('card')}>← Yza</button>
                {remaining > 0 && (
                  <button className="btn btn-outline btn-lg" onClick={regenerate} disabled={busy}>
                    {busy ? 'Täzeden...' : `Ýene döret (${remaining})`}
                  </button>
                )}
                <button className="btn btn-primary btn-lg" onClick={pay}>
                  Halady — töleg
                </button>
              </div>
              {error && <div className="form-status error">{error}</div>}
            </div>
          )}

          {step === 'confirm' && order && (
            <div className="ds-section ds-pay">
              <h3>{download ? 'Faýllaryňyz taýýar!' : 'Töleg tassyklamasy'}</h3>
              {!download ? (
                <>
                  <p className="ds-hint">
                    Töleg üçin adminimiz bilen habarlaşyň. Töleg tassyklanandan soň faýllar şu ýerde açylýar.
                  </p>
                  <div className="ds-contact-card">
                    <strong>{CONTACTS.phones.join(' • ')}</strong>
                    <span>{CONTACTS.email}</span>
                    <div className="contact-phones">
                      <a className="btn btn-wa" href={CONTACTS.wa} target="_blank" rel="noreferrer">WhatsApp</a>
                      <a className="btn btn-tg" href={CONTACTS.tg} target="_blank" rel="noreferrer">Telegram</a>
                    </div>
                  </div>
                  <p className="ds-hint">Sargyt №{order.id}. Tölegi aýdandan soň bu sahypada garaşyň — faýllar awtomatik açylýar.</p>
                </>
              ) : (
                <>
                  <p className="ds-hint">Töleg tassyklandy. Faýllary aşakdan ýükläp bilersiňiz.</p>
                  <div className="ds-downloads">
                    <a className="btn btn-primary" href={`${download.logo}`} download="logo.svg">Logo ýükle (SVG)</a>
                    <a className="btn btn-primary" href={`${download.card}`} download="wizitka-ön.svg">Wizitka öňi (SVG)</a>
                    <a className="btn btn-primary" href={`${download.cardBack}`} download="wizitka-arka.svg">Wizitka arkasy (SVG)</a>
                  </div>
                  <button className="btn btn-outline" onClick={onClose}>Ýap</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
