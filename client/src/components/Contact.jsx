import React, { useEffect, useState } from 'react'
import { createOrder, getDesignOptions } from '../api.js'
import { PACKAGES, getPackageById, SERVICE_TO_PACKAGE } from '../packages.js'

export default function Contact({ preselectedService }) {
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0].id)
  const [suggestedPkgs, setSuggestedPkgs] = useState([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    details: '',
  })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [design, setDesign] = useState(null)
  const [designOpts, setDesignOpts] = useState(null)
  const [orderResult, setOrderResult] = useState(null)

  useEffect(() => {
    getDesignOptions().then(setDesignOpts).catch(() => {})
  }, [])

  useEffect(() => {
    if (designOpts) {
      setDesign((d) => ({
        ...(d || {}),
        business_name: d?.business_name || '',
        industry: d?.industry || designOpts.industries[0],
        color: d?.color || designOpts.colors[0].name,
        style: d?.style || designOpts.logoStyles[0],
        card_style: d?.card_style || designOpts.cardStyles[0],
      }))
    }
  }, [designOpts])

  useEffect(() => {
    if (preselectedService) {
      const pkgs = SERVICE_TO_PACKAGE[preselectedService] || []
      if (pkgs.length) {
        setSelectedPkg(pkgs[0])
        setSuggestedPkgs(pkgs)
      }
      setForm((f) => ({
        ...f,
        details: f.details.trim() ? f.details : preselectedService,
      }))
    }
  }, [preselectedService])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.phone || form.phone.replace(/\D/g, '').length < 8) {
      setStatus({ type: 'error', text: 'Telefon belgiňizi doly ýazyň (azyndan 8 san)' })
      return
    }
    setSending(true)
    try {
      const pkg = getPackageById(selectedPkg)
      const body = {
        service: pkg.name,
        name: form.name,
        phone: form.phone,
        email: form.email,
        details: form.details,
        source: 'web',
      }
      if (design && design.business_name) body.design = design
      const order = await createOrder(body)
      setStatus({ type: 'ok', text: 'Sargydyňyz kabul edildi! Ýakyn wagtda size habarlaşarys. 👍' })
      setForm({ name: '', phone: '', email: '', details: '' })
      if (body.design) setOrderResult(order)
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSending(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setD = (k) => (e) => setDesign({ ...design, [k]: e.target.value })

  return (
    <section id="kontakt" className="section section-alt">
      <div className="container contact-grid">
        <div className="contact-info">
          <div className="section-head align-left">
            <h2>Kontakt</h2>
            <p>Her gün işleýäris. Soraglaryňyza jogap bermäge taýýar.</p>
          </div>
          <div className="contact-lines">
            <div className="contact-line">
              <span className="cl-ico">📞</span>
              <div>
                <strong>Telefon</strong>
                <a href="tel:+99362017373">+993 62 017 373</a>
                <a href="tel:+99361847337">+993 61 847 337</a>
              </div>
            </div>
            <div className="contact-line">
              <span className="cl-ico">📧</span>
              <div>
                <strong>E-poçta</strong>
                <a href="mailto:dovrantaganov0@gmail.com">dovrantaganov0@gmail.com</a>
              </div>
            </div>
            <div className="contact-line">
              <span className="cl-ico">💬</span>
              <div>
                <strong>Sosial media</strong>
                <span>Instagram • TikTok</span>
              </div>
            </div>
          </div>
          <div className="contact-phones">
            <a href="https://wa.me/99362017373" className="btn btn-wa" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href="https://t.me/+99362017373" className="btn btn-tg" target="_blank" rel="noreferrer">
              Telegram
            </a>
          </div>
        </div>
        <form className="order-form" id="order-form" onSubmit={submit}>
          <h3>Sargyt formasy</h3>
          <p className="order-form-note">Saýlaýan paketiňizi bellen</p>
          {suggestedPkgs.length > 1 && (
            <p className="pkg-suggest-note">
              ✨ "{preselectedService}" üçin aşakdaky 2 paket degişli — özüňize laýyk birini saýlaň.
            </p>
          )}
          <div className="pkg-select">
            {PACKAGES.map((p, i) => {
              const isSuggested = suggestedPkgs.includes(p.id)
              return (
                <label
                  key={p.id}
                  className={`pkg-card${selectedPkg === p.id ? ' active' : ''}${
                    isSuggested ? ' suggested' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    value={p.id}
                    checked={selectedPkg === p.id}
                    onChange={() => setSelectedPkg(p.id)}
                  />
                  <div className="pkg-head">
                    <span className="pkg-num">{i + 1}</span>
                    <div>
                      <strong>{p.name}</strong>
                      <span className="pkg-short">{p.short}</span>
                    </div>
                    {isSuggested && suggestedPkgs.length > 1 && (
                      <span className="pkg-badge">degişli</span>
                    )}
                    <span className="pkg-check">✓</span>
                  </div>
                  <ul className="pkg-items">
                    {p.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </label>
              )
            })}
          </div>

          {designOpts && !orderResult && (
            <div className="design-wizard">
              <div className="design-wizard-head">
                <span className="design-wizard-ico">🎨</span>
                <div>
                  <strong>Logo dizaýn saýlawlary</strong>
                  <span>Islege görä — logo we wizitka nusgalary taýýarlarys</span>
                </div>
              </div>
              <div className="design-grid">
                <label className="design-full">
                  Kompaniýa ady
                  <input
                    value={design?.business_name || ''}
                    onChange={(e) => setDesign({ ...design, business_name: e.target.value })}
                    placeholder="Meselem: Aşgabat Motors"
                  />
                </label>
                <div className="design-field design-full">
                  <span className="design-label">Ugur</span>
                  <div className="chip-row">
                    {designOpts.industries.map((i) => (
                      <button
                        type="button"
                        key={i}
                        className={`chip${design?.industry === i ? ' sel' : ''}`}
                        onClick={() => setD('industry')({ target: { value: i } })}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="design-field design-full">
                  <span className="design-label">Reňk</span>
                  <div className="chip-row">
                    {designOpts.colors.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        className={`chip${design?.color === c.name ? ' sel' : ''}`}
                        onClick={() => setD('color')({ target: { value: c.name } })}
                      >
                        <span className="chip-swatch" style={{ background: c.color }}></span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="design-field design-full">
                  <span className="design-label">Logo stili</span>
                  <div className="chip-row">
                    {designOpts.logoStyles.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`chip${design?.style === s ? ' sel' : ''}`}
                        onClick={() => setD('style')({ target: { value: s } })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="design-field design-full">
                  <span className="design-label">Wizitka stili</span>
                  <div className="chip-row">
                    {designOpts.cardStyles.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className={`chip${design?.card_style === s ? ' sel' : ''}`}
                        onClick={() => setD('card_style')({ target: { value: s } })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <label>
            Adyňyz
            <input value={form.name} onChange={set('name')} placeholder="Adyňyz" />
          </label>
          <label>
            Telefon belgiňiz <span className="req">*</span>
            <input
              value={form.phone}
              onChange={set('phone')}
              placeholder="+993 ..."
              inputMode="tel"
            />
          </label>
          <label>
            E-poçta (hökmany däl)
            <input value={form.email} onChange={set('email')} placeholder="email@mysal.tm" type="email" />
          </label>
          <label>
            Taslama barada maglumat
            <textarea
              value={form.details}
              onChange={set('details')}
              rows="3"
              placeholder="Taslamanyňyz barada gysgaça ýazyň"
            />
          </label>
          {status && <div className={`form-status ${status.type}`}>{status.text}</div>}
          {orderResult && (
            <div className="design-preview">
              <h4>Logo nusgalary (suw belgili)</h4>
              <div className="design-previews">
                <div>
                  <img src={`/api/design/${orderResult.id}/logo`} alt="Logo nusgasy" />
                  <span>Logo</span>
                </div>
                <div>
                  <img src={`/api/design/${orderResult.id}/card`} alt="Wizitka nusgasy" />
                  <span>Wizitka</span>
                </div>
              </div>
              <p className="design-note">⚠️ Bu diňe nusga (suw alamatly). Doly faýl töleg edilenden soň berilýär.</p>
            </div>
          )}
          <button className="btn btn-primary btn-block btn-lg" disabled={sending}>
            {sending ? 'Iberilýär...' : 'Sargydy iber'}
          </button>
        </form>
      </div>
    </section>
  )
}
