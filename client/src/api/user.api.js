import api from './axios'

export const getAllUsers = () => api.get('/users')
export const deleteUser = (id) => api.delete(`/users/${id}`)
