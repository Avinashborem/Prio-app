import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getTasks = (params) => api.get('/api/tasks/', { params })
export const createTask = (data) => api.post('/api/tasks/', data)
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`)
export const getStats = () => api.get('/api/tasks/stats/summary')

export const addSubtask = (taskId, title) => api.post(`/api/tasks/${taskId}/subtasks`, { title })
export const toggleSubtask = (taskId, subtaskId) => api.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`)
export const deleteSubtask = (taskId, subtaskId) => api.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`)

export const signup = (email, password) => api.post('/api/auth/signup', { email, password })
export const loginApi = (email, password) => api.post('/api/auth/login', { email, password })
export const getMe = () => api.get('/api/auth/me')