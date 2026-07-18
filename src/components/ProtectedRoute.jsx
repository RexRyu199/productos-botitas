import { useState, useEffect } from 'react'
import { Navigate }            from 'react-router-dom'
import { getSession }          from '../services/auth'

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed]     = useState(false)

  useEffect(() => {
    getSession().then(session => {
      setAuthed(!!session)
      setChecking(false)
    })
  }, [])

  if (checking) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Verificando sesión...</div>
  }
  if (!authed) return <Navigate to="/panel/login" replace />
  return children
}

export default ProtectedRoute