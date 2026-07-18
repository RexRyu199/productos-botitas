import { Link, useLocation } from 'react-router-dom'

const labels = {
  '/':              'Inicio',
  '/productos':     'Productos',
  '/quienes-somos': 'Quiénes Somos',
  '/contacto':      'Contacto',
  '/privacidad':    'Política de Privacidad',
}

function Breadcrumbs() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  const crumbs   = [{ path: '/', label: 'Inicio' }]

  segments.forEach((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/')
    crumbs.push({ path, label: labels[path] || seg })
  })

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path}>
          {i > 0 && <span className="bc-sep">›</span>}
          {i === crumbs.length - 1
            ? <span className="bc-current">{crumb.label}</span>
            : <Link to={crumb.path}>{crumb.label}</Link>
          }
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs