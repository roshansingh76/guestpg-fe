import {
    users,
    pgOwners,
    pgs,
    guests,
    rooms,
    beds,
    allocations,
    payments,
    expenses,
    adminDashboard,
    ownerDashboard,
    recentPayments,
    recentGuests,
    expenseSummary,
} from '../data/mockData'

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 350))

export const fetchMockUsers = () => delay(users)
export const fetchMockPGOwners = () => delay(pgOwners)
export const fetchMockPGs = () => delay(pgs)
export const fetchMockGuests = () => delay(guests)
export const fetchMockRooms = () => delay(rooms)
export const fetchMockBeds = () => delay(beds)
export const fetchMockAllocations = () => delay(allocations)
export const fetchMockPayments = () => delay(payments)
export const fetchMockExpenses = () => delay(expenses)
export const fetchAdminDashboard = () => delay({ adminDashboard, recentPayments, recentGuests, expenseSummary })
export const fetchOwnerDashboard = () => delay({ ownerDashboard, recentPayments, recentGuests, expenseSummary })
