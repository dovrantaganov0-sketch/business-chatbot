import React, { useState, useRef } from 'react'
import { uploadImage } from '../api.js'

const TYPES = [
  'Logo dizaýny',
  'Wizitka',
  '3D dizaýn',
  'Sosial media postlary',
  'Web sahypa',
  'Logo animasiýasy',
  'Düşündiriş wideo',
]

const TAGS = ['Logo', 'Web', 'Motion', '3D', 'Dizaýn', 'SMM', 'Anim']

const EMPTY = { title: '', type: 'Logo dizaýny', tag: 'Logo', image: '', description: '' }

export default function WorksManager({ works, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY)
  const [msg, setMsg] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg(null)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, image: url }))
      setMsg({ type: 'ok', text: 'Surat ýüklendi!' })
      setTimeout(() => setMsg(null), 2500)
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setMsg({ type: 'error', text: 'Işiň adyny ýazyň' })
      return
    }
    try {
      await onAdd({ ...form, title: form.title.trim(), description: form.description.trim() })
      setForm({ ...EMPTY, type: form.type, tag: form.tag })
      setMsg({ type: 'ok', text: 'Iş goşuldy!' })
      setTimeout(() => setMsg(null), 2500)
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="works-manager">
      <form className="work-form" onSubmit={submit}>
        <h3>Täze iş goşmak</h3>
        <div className="work-form-grid">
          <label>
            Işiň ady <span className="req">*</span>
            <input value={form.title} onChange={set('title')} placeholder="Mysal: Kärendes logo" />
          </label>
          <label>
            Hyzmat görnüşi
            <select value={form.type} onChange={set('type')}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Bellik (tag)
            <select value={form.tag} onChange={set('tag')}>
              {TAGS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Surat
            <div className="work-upload">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
              <button
                type="button"
                className="btn btn-ghost"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? 'Ýüklenýär...' : '📤 Surat ýükle'}
              </button>
              {form.image && (
                <img className="work-upload-preview" src={form.image} alt="Surat öňünden" />
              )}
            </div>
          </label>
        </div>
        <label>
          Surat URL (hökmany däl, ýa-da ýokardan ýükläň)
          <input value={form.image} onChange={set('image')} placeholder="https://mysal.tm/surat.jpg" />
        </label>
        <label>
          Düşündiriş (hökmany däl)
          <textarea
            value={form.description}
            onChange={set('description')}
            rows="2"
            placeholder="Bu iş barada gysgaça"
          />
        </label>
        {msg && <div className={`form-status ${msg.type}`}>{msg.text}</div>}
        <button className="btn btn-primary" disabled={!form.title.trim()}>
          + Iş goş
        </button>
        <p className="work-form-hint">
          Surat goýmasaňyz, iş awtomatiki stil görnüşinde görkeziler.
        </p>
      </form>

      <div className="work-admin-list">
        <h3>Siziň işleriňiz ({works.length})</h3>
        {works.length === 0 && <p className="empty">Entäk iş ýok. Ýokardaky forma bilen goşuň.</p>}
        {works.map((w) => (
          <div className="work-admin-row" key={w.id}>
            <div className="work-admin-visual">
              {w.image ? (
                <img src={w.image} alt={w.title} />
              ) : (
                <span className="work-admin-pattern">{w.tag}</span>
              )}
            </div>
            <div className="work-admin-info">
              <strong>{w.title}</strong>
              <p>
                {w.type} • <span className="work-admin-tag">{w.tag}</span>
              </p>
              {w.description && <p className="work-admin-desc">{w.description}</p>}
            </div>
            <button className="btn-danger btn-sm" onClick={() => onDelete(w.id, w.title)}>
              Poz
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
