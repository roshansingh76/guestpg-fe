import api, { unwrapResponse } from './api'

export const listRoles = (params) =>
    api.get('/roles', { params }).then(unwrapResponse)

export const getRole = (id) =>
    api.get(`/roles/${id}`).then(unwrapResponse)

export const getPermissions = () =>
    api.get('/roles/permissions').then(unwrapResponse)

export const createRole = (data) =>
    api.post('/roles', data).then(unwrapResponse)

export const updateRole = (id, data) =>
    api.put(`/roles/${id}`, data).then(unwrapResponse)

export const deleteRole = (id) =>
    api.delete(`/roles/${id}`).then(unwrapResponse)

export const changeRoleStatus = (id, status) =>
    api.patch(`/roles/${id}/status`, { status }).then(unwrapResponse)
