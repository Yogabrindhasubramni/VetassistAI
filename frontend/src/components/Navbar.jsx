import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-paw">🐾</span>
          <span className="brand-text">VetAssist <strong>Pro</strong></span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          </li>
          <li>
            <NavLink to="/service" onClick={() => setMenuOpen(false)}>Services</NavLink>
          </li>
          <li>
            <Link to="/service" className="nav-cta" onClick={() => setMenuOpen(false)}>
              Try for Free
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
