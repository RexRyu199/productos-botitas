import { useState, useEffect } from 'react'
import { submitContactForm, fetchBusinessHours } from '../services/botitasApi'
import { LIMITS, sanitizeText } from '../utils/validation'

const EMPTY = { nombre: '', email: '', telefono: '', asunto: '', mensaje: '' }

// ── Iconos consistentes con Quiénes Somos (mismo estilo, sin emojis) ──
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
)

function Contact() {
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [status,     setStatus]     = useState(null)
  const [hours,      setHours]      = useState([])

  useEffect(() => {
    fetchBusinessHours().then(setHours)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    const cleanForm = {
      nombre:   sanitizeText(form.nombre, LIMITS.contactName),
      email:    sanitizeText(form.email, LIMITS.contactEmail),
      telefono: sanitizeText(form.telefono, LIMITS.contactPhone),
      asunto:   sanitizeText(form.asunto, LIMITS.contactSubject),
      mensaje:  sanitizeText(form.mensaje, LIMITS.contactMessage),
    }

    try {
      await submitContactForm(cleanForm)
      setStatus({ type: 'success', msg: '¡Mensaje enviado con éxito! Nos comunicaremos contigo muy pronto.' })
      setForm(EMPTY)
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <div className="page-header">
        <p className="section-label">Estamos para servirte</p>
        <h1>Contácta<span className="accent">nos</span></h1>
        <p className="subtitle">
          ¿Quieres surtir tu negocio o hacer un pedido especial? Visítanos o envíanos un mensaje
        </p>
      </div>

      <div className="contact-layout">

        {/* Info */}
        <div className="contact-info-panel">
          <div className="contact-info-card">
            <div className="contact-info-icon"><LocationIcon /></div>
            <div>
              <h4>Nuestra Dirección</h4>
              <p>Quintana Roo B y 25, San Luis Río Colorado, Sonora, México, C.P. 83447</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon"><PhoneIcon /></div>
            <div>
              <h4>Atención Inmediata</h4>
              <p style={{ margin: '0 0 8px 0' }}>Teléfono Negocio: <strong>+52 653 534 3882</strong></p>
              <p style={{ margin: '0 0 8px 0' }}>Teléfono Celular: <strong>+52 653 103 7291</strong></p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon"><ClockIcon /></div>
            <div>
              <h4>Horarios de Distribución</h4>
              {hours.length === 0
                ? <div className="skeleton" style={{ height: 14, width: '80%' }} />
                : hours.map(h => (
                    <div key={h.dia} className="contact-schedule-row">
                      <span>{h.dia}</span>
                      <span className="contact-schedule-time">{h.horario}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Mapa */}
          <div className="map-wrapper" style={{ marginTop: 8 }}>
            <iframe
              src="https://maps.google.com/maps?q=32.4448651,-114.7625623&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Productos Botitas"
            ></iframe>
          </div>
        </div>

        {/* Formulario */}
        <div className="contact-form-panel">
          <h2 className="contact-form-title">Cotiza tu pedido por <span className="accent">correo</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
            Escríbenos si tienes dudas sobre precios de mayoreo, rutas de distribución o disponibilidad de producto.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Nombre <span className="form-required">*</span>
                  <span className="char-count">{form.nombre.length}/{LIMITS.contactName}</span>
                </label>
                <input
                  name="nombre" type="text" placeholder="Tu nombre"
                  value={form.nombre} onChange={handleChange}
                  maxLength={LIMITS.contactName}
                  disabled={submitting} required
                />
              </div>
              <div className="form-group">
                <label>
                  Email <span className="form-required">*</span>
                  <span className="char-count">{form.email.length}/{LIMITS.contactEmail}</span>
                </label>
                <input
                  name="email" type="email" placeholder="tu@correo.com"
                  value={form.email} onChange={handleChange}
                  maxLength={LIMITS.contactEmail}
                  disabled={submitting} required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Teléfono
                  <span className="char-count">{form.telefono.length}/{LIMITS.contactPhone}</span>
                </label>
                <input
                  name="telefono" type="tel" placeholder="+52 653 534 3882"
                  value={form.telefono} onChange={handleChange}
                  maxLength={LIMITS.contactPhone}
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label>
                  Asunto
                  <span className="char-count">{form.asunto.length}/{LIMITS.contactSubject}</span>
                </label>
                <input
                  name="asunto" type="text" placeholder="Ej. Presupuesto para Tienda / Evento"
                  value={form.asunto} onChange={handleChange}
                  maxLength={LIMITS.contactSubject}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Mensaje <span className="form-required">*</span>
                <span className="char-count">{form.mensaje.length}/{LIMITS.contactMessage}</span>
              </label>
              <textarea
                name="mensaje" placeholder="Cuéntanos qué productos te interesan y las cantidades..."
                value={form.mensaje} onChange={handleChange}
                maxLength={LIMITS.contactMessage}
                disabled={submitting} required
              />
            </div>

            {status && (
              <div className={status.type === 'success' ? 'form-success' : 'form-error'}>
                {status.type === 'success'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                }
                {status.msg}
              </div>
            )}

            {status?.type !== 'success' && (
              <button type="submit" className={`btn btn-primary${submitting ? ' btn-loading' : ''}`} disabled={submitting}>
                {submitting ? <><span className="btn-spinner" /> Enviando...</> : 'Enviar mensaje'}
              </button>
            )}
          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact