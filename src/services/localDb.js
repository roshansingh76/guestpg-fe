const safeParse = (value, fallback) => {
    if (!value) return fallback
    try {
        return JSON.parse(value)
    } catch {
        return fallback
    }
}

export function getCollection(key, fallback = []) {
    return safeParse(localStorage.getItem(key), fallback)
}

export function setCollection(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function ensureSeed(key, seed) {
    const existing = safeParse(localStorage.getItem(key), null)
    if (existing === null) {
        setCollection(key, seed)
    }
}

export function nextId(items) {
    const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
    return maxId + 1
}

