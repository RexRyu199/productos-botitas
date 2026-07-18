import { useState, useEffect, useCallback } from 'react'
import { getAllCategories } from '../services/categoriesStore'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error cargando categorías:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // "todos" siempre disponible al frente, sin necesidad de guardarlo en la BD
  const withAll = [{ key: 'todos', label: 'Todos los productos' }, ...categories]

  return { categories: withAll, categoriesOnly: categories, loading, refetch: load }
}