import { beds as seedBeds } from '../data/mockData'
import { ensureSeed, getCollection, nextId, setCollection } from './localDb'

const KEY = 'guestpg.beds'

export function initBeds() {
    ensureSeed(KEY, seedBeds)
}

export function listBeds() {
    initBeds()
    return getCollection(KEY, [])
}

export function getBed(id) {
    const items = listBeds()
    return items.find((b) => b.id.toString() === id.toString()) || null
}

export function createBed(data) {
    const items = listBeds()
    const id = nextId(items)
    const newBed = { id, status: 'vacant', ...data }
    const next = [newBed, ...items]
    setCollection(KEY, next)
    return newBed
}

export function updateBed(id, data) {
    const items = listBeds()
    const next = items.map((b) => (b.id.toString() === id.toString() ? { ...b, ...data, id: b.id } : b))
    setCollection(KEY, next)
    return next.find((b) => b.id.toString() === id.toString()) || null
}

export function deleteBed(id) {
    const items = listBeds()
    const next = items.filter((b) => b.id.toString() !== id.toString())
    setCollection(KEY, next)
    return true
}

