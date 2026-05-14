import api, { unwrapResponse } from './api'

export const getCities = () => api.get('/cities/with-areas').then(unwrapResponse)

export const getAllCities = (filters = {}) => api.get('/cities', { params: filters }).then(unwrapResponse)

export const createCity = (data) => api.post('/cities', data).then(unwrapResponse)

export const updateCity = (id, data) => api.put(`/cities/${id}`, data).then(unwrapResponse)

export const deleteCity = (id) => api.delete(`/cities/${id}`).then(unwrapResponse)

export const getCityById = (id) => api.get(`/cities/${id}`).then(unwrapResponse)
