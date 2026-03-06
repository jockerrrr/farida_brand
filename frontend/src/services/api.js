import axios from 'axios'

// In development: VITE_API_URL is empty, so axios uses the same origin.
// Vite proxies /api/* → http://localhost:5000  (set in vite.config.js)
// In production: set VITE_API_URL to your real backend URL.
const BASE = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
})

// ── Products ────────────────────────────────────────
export const getProducts = () => api.get('/api/products/get_products')
export const getProduct = (id) => api.get(`/api/products/get_product/${id}`)

// ── Users ────────────────────────────────────────────
export const createUser = (data) => api.post('/api/users/create_UserInfo', data)

// ── Orders ───────────────────────────────────────────
export const createOrder = (data) => api.post('/api/orders/create_order', data)
export const verifyOrder = (order_number) =>
  api.post('/api/orders/verify_order', { order_number })
export const returnOrder = (data) => api.post('/api/orders/return_order', data)

