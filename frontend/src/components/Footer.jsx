import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🐾 VetAssist Pro</span>
          <p>AI-powered veterinary assistance, available anytime — because every pet deserves care.</p>
        </div>

        <div className="footer-links">
          <div className="footer-group">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/service">Services</Link></li>
            </ul>
          </div>
          <div className="footer-group">
            <h4>Platform</h4>
            <ul>
              <li><span>AI Diagnosis</span></li>
              <li><span>Image Analysis</span></li>
              <li><span>Risk Assessment</span></li>
            </ul>
          </div>
          <div className="footer-group">
            <h4>Mission</h4>
            <ul>
              <li><span>Help stray dogs</span></li>
              <li><span>Pet awareness</span></li>
              <li><span>Community care</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} VetAssist Pro. Built with ❤️ for every pet.</p>
        <p>Powered by Google Gemini AI</p>
      </div>
    </footer>
  )
}
