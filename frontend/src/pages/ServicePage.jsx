import VetAssistChat from '../components/VetAssistChat'
import './ServicePage.css'

const services = [
  {
    icon: '🤖',
    title: 'AI Symptom Chat',
    desc: 'Describe any symptom in plain English. Get AI-analysed guidance backed by Gemini Pro in real time.',
    badge: 'Live',
  },
  {
    icon: '📷',
    title: 'Image Diagnosis',
    desc: 'Upload a photo of a wound, rash, or condition. Our vision AI will assess it visually.',
    badge: 'Vision AI',
  },
  {
    icon: '⚠️',
    title: 'Risk Assessment',
    desc: 'Every response includes an automated risk level — Emergency, High, Medium or Low — so you know exactly what to do.',
    badge: 'Smart',
  },
]

export default function ServicePage() {
  return (
    <div className="service-page">

      {/* ── Hero ── */}
      <section className="service-hero">
        <div className="service-hero-inner">
          <span className="section-label">Our Services</span>
          <h1 className="section-title">
            AI-Powered Veterinary<br />
            <span className="gradient-text">Assistance, Right Now</span>
          </h1>
          <p className="section-sub" style={{ marginTop: '16px' }}>
            Choose your pet, describe the issue, upload a photo — and get instant, Gemini-powered advice.
          </p>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="service-cards-section">
        <div className="service-cards-inner">
          {services.map(s => (
            <div key={s.title} className="service-card">
              <div className="sc-badge">{s.badge}</div>
              <div className="sc-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chat Component ── */}
      <section className="chat-section">
        <div className="chat-section-header">
          <span className="section-label">Try It Now</span>
          <h2 className="section-title">VetAssist Pro Chat</h2>
          <p className="section-sub" style={{ marginTop: '12px' }}>
            Your AI vet is online and ready. No sign-up, no waiting — just ask.
          </p>
        </div>
        <VetAssistChat />
      </section>

    </div>
  )
}
