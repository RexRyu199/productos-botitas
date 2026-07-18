import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllProducts, addProduct, updateProduct, deleteProduct,
} from '../services/productsStore'
import {
  getAllCategories, addCategory, updateCategory, deleteCategory,
} from '../services/categoriesStore'
import { uploadProductImage } from '../services/imageUpload'
import { logout } from '../services/auth'
import { LIMITS, sanitizeText, validateImageFile } from '../utils/validation'

const EMPTY_FORM = {
  name: '', category: '', desc: '', price: '', image: '', featured: false, inStock: true,
}

const FALLBACK_IMG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="%239a9590" stroke-width="1.5"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5L5 21"/%3E%3C/svg%3E'

const PRODUCT_SORT_OPTIONS = [
  { value: 'name-asc',   label: 'Nombre A–Z' },
  { value: 'name-desc',  label: 'Nombre Z–A' },
  { value: 'price-asc',  label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
]

const CATEGORY_SORT_OPTIONS = [
  { value: 'name-asc',  label: 'Nombre A–Z' },
  { value: 'name-desc', label: 'Nombre Z–A' },
]

// ── Ícono de lupa reutilizable ──────────────────────────────
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

// ── Formulario de producto ──────────────────────────────────
function ProductForm({ initial, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm]           = useState(initial || EMPTY_FORM)
  const [error, setError]         = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]     = useState(initial?.image || null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    setError(null)
    if (!file) return
    try {
      validateImageFile(file)
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    } catch (err) {
      setError(err.message)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const cleanForm = {
      ...form,
      name: sanitizeText(form.name, LIMITS.productName),
      desc: sanitizeText(form.desc, LIMITS.productDesc),
    }

    try {
      let imageUrl = form.image
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadProductImage(imageFile)
        setUploading(false)
      }
      await onSubmit({ ...cleanForm, image: imageUrl })
    } catch (err) {
      setUploading(false)
      setError(err.message)
    }
  }

  const isBusy = submitting || uploading

  return (
    <form className="panel-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label>
            Nombre <span className="form-required">*</span>
            <span className="char-count">{form.name.length}/{LIMITS.productName}</span>
          </label>
          <input name="name" type="text" maxLength={LIMITS.productName}
            value={form.name} onChange={handleChange} disabled={isBusy} required />
        </div>
        <div className="form-group">
          <label>Categoría <span className="form-required">*</span></label>
          <select name="category" value={form.category} onChange={handleChange} disabled={isBusy} required>
            <option value="">Selecciona...</option>
            {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>
          Descripción
          <span className="char-count">{form.desc.length}/{LIMITS.productDesc}</span>
        </label>
        <textarea name="desc" maxLength={LIMITS.productDesc}
          value={form.desc} onChange={handleChange} disabled={isBusy} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Precio (MXN) <span className="form-required">*</span></label>
          <input name="price" type="number" step="0.5" min="0" max="99999"
            value={form.price} onChange={handleChange} disabled={isBusy} required />
        </div>
        <div className="form-group">
          <label>Imagen del producto</label>
          <input type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect} disabled={isBusy} />
          <span className="field-hint">JPG, PNG o WEBP · máx. 3 MB</span>
        </div>
      </div>

      {preview && (
        <div className="image-preview-wrap">
          <img src={preview} alt="Vista previa" className="image-preview" />
        </div>
      )}

      <div className="panel-checks">
        <label className="filter-check">
          <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} disabled={isBusy} />
          En stock
        </label>
        <label className="filter-check">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} disabled={isBusy} />
          Producto destacado (aparece en Inicio)
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="panel-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isBusy}>Cancelar</button>
        <button type="submit" className={`btn btn-primary${isBusy ? ' btn-loading' : ''}`} disabled={isBusy}>
          {uploading
            ? <><span className="btn-spinner" /> Subiendo imagen...</>
            : submitting
              ? <><span className="btn-spinner" /> Guardando...</>
              : 'Guardar producto'
          }
        </button>
      </div>
    </form>
  )
}

