import { useState, useEffect, useCallback, useRef } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const fnRef                 = useRef(fetchFn)

  useEffect(() => { fnRef.current = fetchFn }, [fetchFn])

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fnRef.current()
      setData(result)
    } catch (err) {
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { execute() }, [execute])

  return { data, loading, error, refetch: execute }
}