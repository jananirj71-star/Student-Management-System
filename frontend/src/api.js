import axios from 'axios'

// Base URL for the Django backend. Override with a .env file
// (VITE_API_BASE_URL=http://127.0.0.1:8000/api) if needed.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchStudents({ search = '', course = '' } = {}) {
  const params = {}
  if (search) params.search = search
  if (course) params.course = course
  const res = await client.get('/students/', { params })
  // DRF pagination wraps results in { count, next, previous, results }
  return res.data.results ?? res.data
}

export async function createStudent(payload) {
  const res = await client.post('/students/', payload)
  return res.data
}

export async function updateStudent(id, payload) {
  const res = await client.patch(`/students/${id}/`, payload)
  return res.data
}

export async function deleteStudent(id) {
  const res = await client.delete(`/students/${id}/`)
  return res.data
}

export function extractErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return 'Something went wrong. Please check your connection and try again.'
  if (data.details) {
    return Object.entries(data.details)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join(' | ')
  }
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}
