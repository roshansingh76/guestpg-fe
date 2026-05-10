import api from './api'

const unwrap = (res) => (res.data && res.data.data !== undefined) ? res.data.data : res.data

export const listExpenses = (pgId) =>
    api.get(`/pgs/${pgId}/expenses`).then(unwrap)

export const getExpense = (pgId, expenseId) =>
    api.get(`/pgs/${pgId}/expenses/${expenseId}`).then(unwrap)

export const getExpenseSummary = (pgId) =>
    api.get(`/pgs/${pgId}/expenses/summary`).then(unwrap)

export const createExpense = (pgId, data) =>
    api.post(`/pgs/${pgId}/expenses`, data).then(unwrap)

export const updateExpense = (pgId, expenseId, data) =>
    api.put(`/pgs/${pgId}/expenses/${expenseId}`, data).then(unwrap)

export const deleteExpense = (pgId, expenseId) =>
    api.delete(`/pgs/${pgId}/expenses/${expenseId}`).then(unwrap)
