import { useState, useEffect }  from 'react'
import { useNavigate }          from 'react-router-dom'
import { login, getSession }    from '../services/auth'

function Login() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState(null)
  const [checking, setChecking]     = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        navigate('/panel', { replace: true })
      } else {
        setChecking(false)
      }
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/panel')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        Verificando sesión...
      </div>
    )
  }

  return (
    <section className="login-section">
      <div className="login-box">
        <p className="section-label">Acceso restringido</p>
        <h1 className="login-title">Panel <span className="accent">Administrativo</span></h1>
        <p className="login-sub">Ingresa tus credenciales de administrador</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting} autoFocus required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={submitting} required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className={`btn btn-primary${submitting ? ' btn-loading' : ''}`} disabled={submitting}>
            {submitting ? <><span className="btn-spinner" /> Verificando...</> : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login