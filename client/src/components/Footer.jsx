import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <span className="brand-name">BIRDE</span>
          <p>Sanly hyzmatlar birleşigi</p>
        </div>
        <div className="footer-links">
          <a href="#hyzmatlar">Hyzmatlar</a>
          <a href="#işler">Işlerimiz</a>
          <a href="#bahalar">Bahalar</a>
          <a href="#kontakt">Kontakt</a>
        </div>
        <div className="footer-contact">
          <a href="tel:+99362017373">+993 62 017 373</a>
          <a href="mailto:dovrantaganov0@gmail.com">dovrantaganov0@gmail.com</a>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} BIRDE. Ähli hukuklar goralan.
      </div>
    </footer>
  )
}
