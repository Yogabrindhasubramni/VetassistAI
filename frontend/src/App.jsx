import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import ServicePage from './pages/ServicePage'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/"        element={<LandingPage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/service" element={<ServicePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
