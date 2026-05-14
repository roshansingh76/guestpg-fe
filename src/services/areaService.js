import api, { unwrapResponse } from './api'

export const getAreasByCity = (cityId) => api.get(`/areas/city/${cityId}`).then(unwrapResponse)

export const getAllAreas = (filters = {}) => api.get('/areas', { params: filters }).then(unwrapResponse)

export const createArea = (data) => api.post('/areas', data).then(unwrapResponse)

export const updateArea = (id, data) => api.put(`/areas/${id}`, data).then(unwrapResponse)

export const deleteArea = (id) => api.delete(`/areas/${id}`).then(unwrapResponse)

export const getAreaById = (id) => api.get(`/areas/${id}`).then(unwrapResponse)
