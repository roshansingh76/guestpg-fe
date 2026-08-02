import api, { unwrapResponse } from './api'

export const listGuests = (pgId) =>
    api.get(`/pgs/${pgId}/tenants`).then(unwrapResponse)

export const getGuest = (pgId, id) =>
    api.get(`/pgs/${pgId}/tenants/${id}`).then(unwrapResponse)

export const createGuest = (pgId, data) =>
    api.post(`/pgs/${pgId}/tenants`, data).then(unwrapResponse)

export const updateGuest = (pgId, id, data) =>
    api.put(`/pgs/${pgId}/tenants/${id}`, data).then(unwrapResponse)

export const checkoutGuest = (pgId, id, data) =>
    api.patch(`/pgs/${pgId}/tenants/${id}/checkout`, data).then(unwrapResponse)

export const deleteGuest = (pgId, id) =>
    api.delete(`/pgs/${pgId}/tenants/${id}`).then(unwrapResponse)
