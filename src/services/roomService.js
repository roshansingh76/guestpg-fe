import { rooms as seedRooms } from '../data/mockData'
import { ensureSeed, getCollection, nextId, setCollection } from './localDb'

const KEY = 'guestpg.rooms'

export function initRooms() {
    ensureSeed(KEY, seedRooms)
}

export function listRooms() {
    initRooms()
    return getCollection(KEY, [])
}

export function getRoom(id) {
    const items = listRooms()
    return items.find((r) => r.id.toString() === id.toString()) || null
}

export function createRoom(data) {
    const items = listRooms()
    const id = nextId(items)
    const newRoom = { id, ...data }
    const next = [newRoom, ...items]
    setCollection(KEY, next)
    return newRoom
}

export function updateRoom(id, data) {
    const items = listRooms()
    const next = items.map((r) => (r.id.toString() === id.toString() ? { ...r, ...data, id: r.id } : r))
    setCollection(KEY, next)
    return next.find((r) => r.id.toString() === id.toString()) || null
}

export function deleteRoom(id) {
    const items = listRooms()
    const next = items.filter((r) => r.id.toString() !== id.toString())
    setCollection(KEY, next)
    return true
}

