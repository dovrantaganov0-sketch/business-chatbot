import React, { useEffect, useState } from 'react'
import { getWorks } from '../api.js'

const FALLBACK = [
  { type: 'Logo dizaýny', title: 'Kärendes', tag: 'Logo' },
  { type: 'Web sahypa', title: 'Onlaýn dükan', tag: 'Web' },
  { type: 'Düşündiriş wideo', title: 'Önüm tanıdış', tag: 'Motion' },
  { type: '3D dizaýn', title: 'Önüm modeli', tag: '3D' },
  { type: 'Wizitka', title: 'Korporatiw stil', tag: 'Dizaýn' },
  { type: 'Logo animasiýasy', title: 'Brend janlanmasy', tag: 'Anim' },
]

export default function Work() {
  const [works, setWorks] = useState(null)

  useEffect(() => {
    getWorks()
      .then((w) => setWorks(w && w.length ? w : FALLBACK))
      .catch(() => setWorks(FALLBACK))
  }, [])

  return (
    <section id="işler" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <h2>Işlerimiz</h2>
          <p>Biz döredýän işlerden nusgalar</p>
        </div>
        <div className="work-grid">
          {!works
            ? Array.from({ length: 6 }).map((_, i) => <div className="work-card skeleton" key={i} />)
            : works.map((w, i) => (
                <div className="work-card" key={w.id ?? i}>
                  <div className="work-visual">
                    <span className="work-tag">{w.tag}</span>
                    {w.image ? (
                      <img className="work-img" src={w.image} alt={w.title} />
                    ) : (
                      <div className={`work-pattern pattern-${i % 3}`}></div>
                    )}
                  </div>
                  <div className="work-info">
                    <p className="work-type">{w.type}</p>
                    <h3>{w.title}</h3>
                    {w.description && <p className="work-desc">{w.description}</p>}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
