import logo from '../assets/logo.jpg'

const values = [
  {
    title: 'Confianza',
    desc: 'Años de servicio a nuestra comunidad con productos de calidad garantizada.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Buen Precio',
    desc: 'Precios competitivos para que tu dinero rinda más.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'Sabor',
    desc: 'Recetas y sabores que reflejan la tradición mexicana.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11h18v2a9 9 0 0 1-9 9v0a9 9 0 0 1-9-9v-2z"/>
        <path d="M12 11V4M8 7l4-3 4 3"/>
      </svg>
    ),
  },
  {
    title: 'Local',
    desc: 'Un negocio sonorense comprometido con el desarrollo de la región.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
]

const missionIcon = (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
)

const visionIcon = (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

function About() {
  return (
    <section>
      <div className="page-header">
        <p className="section-label">Nuestra historia</p>
        <h1>Quiénes <span className="accent">Somos</span></h1>
        <p className="subtitle">
          Conoce la historia detrás de Productos "Botitas" y nuestro compromiso con la comunidad
        </p>
      </div>

      <div className="about-layout">

        <div className="about-img-wrap">
          <img src={logo} alt="Productos Botitas" className="about-logo" />
        </div>

        <div className="about-content">
          <h2 className="about-title">
            Comprometidos con <span className="accent">San Luis Río Colorado</span>
          </h2>
          <p>
            Productos "Botitas" nació con el propósito de llevar botanas y productos congelados
            de calidad a las familias de San Luis Río Colorado, El valle y sus alrededores. Desde nuestros inicios,
            nos hemos enfocado en ofrecer sabores tradicionales con ingredientes frescos.
          </p>
          <p>
            Hoy seguimos creciendo gracias a la confianza de nuestros clientes, manteniendo
            siempre el mismo compromiso con la calidad y el servicio cercano que nos caracteriza.
          </p>

          <div className="about-values">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Misión y Visión ── */}
      <div className="mv-section">
        <p className="section-label">Nuestro compromiso</p>
        <h2 className="section-title">Misión y <span className="accent">Visión</span></h2>

        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon">{missionIcon}</div>
            <h3>Misión</h3>
            <p>
              Ofrecer a las familias de San Luis Río Colorado, El valle y sus alrededores botanas y productos congelados
              de la más alta calidad, con un servicio cercano y precios accesibles, preservando
              siempre el sabor auténtico de la tradición mexicana en cada uno de nuestros productos.
            </p>
          </div>

          <div className="mv-card">
            <div className="mv-icon">{visionIcon}</div>
            <h3>Visión</h3>
            <p>
              Ser el bazar de botanas y productos congelados preferido de la región fronteriza,
              reconocido por la calidad de nuestros productos, la calidez de nuestro servicio,
              y por crecer junto con la comunidad que nos ha dado su confianza.
            </p>
          </div>
        </div>

        <div className="mv-values-strip">
          <p className="mv-values-label">Nuestros valores</p>
          <div className="mv-values-list">
            {['Calidad', 'Honestidad', 'Cercanía', 'Compromiso', 'Tradición'].map(v => (
              <span key={v} className="mv-value-chip">{v}</span>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default About