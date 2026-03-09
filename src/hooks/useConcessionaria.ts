import { useState, useEffect } from 'react'
import { Concessionaria } from './useConcessionarias'

interface UseConcessionariaReturn {
  concessionaria: Concessionaria | null
  loading: boolean
  error: string | null
  notFound: boolean
}

export const useConcessionaria = (id: string): UseConcessionariaReturn => {
  const [concessionaria, setConcessionaria] = useState<Concessionaria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchConcessionaria = async () => {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)

        const response = await fetch(`/api/concessionarias/${id}`)
        
        if (response.status === 404) {
          setNotFound(true)
          setConcessionaria(null)
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar concessionária')
        }

        const data = await response.json()
        setConcessionaria(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setConcessionaria(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchConcessionaria()
    }
  }, [id])

  return {
    concessionaria,
    loading,
    error,
    notFound
  }
}

export default useConcessionaria