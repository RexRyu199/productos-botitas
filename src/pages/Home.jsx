import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeatured, fetchWeather } from '../services/botitasApi'
import { useCategories } from '../hooks/useCategories'
import logo from '../assets/logo.jpg'
import negocio from '../assets/negocio.jpg'

function CategoryFallbackIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7L12 3 4 7m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function Home() {
  const [featured, setFeatured] = useState([])
  const [weather, setWeather]   = useState(null)
  const [loading, setLoading]   = useState(true)

  const { categoriesOnly, categories } = useCategories()

  useEffect(() => {
    Promise.all([fetchFeatured(), fetchWeather()])
      .then(([feat, clima]) => {
        setFeatured(feat)
        setWeather(clima)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home">

      {/* ── Hero Section — foto de fondo ancho completo ── */}
      <section className="hero-banner" style={{ backgroundImage: `url(${negocio})` }}>
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <div className="hero-logo-badge">
            <img src={logo} alt="Productos Botitas" />
          </div>

          <p className="section-label hero-banner-label">San Luis Río Colorado, Sonora</p>
          <h1 className="hero-banner-title">
            Productos <span className="accent">"Botitas"</span>
          </h1>
          <p className="hero-banner-sub">
            Empresa líder en la elaboración y distribución de botanas fritas, churritos
            artesanales y antojos congelados. Llevando el mejor sabor, calidad y tradición
            a cada hogar y comercio de la región.
          </p>
          <div className="hero-actions">
            <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
            <Link to="/contacto" className="btn btn-outline btn-outline-light">Contáctanos</Link>
          </div>

          {weather && (
            <div className="weather-chip weather-chip-hero">
              <span>{weather.icon}</span>
              <span className="weather-info">{weather.temperatura}°C · {weather.condicion}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="home-section">
        <p className="section-label">Lo que encontrarás</p>
        <h2 className="section-title">Nuestras <span className="accent">Categorías</span></h2>
        <div className="categories-grid">
          {categoriesOnly.map(cat => (
            <Link
              key={cat.key}
              to={`/productos?categoria=${cat.key}`}
              className="category-card"
            >
              {cat.image ? (
                <div className="category-img-wrap">
                  <img src={cat.image} alt={cat.label} loading="lazy" />
                </div>
              ) : (
                <div className="category-icon-wrap">
                  <CategoryFallbackIcon />
                </div>
              )}
              <span className="category-label">{cat.label}</span>
              <span className="category-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Productos Destacados ── */}
      <section className="home-section">
        <p className="section-label">Selección especial</p>
        <h2 className="section-title">Productos <span className="accent">Destacados</span></h2>

        <div className="products-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 18, width: '70%' }} />
                    <div className="skeleton" style={{ height: 14, width: '90%' }} />
                    <div className="skeleton" style={{ height: 22, width: '40%' }} />
                  </div>
                </div>
              ))
            : featured.map(p => (
                <div key={p.id} className="product-card-flip">
                  <div className="product-card-inner">

                    {/* ── CARA FRONTAL ── */}
                    <div className="product-card-front">
                      <div className="product-img-wrap">
                        <img src={p.image} alt={p.name} loading="lazy" />
                        <span className="product-badge">Destacado</span>
                      </div>
                      <div className="product-body">
                        <span className="product-category">
                          {categories.find(c => c.key === p.category)?.label}
                        </span>
                        <h3>{p.name}</h3>
                        <p>{p.desc}</p>
                        <div className="product-footer">
                          <span className="product-price">${p.price.toLocaleString('es-MX')} MXN</span>
                        </div>
                      </div>
                    </div>

                    {/* ── CARA TRASERA ── */}
                    <div className="product-card-back">
                      <div className="back-frame">
                        <span className="back-category-tag">
                          {categories.find(c => c.key === p.category)?.label}
                        </span>
                        <h3 className="back-title">{p.name}</h3>
                        <div className="back-divider" />

                        <p className="back-description">{p.desc}</p>

                        <div className="back-specs">
                          <div className="spec-item">
                            <span className="spec-icon">✓</span>
                            <span>Disponibilidad: <strong>En Stock</strong></span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-icon">✓</span>
                            <span>Garantía de calidad</span>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/526531037291?text=Hola!%20Me%20interesa%20obtener%20más%20información%20sobre%20el%20producto:%20${encodeURIComponent(p.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-back-action"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.174.001 6.161 1.24 8.403 3.484 2.243 2.244 3.48 5.232 3.479 8.407-.003 6.597-5.34 11.946-11.892 11.946-.207 0-.415-.01-.617-.023L0 24zm6.59-4.846c1.6 1.002 3.321 1.582 5.3 1.585 5.215 0 9.459-4.283 9.462-9.551a9.39 9.39 0 0 0-2.76-6.726 9.46 9.46 0 0 0-6.702-2.755c-5.215 0-9.459 4.283-9.462 9.55-.001 2.105.56 4.153 1.623 5.92l-.994 3.633 3.733-.981z"/>
                          </svg>
                          Preguntar por WhatsApp
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              ))
          }
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/productos" className="btn btn-outline">Ver todos los productos</Link>
        </div>
      </section>
    </div>
  )
}

export default Home