import axios from 'axios'

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', timeout: 12000 })
export const fetchMaterials = () => client.get('/api/materials').then(({ data }) => data.materials)
export const simulate = (params, signal) => client.post('/api/simulate', params, { signal }).then(({ data }) => data)