// ── Formulario de categoría ─────────────────────────────────
function CategoryForm({ initial, onSubmit, onCancel, submitting }) {
  const [label, setLabel]         = useState(initial?.label || '')
  const [key, setKey]             = useState(initial?.key || '')
  const [error, setError]         = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview]     = useState(initial?.image || null)
  const [uploading, setUploading] = useState(false)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    setError(null)
    if (!file) return
    try {
      validateImageFile(file)
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    } catch (err) {
      setError(err.message)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      let imageUrl = initial?.image || null
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadProductImage(imageFile)
        setUploading(false)
      }
      await onSubmit({ key, label, image: imageUrl })
    } catch (err) {
      setUploading(false)
      setError(err.message)
    }
  }

  const isBusy = submitting || uploading

  return (
    <form className="panel-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        {!initial && (
          <div className="form-group">
            <label>Clave interna <span className="form-required">*</span></label>
            <input
              type="text" maxLength={30} placeholder="ej: dulces"
              value={key} onChange={e => setKey(e.target.value)}
              disabled={isBusy} required
            />
            <span className="field-hint">Sin espacios ni acentos, se usa internamente</span>
          </div>
        )}
        <div className="form-group">
          <label>
            Nombre visible <span className="form-required">*</span>
            <span className="char-count">{label.length}/{LIMITS.categoryLabel}</span>
          </label>
          <input
            type="text" maxLength={LIMITS.categoryLabel} placeholder="ej: Dulces"
            value={label} onChange={e => setLabel(e.target.value)}
            disabled={isBusy} required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Imagen de la categoría</label>
        <input
          type="file" accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect} disabled={isBusy}
        />
        <span className="field-hint">
          Opcional · JPG, PNG o WEBP · máx. 3 MB · si no subes una, se muestra un ícono por defecto
        </span>
      </div>

      {preview && (
        <div className="image-preview-wrap">
          <img src={preview} alt="Vista previa" className="image-preview" />
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <div className="panel-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isBusy}>Cancelar</button>
        <button type="submit" className={`btn btn-primary${isBusy ? ' btn-loading' : ''}`} disabled={isBusy}>
          {uploading
            ? <><span className="btn-spinner" /> Subiendo imagen...</>
            : submitting
              ? <><span className="btn-spinner" /> Guardando...</>
              : 'Guardar categoría'
          }
        </button>
      </div>
    </form>
  )
}

