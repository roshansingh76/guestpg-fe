import api, { unwrapResponse } from './api'

export const listGuests = (pgId) =>
    api.get(`/pgs/${pgId}/tenants`).then(unwrapResponse)

export const getGuest = (pgId, id) =>
    api.get(`/pgs/${pgId}/tenants/${id}`).then(unwrapResponse)

export const createGuest = (pgId, data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    return api.post(`/pgs/${pgId}/tenants`, data, config).then(unwrapResponse)
}

export const updateGuest = (pgId, id, data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    return api.put(`/pgs/${pgId}/tenants/${id}`, data, config).then(unwrapResponse)
}

export const checkoutGuest = (pgId, id, data) =>
    api.patch(`/pgs/${pgId}/tenants/${id}/checkout`, data).then(unwrapResponse)

export const deleteGuest = (pgId, id) =>
    api.delete(`/pgs/${pgId}/tenants/${id}`).then(unwrapResponse)
