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
    const isAdminRoute = () => {
      const h = window.location.hash.replace('#/', '').trim()
      if (h === 'admin') return true
      return window.location.pathname.replace(/\/+$/, '') === '/admin'
    }
    const onHash = () => {
      const admin = isAdminRoute()
      setRoute(admin ? 'admin' : 'home')
      if (!admin) window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'admin') {
    return (
      <Admin
        onBack={() => {
          window.location.href = '/#/'
        }}
      />
    )
  }

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