// ── Panel principal ──────────────────────────────────────────
function Panel() {
  const navigate = useNavigate()
  const productSearchRef  = useRef(null)
  const categorySearchRef = useRef(null)

  // Productos
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState(null)
  const [editing, setEditing]       = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Filtros de productos
  const [productSearch, setProductSearch]     = useState('')
  const [productCategory, setProductCategory] = useState('todas')
  const [productStock, setProductStock]       = useState('todos')
  const [productFeatured, setProductFeatured] = useState('todos')
  const [minPrice, setMinPrice]               = useState('')
  const [maxPrice, setMaxPrice]               = useState('')
  const [productSort, setProductSort]         = useState('name-asc')

  // Categorías
  const [categories, setCategories]       = useState([])
  const [catEditing, setCatEditing]       = useState(null)
  const [catSubmitting, setCatSubmitting] = useState(false)
  const [catDeletingId, setCatDeletingId] = useState(null)
  const [catError, setCatError]           = useState(null)

  // Filtros de categorías
  const [categorySearch, setCategorySearch]   = useState('')
  const [categoryHasImage, setCategoryHasImage] = useState('todas')
  const [categorySort, setCategorySort]       = useState('name-asc')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setProducts(await getAllProducts())
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await getAllCategories())
    } catch (err) {
      setLoadError(err.message)
    }
  }, [])

  useEffect(() => { loadProducts(); loadCategories() }, [loadProducts, loadCategories])

  // ── Productos ──
  const handleCreate = async (form) => {
    setSubmitting(true)
    try {
      await addProduct(form)
      await loadProducts()
      setEditing(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (form) => {
    setSubmitting(true)
    try {
      await updateProduct(editing.id, form)
      await loadProducts()
      setEditing(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Categorías ──
  const handleCatCreate = async ({ key, label, image }) => {
    setCatSubmitting(true)
    setCatError(null)
    try {
      await addCategory({ key, label, image })
      await loadCategories()
      setCatEditing(null)
    } catch (err) {
      setCatError(err.message)
    } finally {
      setCatSubmitting(false)
    }
  }

  const handleCatUpdate = async ({ label, image }) => {
    setCatSubmitting(true)
    setCatError(null)
    try {
      await updateCategory(catEditing.id, { label, image })
      await loadCategories()
      setCatEditing(null)
    } catch (err) {
      setCatError(err.message)
    } finally {
      setCatSubmitting(false)
    }
  }

  const handleCatDelete = async (cat) => {
    if (!confirm(`¿Eliminar la categoría "${cat.label}"?`)) return
    setCatDeletingId(cat.id)
    setCatError(null)
    try {
      await deleteCategory(cat.id, cat.key)
      await loadCategories()
    } catch (err) {
      setCatError({ message: err.message, categoryKey: cat.key })
    } finally {
      setCatDeletingId(null)
    }
  }

  const handleGoToCategoryProducts = (categoryKey) => {
    setProductSearch('')
    setProductCategory(categoryKey)
    document.getElementById('panel-products-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/panel/login')
  }

  // ── Filtrado + orden de productos ──
  let filteredProducts = products.filter(p => {
    const matchSearch   = p.name.toLowerCase().includes(productSearch.toLowerCase())
    const matchCategory = productCategory === 'todas' || p.category === productCategory
    const matchStock    = productStock === 'todos'
      || (productStock === 'instock' && p.inStock)
      || (productStock === 'outstock' && !p.inStock)
    const matchFeatured = productFeatured === 'todos'
      || (productFeatured === 'yes' && p.featured)
      || (productFeatured === 'no' && !p.featured)
    const min = parseFloat(minPrice)
    const max = parseFloat(maxPrice)
    const matchMin = isNaN(min) || p.price >= min
    const matchMax = isNaN(max) || p.price <= max

    return matchSearch && matchCategory && matchStock && matchFeatured && matchMin && matchMax
  })

  if (productSort === 'name-asc')   filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
  if (productSort === 'name-desc')  filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
  if (productSort === 'price-asc')  filteredProducts.sort((a, b) => a.price - b.price)
  if (productSort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price)

  const hasActiveProductFilters =
    productSearch || productCategory !== 'todas' || productStock !== 'todos' ||
    productFeatured !== 'todos' || minPrice || maxPrice

  const clearProductFilters = () => {
    setProductSearch('')
    setProductCategory('todas')
    setProductStock('todos')
    setProductFeatured('todos')
    setMinPrice('')
    setMaxPrice('')
  }

  // ── Filtrado + orden de categorías ──
  let filteredCategories = categories.filter(c => {
    const matchSearch = c.label.toLowerCase().includes(categorySearch.toLowerCase())
    const matchImage  = categoryHasImage === 'todas'
      || (categoryHasImage === 'yes' && !!c.image)
      || (categoryHasImage === 'no' && !c.image)
    return matchSearch && matchImage
  })

  if (categorySort === 'name-asc')  filteredCategories.sort((a, b) => a.label.localeCompare(b.label))
  if (categorySort === 'name-desc') filteredCategories.sort((a, b) => b.label.localeCompare(a.label))

  const hasActiveCategoryFilters = categorySearch || categoryHasImage !== 'todas'

  const clearCategoryFilters = () => {
    setCategorySearch('')
    setCategoryHasImage('todas')
  }

  return (
    <section>
      <div className="page-header">
        <p className="section-label">Panel administrativo</p>
        <h1>Gestión de <span className="accent">Pagina</span></h1>
        <p className="subtitle">Agrega, edita o elimina productos y categorías del catálogo.</p>
      </div>

      <div className="panel-warning">
        ✅ Los cambios aquí se guardan en la base de datos y son visibles
        <strong> para todos los visitantes del sitio</strong> de inmediato.
      </div>

      <div className="panel-toolbar">
        <button className="btn btn-primary" onClick={() => setEditing('new')}>+ Agregar producto</button>
        <button className="btn btn-outline" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
          Cerrar sesión
        </button>
      </div>

      {loadError && (
        <div className="async-error"><span>{loadError}</span></div>
      )}

      {editing && (
        <div className="panel-form-wrap">
          <h3>{editing === 'new' ? 'Nuevo producto' : `Editando: ${editing.name}`}</h3>
          <ProductForm
            initial={editing === 'new' ? null : { ...editing, price: String(editing.price) }}
            categories={categories}
            onSubmit={editing === 'new' ? handleCreate : handleUpdate}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        </div>
      )}

      {/* ── FILTROS DE PRODUCTOS ── */}
      <div id="panel-products-table" className="panel-filters-bar">
        <label className="panel-table-search" onClick={() => productSearchRef.current?.focus()}>
          <SearchIcon />
          <input
            ref={productSearchRef}
            type="text"
            placeholder="Buscar producto por nombre..."
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
          />
        </label>

        <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="panel-filter-select">
          <option value="todas">Todas las categorías</option>
          {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        <select value={productStock} onChange={e => setProductStock(e.target.value)} className="panel-filter-select">
          <option value="todos">Stock: todos</option>
          <option value="instock">En stock</option>
          <option value="outstock">Agotado</option>
        </select>

        <select value={productFeatured} onChange={e => setProductFeatured(e.target.value)} className="panel-filter-select">
          <option value="todos">Destacado: todos</option>
          <option value="yes">Solo destacados</option>
          <option value="no">Solo no destacados</option>
        </select>

        <div className="panel-price-range">
          <input type="number" min="0" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <span>–</span>
          <input type="number" min="0" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        </div>

        <select value={productSort} onChange={e => setProductSort(e.target.value)} className="panel-filter-select">
          {PRODUCT_SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasActiveProductFilters && (
          <button className="btn btn-outline panel-filter-clear" onClick={clearProductFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="panel-table-wrap">
        {loading ? (
          <div className="skeleton" style={{ height: 200 }} />
        ) : (
          <table className="panel-table">
            <colgroup>
              <col style={{ width: '60px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '90px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '90px' }} />
            </colgroup>
            <thead>
              <tr>
                <th></th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Destacado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="7" className="panel-empty-row">No se encontraron productos</td></tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="panel-thumb"
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                      />
                    </td>
                    <td className="panel-cell-truncate">{p.name}</td>
                    <td className="panel-cell-truncate">{categories.find(c => c.key === p.category)?.label || p.category}</td>
                    <td>${p.price.toLocaleString('es-MX')}</td>
                    <td><span className={`panel-badge ${p.inStock ? 'ok' : 'off'}`}>{p.inStock ? 'En stock' : 'Agotado'}</span></td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td className="panel-actions">
                      <button className="btn-icon" onClick={() => setEditing(p)} aria-label="Editar">✏️</button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        aria-label="Eliminar"
                      >
                        {deletingId === p.id ? '...' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── SECCIÓN DE CATEGORÍAS ── */}
      <div className="panel-section">
        <h2 className="panel-section-title">Categorías</h2>
        <button className="btn btn-primary" onClick={() => setCatEditing('new')} style={{ marginBottom: 16 }}>
          + Agregar categoría
        </button>

        {catEditing && (
          <div className="panel-form-wrap">
            <h3>{catEditing === 'new' ? 'Nueva categoría' : `Editando: ${catEditing.label}`}</h3>
            <CategoryForm
              initial={catEditing === 'new' ? null : catEditing}
              onSubmit={catEditing === 'new' ? handleCatCreate : handleCatUpdate}
              onCancel={() => setCatEditing(null)}
              submitting={catSubmitting}
            />
          </div>
        )}

        {/* La alerta ahora vive aquí, pegada a la acción que la causó */}
        {catError && (
          <div className="async-error panel-cat-error">
            <span>{typeof catError === 'string' ? catError : catError.message}</span>
            {catError.categoryKey && (
              <button
                className="btn btn-outline"
                style={{ fontSize: 13 }}
                onClick={() => handleGoToCategoryProducts(catError.categoryKey)}
              >
                Ver esos productos
              </button>
            )}
          </div>
        )}

        {/* ── FILTROS DE CATEGORÍAS ── */}
        <div className="panel-filters-bar">
          <label className="panel-table-search" onClick={() => categorySearchRef.current?.focus()}>
            <SearchIcon />
            <input
              ref={categorySearchRef}
              type="text"
              placeholder="Buscar categoría por nombre..."
              value={categorySearch}
              onChange={e => setCategorySearch(e.target.value)}
            />
          </label>

          <select value={categoryHasImage} onChange={e => setCategoryHasImage(e.target.value)} className="panel-filter-select">
            <option value="todas">Imagen: todas</option>
            <option value="yes">Con imagen</option>
            <option value="no">Sin imagen</option>
          </select>

          <select value={categorySort} onChange={e => setCategorySort(e.target.value)} className="panel-filter-select">
            {CATEGORY_SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasActiveCategoryFilters && (
            <button className="btn btn-outline panel-filter-clear" onClick={clearCategoryFilters}>
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="panel-table-wrap">
          <table className="panel-table">
            <colgroup>
              <col style={{ width: '60px' }} />
              <col style={{ width: 'auto' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '90px' }} />
            </colgroup>
            <thead><tr><th></th><th>Nombre</th><th>Clave</th><th></th></tr></thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr><td colSpan="4" className="panel-empty-row">No se encontraron categorías</td></tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      {cat.image
                        ? (
                            <img
                              src={cat.image}
                              alt={cat.label}
                              className="panel-thumb"
                              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG }}
                            />
                          )
                        : <span className="panel-thumb-empty" title="Sin imagen">—</span>
                      }
                    </td>
                    <td className="panel-cell-truncate">{cat.label}</td>
                    <td className="panel-cell-truncate"><code>{cat.key}</code></td>
                    <td className="panel-actions">
                      <button className="btn-icon" onClick={() => setCatEditing(cat)} aria-label="Editar">✏️</button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleCatDelete(cat)}
                        disabled={catDeletingId === cat.id}
                        aria-label="Eliminar"
                      >
                        {catDeletingId === cat.id ? '...' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Panel