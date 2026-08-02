import api, { unwrapResponse } from './api'

export const getAllStates = (filters = {}) => api.get('/states', { params: filters }).then(unwrapResponse)

export const getStateById = (id) => api.get(`/states/${id}`).then(unwrapResponse)

export const createState = (data) => api.post('/states', data).then(unwrapResponse)

export const updateState = (id, data) => api.put(`/states/${id}`, data).then(unwrapResponse)

export const deleteState = (id) => api.delete(`/states/${id}`).then(unwrapResponse)
