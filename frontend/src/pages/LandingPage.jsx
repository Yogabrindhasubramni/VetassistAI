import { Link } from 'react-router-dom'
import './LandingPage.css'

const features = [
  { icon: '🤖', title: 'AI-Powered Diagnosis', desc: 'Describe symptoms and get instant AI analysis powered by Google Gemini Pro.' },
  { icon: '📷', title: 'Image Analysis', desc: 'Upload photos of your pet\'s condition for visual AI assessment.' },
  { icon: '⚠️', title: 'Risk Assessment', desc: 'Receive a clear risk level — Emergency, High, Medium or Low — for every query.' },
  { icon: '🐾', title: 'Multi-Pet Support', desc: 'Works for dogs, cats, birds, rabbits and more. One platform for all your pets.' },
  { icon: '💬', title: 'Conversational Chat', desc: 'Natural, context-aware conversations — just like texting your vet.' },
  { icon: '⚡', title: 'Instant Response', desc: 'Get answers in seconds, not hours. Available 24/7, no appointment needed.' },
]

const steps = [
  { num: '01', title: 'Select Your Pet', desc: 'Choose your pet type from the selector — dog, cat, bird, rabbit, or other.' },
  { num: '02', title: 'Describe & Upload', desc: 'Type your pet\'s symptoms in plain language and optionally attach a photo.' },
  { num: '03', title: 'Get Instant Advice', desc: 'Receive AI-generated diagnosis, risk level, and recommended action instantly.' },
]

const stats = [
  { value: '50K+', label: 'Pets Helped' },
  { value: '99%', label: 'Uptime' },
  { value: '< 3s', label: 'Response Time' },
  { value: '5+', label: 'Pet Species' },
]

export default function LandingPage() {
  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-inner">
          <div className="hero-badge">🤖 Powered by Google Gemini AI</div>
          <h1 className="hero-title">
            Veterinary Care,<br />
            <span className="gradient-text">Reimagined with AI</span>
          </h1>
          <p className="hero-sub">
            VetAssist Pro gives you instant, AI-powered veterinary guidance for your dog, cat, bird
            or any pet — anytime, anywhere. Describe symptoms, upload images, get risk assessments
            and actionable advice in seconds.
          </p>
          <div className="hero-actions">
            <Link to="/service"><button className="btn-primary hero-cta">🐾 Try VetAssist Free</button></Link>
            <Link to="/about"><button className="btn-outline">Learn Our Story →</button></Link>
          </div>
          <div className="hero-trust">
            <span>✅ No sign-up required</span>
            <span>✅ Free to use</span>
            <span>✅ Backed by Gemini 2.5</span>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="hero-card-wrap">
          <div className="hero-chat-card">
            <div className="hcc-header">
              <span>🐾 VetAssist Pro</span>
              <span className="hcc-dot" />
            </div>
            <div className="hcc-body">
              <div className="hcc-msg bot">
                <span>🤖</span>
                <div className="hcc-bubble">Hi! Describe your dog's symptoms and I'll help you right away.</div>
              </div>
              <div className="hcc-msg user">
                <div className="hcc-bubble user-bubble">My dog is limping on his front left leg since morning 🐕</div>
                <span>👤</span>
              </div>
              <div className="hcc-msg bot">
                <span>🤖</span>
                <div>
                  <div className="hcc-bubble">This could be a sprain or soft-tissue injury. Limit activity and monitor for 24 hours...</div>
                  <span className="hcc-risk medium">Risk: MEDIUM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-band">
        {stats.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Everything Your Pet Needs, Instantly</h2>
          <p className="section-sub">
            Designed for pet owners who want fast, reliable guidance without waiting for a vet appointment.
          </p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section">
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Three Simple Steps to Pet Health Insights</h2>
        </div>
        <div className="steps-row">
          {steps.map((s, i) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-band">
        <div className="cta-band-inner">
          <h2>Start Helping Your Pet Today</h2>
          <p>Free, instant AI veterinary assistance. No login. No waiting room.</p>
          <Link to="/service">
            <button className="btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
              🐾 Launch VetAssist
            </button>
          </Link>
        </div>
      </section>

    </div>
  )
}
