import { useEffect, useState } from 'react'
import { Link }                from 'react-router-dom'
import { fetchBusinessHours }  from '../services/botitasApi'
import logo                    from '../assets/logo.jpg'

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
)

function Footer() {
  const [hours, setHours] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchBusinessHours()
      setHours(data)
    }
    load()
  }, [])

  return (
    <footer className="footer">
      <div className="footer-main">

        <div className="footer-brand">
          <img src={logo} alt="Productos Botitas" className="footer-logo-img" />
          <p>Tu distribuidora de botanas de confianza en San Luis Río Colorado, El valle y sus alrededores. La mejor variedad para tu antojo o negocio local.</p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Todos los Productos</Link></li>
            <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/privacidad">Política de Privacidad</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Horarios y Contacto</h4>
          <div className="footer-schedule-list">
            {hours.length === 0
              ? <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
              : hours.map(h => (
                  <div className="footer-schedule-row" key={h.dia}>
                    <span className="footer-schedule-icon"><ClockIcon /></span>
                    <span className="footer-schedule-day">{h.dia}</span>
                    <span className="footer-schedule-time">{h.horario}</span>
                  </div>
                ))
            }
          </div>

          <div className="footer-contact-list" style={{ marginTop: 20 }}>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <span>B y, Av. Quintana roo, C. 25, 83447 San Luis Río Colorado, Son.</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <span>+52 653 534 3882</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </span>
              <span>+52 653 103 7291</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Nuestra Ubicación</h4>
          <div className="footer-map-wrapper">
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
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Productos "Botitas" · Todos los derechos reservados
          {' '}
          <Link to="/panel/login" className="admin-access-text">• Botitas</Link>
        </p>
        <Link to="/privacidad">Política de Privacidad</Link>
      </div>
    </footer>
  )
}

export default Footer