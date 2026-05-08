import { guests as seedGuests } from '../data/mockData'
import { ensureSeed, getCollection, nextId, setCollection } from './localDb'

const KEY = 'guestpg.guests'

export function initGuests() {
    ensureSeed(KEY, seedGuests)
}

export function listGuests() {
    initGuests()
    return getCollection(KEY, [])
}

export function getGuest(id) {
    const items = listGuests()
    return items.find((g) => g.id.toString() === id.toString()) || null
}

export function createGuest(data) {
    const items = listGuests()
    const id = nextId(items)
    const newGuest = {
        id,
        status: 'active',
        joiningDate: new Date().toISOString().slice(0, 10),
        ...data,
    }
    const next = [newGuest, ...items]
    setCollection(KEY, next)
    return newGuest
}

export function updateGuest(id, data) {
    const items = listGuests()
    const next = items.map((g) => (g.id.toString() === id.toString() ? { ...g, ...data, id: g.id } : g))
    setCollection(KEY, next)
    return next.find((g) => g.id.toString() === id.toString()) || null
}

export function deleteGuest(id) {
    const items = listGuests()
    const next = items.filter((g) => g.id.toString() !== id.toString())
    setCollection(KEY, next)
    return true
}

