import React from 'react'

export default function Navbar({ onStudio }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#/" className="brand">
          <span className="brand-mark">B</span>
          <span className="brand-name">BIRDE</span>
        </a>
        <nav className="nav-links">
          <a href="#hyzmatlar">Hyzmatlar</a>
          <a href="#işler">Işlerimiz</a>
          <a href="#bahalar">Bahalar</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
        <div className="nav-actions">
          {onStudio && (
            <button className="btn btn-primary btn-sm" onClick={onStudio}>
              🎨 Dizaýn et
            </button>
          )}
          <a href="tel:+99362017373" className="btn btn-outline btn-sm">
            📞 +993 62 017 373
          </a>
          <a href="#kontakt" className="btn btn-outline btn-sm">
            Sargyt et
          </a>
        </div>
      </div>
    </header>
  )
}
