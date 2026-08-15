import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Work from './components/Work.jsx'
import Pricing from './components/Pricing.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Admin from './components/Admin.jsx'
import DesignStudio from './components/DesignStudio.jsx'
import { getServices } from './api.js'

export default function App() {
  const [services, setServices] = useState([])
  const [route, setRoute] = useState('home')
  const [selectedService, setSelectedService] = useState('')
  const [studioOpen, setStudioOpen] = useState(false)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => {})
  }, [])

  const chooseService = (serviceName) => {
    setSelectedService(serviceName)
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#/', '')
      setRoute(h === 'admin' ? 'admin' : 'home')
      if (h !== 'admin') window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'admin') return <Admin onBack={() => (window.location.hash = '/')} />

  return (
    <div className="app">
      <Navbar onStudio={() => setStudioOpen(true)} />
      <main>
        <Hero onStudio={() => setStudioOpen(true)} />
        <Services services={services} onOrder={chooseService} />
        <Work />
        <Pricing />
        <Contact preselectedService={selectedService} />
      </main>
      <Footer />
      <ChatWidget services={services} />
      <DesignStudio open={studioOpen} onClose={() => setStudioOpen(false)} />
    </div>
  )
}
