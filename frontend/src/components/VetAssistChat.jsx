import { useState, useEffect, useRef } from 'react'
import './VetAssistChat.css'

const API_URL = 'https://vetassistai.onrender.com'

const ANIMALS = [
  { id: 'dog',    label: '🐕 Dog' },
  { id: 'cat',    label: '🐱 Cat' },
  { id: 'bird',   label: '🦜 Bird' },
  { id: 'rabbit', label: '🐰 Rabbit' },
  { id: 'other',  label: '🐾 Other' },
]

export default function VetAssistChat() {
  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [animal, setAnimal]           = useState('dog')
  const [image, setImage]             = useState(null)      // base64
  const [imagePreview, setImagePreview] = useState(null)
  const [fileName, setFileName]       = useState('')
  const [loading, setLoading]         = useState(false)
  const [status, setStatus]           = useState('Connecting...')
  const [statusOk, setStatusOk]       = useState(true)
  const [model, setModel]             = useState('')
  const [sessionId]                   = useState('session_' + Date.now())

  const bottomRef = useRef(null)
  const fileRef   = useRef(null)

  /* Check API health on mount */
  useEffect(() => {
    checkHealth()
  }, [])

  /* Scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function checkHealth() {
    try {
      const res  = await fetch(`${API_URL}/health`)
      const data = await res.json()
      setStatus(data.gemini_connected ? 'Connected to Gemini AI' : 'API Connected (Gemini Offline)')
      setModel(data.model || '')
      setStatusOk(true)
    } catch {
      setStatus('Connection Error')
      setStatusOk(false)
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => {
      setImage(ev.target.result)
      setImagePreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearImage() {
    setImage(null)
    setImagePreview(null)
    setFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text && !image) return

    const userText = text || 'Please analyze this image of my pet'

    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setInput('')
    setLoading(true)

    try {
      const payload = {
        text: userText,
        animal_type: animal,
        session_id: sessionId,
        image_base64: image || null,
      }

      const res  = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.status === 'success') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: data.response,
          risk_level: data.risk_level,
          recommended_action: data.recommended_action,
          processing_time: data.processing_time,
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'Sorry, there was an error processing your request: ' + (data.error || 'Unknown error'),
        }])
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Connection error. Please make sure the API server is running on http://127.0.0.1:8001',
      }])
    }

    setLoading(false)
    clearImage()
  }

  return (
    <div className="chat-widget">

      {/* Header */}
      <div className="cw-header">
        <div>
          <h2>🐾 VetAssist Pro</h2>
          <p>AI-Powered Veterinary Assistant with Gemini Pro</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="cw-status-bar">
        <div className="cw-status-indicator">
          <span className={`cw-dot ${statusOk ? 'ok' : 'err'}`} />
          <span>{status}</span>
        </div>
        {model && <span className="cw-model">{model}</span>}
      </div>

      {/* Chat Messages */}
      <div className="cw-chat">
        {messages.length === 0 && (
          <div className="cw-welcome">
            <h3>Welcome to VetAssist Pro!</h3>
            <p>I'm your AI veterinary assistant powered by Google Gemini.</p>
            <p>Ask me questions about your pet's health, upload images, or get advice on pet care.</p>
            <p className="cw-welcome-hint">Select your pet type below and start chatting!</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`cw-message ${msg.role}`}>
            <div className="cw-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
            <div className="cw-bubble">
              <div className="cw-text">{msg.text}</div>
              {msg.risk_level && (
                <span className={`cw-risk risk-${msg.risk_level}`}>
                  Risk: {msg.risk_level.toUpperCase()}
                </span>
              )}
              {msg.recommended_action && (
                <div className="cw-recommendation">
                  <strong>Recommendation:</strong> {msg.recommended_action}
                </div>
              )}
              {msg.processing_time && (
                <div className="cw-proc-time">Processed in {msg.processing_time}s</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="cw-message assistant">
            <div className="cw-avatar">🤖</div>
            <div className="cw-bubble">
              <div className="cw-loading">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="cw-input-area">

        {/* Animal Selector */}
        <div className="cw-animal-selector">
          {ANIMALS.map(a => (
            <button
              key={a.id}
              className={`cw-animal-btn ${animal === a.id ? 'active' : ''}`}
              onClick={() => setAnimal(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Text + Upload + Send */}
        <div className="cw-input-row">
          <div className="cw-input-field">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your pet's symptoms or ask a question..."
              rows={3}
              disabled={loading}
            />

            <div className="cw-file-row">
              <label className="cw-file-label">
                📷 Upload Image (Optional)
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </label>
              {fileName && <span className="cw-file-name">{fileName}</span>}
            </div>

            {imagePreview && (
              <div className="cw-preview-wrap">
                <img src={imagePreview} alt="Preview" className="cw-image-preview" />
                <button className="cw-clear-img" onClick={clearImage}>✕</button>
              </div>
            )}
          </div>

          <button
            className="cw-send-btn"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>

    </div>
  )
}
