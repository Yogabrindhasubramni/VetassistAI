import './AboutPage.css'

const incidents = [
  {
    country: '🇮🇳 India',
    stat: '62 million',
    desc: 'stray dogs roam the streets, many suffering from injuries, disease, and malnutrition with no access to veterinary care.',
  },
  {
    country: '🌍 Global',
    stat: '200 million',
    desc: 'stray dogs worldwide according to WHO estimates — most never receive any medical attention.',
  },
  {
    country: '🇧🇷 Brazil',
    stat: '30 million',
    desc: 'abandoned pets, the highest in Latin America, often dying from preventable illnesses.',
  },
  {
    country: '🇷🇴 Romania',
    stat: '3 million',
    desc: 'stray dogs have caused over 15,000 recorded bite injuries annually, highlighting the crisis.',
  },
]

const values = [
  { icon: '❤️', title: 'Compassion First', desc: 'Every animal deserves care, attention, and medical knowledge — not just those with owners.' },
  { icon: '🧠', title: 'AI for Good', desc: 'We believe AI technology should be used to solve real-world problems like animal suffering and neglect.' },
  { icon: '🌍', title: 'Global Reach', desc: 'Our tools are designed to be accessible anywhere in the world with an internet connection.' },
  { icon: '🤝', title: 'Community Driven', desc: 'We build in partnership with animal shelters, rescue groups, and concerned citizens worldwide.' },
]

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* ── Mission Hero ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="section-label">Our Story</span>
          <h1 className="section-title">We Built VetAssist Because<br />Animals Can't Wait</h1>
          <p className="about-hero-sub">
            Every day, millions of dogs suffer in silence — on streets, in shelters, and even in homes —
            because their owners lack fast access to veterinary guidance. VetAssist Pro was born from a
            simple yet urgent belief: <strong>AI can save animal lives.</strong>
          </p>
        </div>
      </section>

      {/* ── Crisis Awareness ── */}
      <section className="crisis-section">
        <div className="crisis-inner">
          <div className="crisis-text">
            <span className="section-label">The Global Crisis</span>
            <h2 className="section-title">A World Where Too Many<br />Dogs Suffer Needlessly</h2>
            <p>
              The crisis of animal suffering — especially among dogs — is not a local issue. It is a
              worldwide emergency affecting hundreds of millions of animals. Many die from infections,
              injuries, and illnesses that could be treated with early identification and basic care.
            </p>
            <p style={{ marginTop: '16px' }}>
              Even owned pets often go without timely care due to the cost and inaccessibility of
              veterinary services. In rural or low-income communities, a sick dog may never see a vet.
              VetAssist bridges this gap — providing instant, AI-driven insight that can mean the
              difference between life and death.
            </p>
          </div>
          <div className="crisis-image-block">
            <div className="crisis-paw-art">🐕</div>
            <div className="crisis-quote">
              "An estimated <strong>1 billion</strong> dogs live on Earth —
              yet only a fraction ever receive professional veterinary care."
            </div>
          </div>
        </div>
      </section>

      {/* ── Incident Cards ── */}
      <section className="incidents-section">
        <div className="incidents-inner">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Real Numbers</span>
            <h2 className="section-title">Incidents Happening Around the World</h2>
            <p className="section-sub" style={{ marginTop: '14px' }}>
              These are not abstract statistics — they represent real animals in pain, right now.
            </p>
          </div>
          <div className="incidents-grid">
            {incidents.map(i => (
              <div key={i.country} className="incident-card">
                <div className="incident-country">{i.country}</div>
                <div className="incident-stat">{i.stat}</div>
                <p className="incident-desc">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Statement ── */}
      <section className="mission-section">
        <div className="mission-inner">
          <div className="mission-accent">🐾</div>
          <h2>Our Mission</h2>
          <p>
            To democratise veterinary guidance through AI — making expert-level pet health knowledge
            accessible to every person, in every country, for every animal that needs it.
          </p>
          <p>
            We created VetAssist Pro not just as a product, but as a movement. A movement to raise
            awareness about the millions of dogs suffering worldwide and to give ordinary people a
            powerful tool to act sooner, smarter, and with greater compassion.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="values-section">
        <div className="values-inner">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Join the Mission</h2>
          <p>
            Use VetAssist Pro for free. Every query you make helps us improve the model and
            expand our reach to more animals in need.
          </p>
          <a href="/service"><button className="btn-primary" style={{ fontSize: '16px', padding: '16px 40px' }}>
            🐾 Start Helping Today
          </button></a>
        </div>
      </section>

    </div>
  )
}
