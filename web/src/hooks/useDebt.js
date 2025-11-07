import { useState, useEffect } from 'react'
import { fetchDebtSummaryAPI } from '~/apis'

export const useDebt = (userId) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [debtData, setDebtData] = useState({
    owedToMe: { debts: [], total: 0, count: 0 },
    iOwe: { debts: [], total: 0, count: 0 },
    netBalance: 0
  })

  useEffect(() => {
    const loadDebtData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDebtSummaryAPI(userId)
        setDebtData(data)
      } catch (err) {
        setError(err.message || 'Failed to load debt data')
        console.error('Error loading debt data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDebtData()
  }, [userId])

  return { loading, error, debtData }
}
