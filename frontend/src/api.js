import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const getTasks = (params) => api.get('/api/tasks/', { params })
export const createTask = (data) => api.post('/api/tasks/', data)
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`)
export const getStats = () => api.get('/api/tasks/stats/summary')

export const addSubtask = (taskId, title) => api.post(`/api/tasks/${taskId}/subtasks`, { title })
export const toggleSubtask = (taskId, subtaskId) => api.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`)
export const deleteSubtask = (taskId, subtaskId) => api.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`)