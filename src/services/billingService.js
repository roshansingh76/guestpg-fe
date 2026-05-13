import api, { unwrapResponse } from './api'

export const listAllBills = (params = {}) =>
    api.get('/bills', { params }).then(unwrapResponse)

export const listBills = (pgId) =>
    api.get(`/pgs/${pgId}/bills`).then(unwrapResponse)

export const getBill = (billId) =>
    api.get(`/bills/${billId}`).then((res) => res.data.data)

export const addBillItem = (billId, data) =>
    api.post(`/bills/${billId}/items`, data).then(unwrapResponse)

export const updateBillItem = (billId, itemId, data) =>
    api.put(`/bills/${billId}/items/${itemId}`, data).then(unwrapResponse)

export const getOverdueBills = (pgId) =>
    api.get(`/pgs/${pgId}/bills/overdue`).then(unwrapResponse)

export const generateBills = (pgId, data) =>
    api.post(`/pgs/${pgId}/bills/generate`, data).then(unwrapResponse)

export const recordPayment = (pgId, billId, data) =>
    api.post(`/pgs/${pgId}/bills/${billId}/payments`, data).then(unwrapResponse)

export const getReceipt = (pgId, billId) =>
    api.get(`/pgs/${pgId}/bills/${billId}/receipt`).then(unwrapResponse)
