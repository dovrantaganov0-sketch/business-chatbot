import React from 'react'

const PLANS = [
  {
    name: 'Logo dizaýny',
    price: 'Şertli',
    unit: '3 wariant',
    features: ['3 logo warianty', '2 düzediş turý', 'Faýl taýýarlamak', 'Möhlet: 3-5 gün'],
    popular: true,
  },
  {
    name: 'Web sahypa',
    price: 'Şertli',
    unit: 'başlangyç',
    features: ['Döwrebap dizaýn', 'Mobil görnüş', 'Kontakt forma', 'Sargyt boýunça'],
    popular: false,
  },
  {
    name: 'Düşündiriş wideo',
    price: 'Şertli',
    unit: '45-75 s',
    features: ['Türkmen/Rus/Ýnlis dili', 'Motion graphic', 'Ses ýazuwy', 'Sargyt boýunça'],
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="bahalar" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Bahalar</h2>
          <p>Taslamanyň çylşyrymlylygyna görä takyk baha</p>
        </div>
        <div className="pricing-note">
          Takyk baha üçin biz bilen habarlaşyň — 24 sagadyň içinde teklip bereris.
        </div>
        <div className="pricing-grid">
          {PLANS.map((p) => (
            <div className={`pricing-card${p.popular ? ' popular' : ''}`} key={p.name}>
              {p.popular && <span className="badge">Iň köp sargyt</span>}
              <h3>{p.name}</h3>
              <div className="price">
                <strong>{p.price}</strong>
                <span>{p.unit}</span>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#kontakt" className="btn btn-primary btn-block">
                Sargyt et
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
