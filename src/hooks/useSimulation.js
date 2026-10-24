import { useCallback, useEffect, useRef, useState } from 'react'
import { simulate } from '../services/api'

export const DEFAULTS = { material: 'si', Na: 1e16, Nd: 1e16, appliedVoltage: 0, temperature: 300 }

export function useSimulation(parameters) {
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const [retryToken, setRetryToken] = useState(0)
  useEffect(() => {
    const id = ++requestId.current
    const controller = new AbortController()
    setStatus('loading'); setError('')
    const timer = setTimeout(() => simulate(parameters, controller.signal)
      .then(data => {
        if (id === requestId.current) { setResult(data); setStatus('ready') }
      })
      .catch(err => {
        if (err.code !== 'ERR_CANCELED' && id === requestId.current) {
          setError(err.response?.data?.error || 'The physics API is unavailable. Start Flask and try again.')
          setStatus('error')
        }
      }), 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [parameters, retryToken])
  const retry = useCallback(() => setRetryToken(token => token + 1), [])
  return { result, status, error, retry }
}
