import api from './api'

const unwrap = (res) => (res.data && res.data.data !== undefined) ? res.data.data : res.data

export const listBills = (pgId) =>
    api.get(`/pgs/${pgId}/bills`).then(unwrap)

export const getBill = (pgId, billId) =>
    api.get(`/pgs/${pgId}/bills/${billId}`).then(unwrap)

export const getOverdueBills = (pgId) =>
    api.get(`/pgs/${pgId}/bills/overdue`).then(unwrap)

export const generateBills = (pgId, data) =>
    api.post(`/pgs/${pgId}/bills/generate`, data).then(unwrap)

export const recordPayment = (pgId, billId, data) =>
    api.post(`/pgs/${pgId}/bills/${billId}/payments`, data).then(unwrap)

export const getReceipt = (pgId, billId) =>
    api.get(`/pgs/${pgId}/bills/${billId}/receipt`).then(unwrap)
