import { useState, useRef, useEffect } from 'react'
import { Link, NavLink }               from 'react-router-dom'
import { useCategories }               from '../hooks/useCategories'
import logo                            from '../assets/logo.jpg'

function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef(null)
  const close   = () => { setMenuOpen(false); setDropdownOpen(false) }

  const { categories } = useCategories()

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" onClick={close}>
        <img src={logo} alt="Productos Botitas" className="navbar-logo" />
      </Link>

      <button
        className={`navbar-toggle${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <nav className={`navbar-nav${menuOpen ? ' open' : ''}`}>
        <NavLink to="/" end onClick={close}>Inicio</NavLink>

        <div className="nav-dropdown" ref={dropRef}>
          <button
            className="nav-dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Productos
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="nav-dropdown-menu">
              {categories.map(cat => (
                <Link
                  key={cat.key}
                  to={cat.key === 'todos' ? '/productos' : `/productos?categoria=${cat.key}`}
                  onClick={close}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavLink to="/quienes-somos" onClick={close}>Quiénes Somos</NavLink>
        <Link to="/contacto" className="nav-cta" onClick={close}>
          Contáctanos
        </Link>
      </nav>
    </header>
  )
}

export default Navbar