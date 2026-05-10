import api from './api'

const unwrap = (res) => (res.data && res.data.data !== undefined) ? res.data.data : res.data

export const listGuests = (pgId) =>
    api.get(`/pgs/${pgId}/guests`).then(unwrap)

export const getGuest = (pgId, id) =>
    api.get(`/pgs/${pgId}/guests/${id}`).then(unwrap)

export const createGuest = (pgId, data) =>
    api.post(`/pgs/${pgId}/guests`, data).then(unwrap)

export const updateGuest = (pgId, id, data) =>
    api.put(`/pgs/${pgId}/guests/${id}`, data).then(unwrap)

export const checkoutGuest = (pgId, id, data) =>
    api.patch(`/pgs/${pgId}/guests/${id}/checkout`, data).then(unwrap)

export const deleteGuest = (pgId, id) =>
    api.delete(`/pgs/${pgId}/guests/${id}`).then(unwrap)
