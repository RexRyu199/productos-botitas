import { useState, useEffect, useCallback } from 'react'
import { useSearchParams }                   from 'react-router-dom'
import { fetchProducts }                     from '../services/botitasApi'
import { useCategories }                     from '../hooks/useCategories'
import ProductFallbackIcon from '../components/ProductFallbackIcon'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Predeterminado' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name',       label: 'Nombre A–Z' },
]

function ProductSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 16, width: '60%' }} />
        <div className="skeleton" style={{ height: 14, width: '85%' }} />
        <div className="skeleton" style={{ height: 24, width: '45%', marginTop: 4 }} />
      </div>
    </div>
  )
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('categoria') || 'todos'

  const { categories } = useCategories()

  const [products, setProducts]   = useState([])
  const [allCount, setAllCount]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [sort, setSort]           = useState('default')
  const [minPrice, setMinPrice]   = useState('')
  const [maxPrice, setMaxPrice]   = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts(categoryParam)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [categoryParam])

  useEffect(() => { loadProducts() }, [loadProducts])

  useEffect(() => {
    fetchProducts('todos').then(setAllCount).catch(() => {})
  }, [])

  const countFor = (key) =>
    key === 'todos' ? allCount.length : allCount.filter(p => p.category === key).length

  let displayed = [...products]

  if (search.trim()) {
    const q = search.toLowerCase()
    displayed = displayed.filter(
      p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    )
  }

  const min = parseFloat(minPrice)
  const max = parseFloat(maxPrice)
  if (!isNaN(min)) displayed = displayed.filter(p => p.price >= min)
  if (!isNaN(max)) displayed = displayed.filter(p => p.price <= max)

  if (sort === 'price-asc')  displayed.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') displayed.sort((a, b) => b.price - a.price)
  if (sort === 'name')       displayed.sort((a, b) => a.name.localeCompare(b.name))

  const setCategory = (key) => {
    if (key === 'todos') setSearchParams({})
    else setSearchParams({ categoria: key })
  }

  const hasActiveFilters = search || minPrice || maxPrice || categoryParam !== 'todos'

  const clearAll = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSearchParams({})
  }

  return (
    <section>
      <div className="page-header">
        <p className="section-label">Catálogo</p>
        <h1>Nuestros <span className="accent">Productos</span></h1>
        <p className="subtitle">Encuentra lo que necesitas al mejor precio</p>
      </div>

      <div className="products-layout">

        {/* ── Filtros laterales ── */}
        <aside className="filters-panel">
          <h3 className="filters-title">Categorías</h3>
          <div className="filters-categories">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`filter-cat-btn${categoryParam === cat.key ? ' active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span className="filter-cat-count">{countFor(cat.key)}</span>
              </button>
            ))}
          </div>

          <h3 className="filters-title" style={{ marginTop: 24 }}>Precio</h3>
          <div className="price-range-inputs">
            <div className="form-group">
              <label>Mínimo</label>
              <input
                type="number" min="0" placeholder="$0"
                value={minPrice} onChange={e => setMinPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Máximo</label>
              <input
                type="number" min="0" placeholder="$999"
                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button className="btn btn-outline filter-clear-btn" onClick={clearAll}>
              Limpiar filtros
            </button>
          )}
        </aside>

        {/* ── Lista de productos ── */}
        <div className="products-main">

          <div className="products-toolbar">
            <div className="search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="async-error">
              <span>{error}</span>
              <button className="btn btn-outline" onClick={loadProducts} style={{ fontSize: 13 }}>
                Reintentar
              </button>
            </div>
          )}

          <p className="products-count">
            {loading ? '...' : `${displayed.length} producto${displayed.length !== 1 ? 's' : ''}`}
          </p>

          <div className="products-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : displayed.length === 0
                ? (
                    <div className="products-empty">
                      <span style={{ fontSize: 48 }}>📦</span>
                      <p>No se encontraron productos</p>
                      <button className="btn btn-outline" onClick={clearAll}>Limpiar filtros</button>
                    </div>
                  )
                : displayed.map(p => (
                    <div key={p.id} className="product-card-flip">
                      <div className="product-card-inner">
                        <div className="product-card-front">
                          <div className="product-img-wrap">
                            {p.image ? (
                              <img src={p.image} alt={p.name} loading="lazy" />
                            ) : (
                              <div className="product-img-fallback">
                                <ProductFallbackIcon size={40} />
                              </div>
                            )}
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
                            <div className="back-actions">
                              {/* Acción WhatsApp */}
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
                    </div>
                  ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products