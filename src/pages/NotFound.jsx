import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p className="section-label">Error 404</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,10vw,96px)', color: 'var(--verde-dark)', margin: '0 0 16px' }}>
        Página no <span className="accent">encontrada</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}

export default NotFound