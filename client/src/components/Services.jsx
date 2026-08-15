import React from 'react'

const ICONS = ['🎨', '📇', '🧊', '📱', '🌐', '✨', '🎬']

export default function Services({ services, onOrder }) {
  const list = services.length
    ? services
    : [
        { id: 'logo', name: 'Logo dizaýny', desc: 'Özboluşly we täsirli logo' },
        { id: 'biznes-kart', name: 'Wizitka', desc: 'Döwrebap wizitka dizaýny' },
        { id: '3d', name: '3D dizaýn', desc: 'Real 3D görkezmeler' },
        { id: 'smm', name: 'Sosial media postlary', desc: 'Üns çekiji postlar' },
        { id: 'web', name: 'Web sahypa', desc: 'Döwrebap web sahypalar' },
        { id: 'logo-anim', name: 'Logo animasiýasy', desc: 'Janly logo' },
        { id: 'video', name: 'Düşündiriş wideolar', desc: 'Motion graphic 45-75s' },
      ]

  return (
    <section id="hyzmatlar" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Hyzmatlarymyz</h2>
          <p>
            Biznesiňiziň ähli sanly zerurlyklary — bir birleşikde
          </p>
        </div>
        <div className="services-grid">
          {list.map((s, i) => (
            <div className="service-card" key={s.id}>
              <div className="service-icon">{ICONS[i % ICONS.length]}</div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <button className="service-link" onClick={() => onOrder(s.name)}>
                Sargyt et →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
