import api from './api'

const unwrap = (res) => (res.data && res.data.data !== undefined) ? res.data.data : res.data

export const listUsers = (params) =>
    api.get('/users', { params }).then(unwrap)

export const getUser = (id) =>
    api.get(`/users/${id}`).then(unwrap)

export const getUsersByPG = (pgId) =>
    api.get(`/users/pg/${pgId}`).then(unwrap)

export const getAvailablePGs = () =>
    api.get('/users/pgs/available').then(unwrap)

export const createUser = (data) =>
    api.post('/users', data).then(unwrap)

export const updateUser = (id, data) =>
    api.put(`/users/${id}`, data).then(unwrap)

export const deleteUser = (id) =>
    api.delete(`/users/${id}`).then(unwrap)

export const changeUserStatus = (id, status) =>
    api.patch(`/users/${id}/status`, { status }).then(unwrap)
