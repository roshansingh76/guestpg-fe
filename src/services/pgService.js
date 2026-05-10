import api from './api'

// ── PGs ──────────────────────────────────────────────
const unwrap = (res) => (res.data && res.data.data !== undefined) ? res.data.data : res.data

export const listPGs = () =>
    api.get('/pgs').then(unwrap)

export const getPG = (id) =>
    api.get(`/pgs/${id}`).then(unwrap)

export const createPG = (data) =>
    api.post('/pgs', data).then(unwrap)

export const updatePG = (id, data) =>
    api.put(`/pgs/${id}`, data).then(unwrap)

export const deletePG = (id) =>
    api.delete(`/pgs/${id}`).then(unwrap)

export const changePGStatus = (id, status) =>
    api.patch(`/pgs/${id}/status`, { status }).then(unwrap)

// ── Rooms ─────────────────────────────────────────────
export const listRooms = (pgId) =>
    api.get(`/pgs/${pgId}/rooms`).then(unwrap)

export const getRoom = (pgId, roomId) =>
    api.get(`/pgs/${pgId}/rooms/${roomId}`).then(unwrap)

export const createRoom = (pgId, data) =>
    api.post(`/pgs/${pgId}/rooms`, data).then(unwrap)

export const updateRoom = (pgId, roomId, data) =>
    api.put(`/pgs/${pgId}/rooms/${roomId}`, data).then(unwrap)

export const deleteRoom = (pgId, roomId) =>
    api.delete(`/pgs/${pgId}/rooms/${roomId}`).then(unwrap)

// ── Beds ──────────────────────────────────────────────
export const listBeds = (pgId, roomId) =>
    api.get(`/pgs/${pgId}/rooms/${roomId}/beds`).then(unwrap)

export const listBedsByPG = (pgId) =>
    api.get(`/pgs/${pgId}/beds`).then(unwrap)

export const createBed = (pgId, roomId, data) =>
    api.post(`/pgs/${pgId}/rooms/${roomId}/beds`, data).then(unwrap)

export const updateBed = (pgId, roomId, bedId, data) =>
    api.put(`/pgs/${pgId}/rooms/${roomId}/beds/${bedId}`, data).then(unwrap)

export const deleteBed = (pgId, roomId, bedId) =>
    api.delete(`/pgs/${pgId}/rooms/${roomId}/beds/${bedId}`).then(unwrap)

// ── Photos ────────────────────────────────────────────
export const listPhotos = (pgId) =>
    api.get(`/pgs/${pgId}/photos`).then(unwrap)

export const addPhoto = (pgId, data) =>
    api.post(`/pgs/${pgId}/photos`, data).then(unwrap)

export const deletePhoto = (pgId, photoId) =>
    api.delete(`/pgs/${pgId}/photos/${photoId}`).then(unwrap)
