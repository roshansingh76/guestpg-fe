import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
})

export const unwrapResponse = (res) => {
    const payload = res?.data?.data !== undefined ? res.data.data : res.data
    return payload && payload.items !== undefined ? payload.items : payload
}

export const getErrorMessage = (error) =>
    error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Something went wrong'

export const getAssetUrl = (relativeUrl) => {
    if (!relativeUrl) return null
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) return relativeUrl
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    return `${baseUrl}${relativeUrl}`
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login')
        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
