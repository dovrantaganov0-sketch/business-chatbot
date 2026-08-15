import React, { useEffect, useState } from 'react'
import { getWorks } from '../api.js'

export default function Hero({ onStudio }) {
  const [works, setWorks] = useState([])

  useEffect(() => {
    getWorks()
      .then((w) => setWorks(Array.isArray(w) ? w.slice(-2) : []))
      .catch(() => setWorks([]))
  }, [])

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="hero-tag">Sanly hyzmatlar birleşigi 🇹🇲</p>
          <h1>
            Brendiňizi <span className="gradient-text">sanly dünýäde</span>{' '}
            ösdürýäris
          </h1>
          <p className="hero-sub">
            Logo dizaýny, wizitka, web sahypa, 3D dizaýn, sosial media postlary we
            düşündiriş wideolar — hemmesi bir ýerde.
          </p>
          <div className="hero-actions">
            {onStudio && (
              <button className="btn btn-primary btn-lg" onClick={onStudio}>
                🎨 Logo + Wizitka dizaýn et
              </button>
            )}
            <a href="#kontakt" className="btn btn-primary btn-lg">
              Sargyt et
            </a>
            <a href="#hyzmatlar" className="btn btn-outline btn-lg">
              Hyzmatlary gör
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>7+</strong>
              <span>Hyzmat ugry</span>
            </div>
            <div className="stat">
              <strong>3</strong>
              <span>Dil (TM/RU/EN)</span>
            </div>
            <div className="stat">
              <strong>45-75 s</strong>
              <span>Wideo möhleti</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hc-top">
            <span className="hc-logo">B</span>
            <span className="hc-title">BIRDE Design</span>
          </div>
          <div className="hc-body">
            <div className="hc-line"></div>
            <div className="hc-line short"></div>
            <div className="hc-thumbs">
              {works.length
                ? works.map((w, i) => (
                    <div className="hc-thumb" key={w.id ?? i}>
                      {w.image ? (
                        <img className="hc-thumb-img" src={w.image} alt={w.title || ''} />
                      ) : (
                        <span className="hc-thumb-title">{w.title || 'Iş'}</span>
                      )}
                    </div>
                  ))
                : (
                  <>
                    <div className="hc-thumb"></div>
                    <div className="hc-thumb"></div>
                  </>
                )}
            </div>
          </div>
          <div className="hc-tags">
            <span>#Logo</span>
            <span>#Web</span>
            <span>#3D</span>
            <span>#Wideo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
