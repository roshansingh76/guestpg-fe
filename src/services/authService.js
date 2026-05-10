import api from './api'

export const login = (email, password) =>
    api.post('/auth/login', { email, password }).then((res) => res.data)

export const getProfile = () =>
    api.get('/auth/profile').then((res) => res.data)

export const changePassword = (data) =>
    api.put('/auth/change-password', data).then((res) => res.data)
