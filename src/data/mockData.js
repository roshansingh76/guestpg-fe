export const users = [
    {
        id: 1,
        name: 'Super Admin',
        email: 'admin@pgsystem.com',
        password: 'password',
        role: 'super_admin',
        phone: '9876543210',
        status: 'active',
    },
    {
        id: 2,
        name: 'PG Owner',
        email: 'owner@pgsystem.com',
        password: 'password',
        role: 'pg_owner',
        phone: '9876501234',
        status: 'active',
    },
]

export const pgOwners = [
    { id: 101, name: 'Raghav Sharma', email: 'raghav@owner.com', phone: '9000000001', status: 'active', properties: 3 },
    { id: 102, name: 'Neha Verma', email: 'neha@owner.com', phone: '9000000002', status: 'inactive', properties: 2 },
    { id: 103, name: 'Karan Mehta', email: 'karan@owner.com', phone: '9000000003', status: 'active', properties: 4 },
]

export const pgs = [
    { id: 201, name: 'Ocean View PG', owner: 'Raghav Sharma', city: 'Mumbai', rooms: 24, beds: 72, occupied: 64, status: 'active' },
    { id: 202, name: 'Metro Stay PG', owner: 'Neha Verma', city: 'Delhi', rooms: 18, beds: 54, occupied: 48, status: 'active' },
    { id: 203, name: 'City Comfort PG', owner: 'Karan Mehta', city: 'Bengaluru', rooms: 20, beds: 60, occupied: 50, status: 'inactive' },
]

export const rooms = [
    { id: 301, number: 'A101', type: '4 Sharing', totalBeds: 4, availableBeds: 1, rent: 6500 },
    { id: 302, number: 'B203', type: '3 Sharing', totalBeds: 3, availableBeds: 0, rent: 7200 },
    { id: 303, number: 'C502', type: '2 Sharing', totalBeds: 2, availableBeds: 1, rent: 8200 },
    { id: 304, number: 'D110', type: '1 Sharing', totalBeds: 1, availableBeds: 0, rent: 10500 },
]

export const beds = [
    { id: 401, number: 'A101-1', room: 'A101', status: 'occupied' },
    { id: 402, number: 'A101-2', room: 'A101', status: 'vacant' },
    { id: 403, number: 'B203-1', room: 'B203', status: 'occupied' },
    { id: 404, number: 'C502-2', room: 'C502', status: 'vacant' },
]

export const guests = [
    { id: 501, name: 'Aman Gupta', phone: '9999990001', aadhar: '1234 5678 9123', address: 'Andheri West, Mumbai', emergency: 'Priya Gupta', emergencyPhone: '8888880001', joiningDate: '2024-03-12', status: 'active' },
    { id: 502, name: 'Simran Kaur', phone: '9999990002', aadhar: '2345 6789 1234', address: 'Dwarka, Delhi', emergency: 'Neelam Kaur', emergencyPhone: '8888880002', joiningDate: '2024-04-08', status: 'active' },
    { id: 503, name: 'Aniket Singh', phone: '9999990003', aadhar: '3456 7891 2345', address: 'Whitefield, Bengaluru', emergency: 'Riya Singh', emergencyPhone: '8888880003', joiningDate: '2024-02-22', status: 'checked out' },
]

export const allocations = [
    { id: 601, guest: 'Aman Gupta', bed: 'A101-1', room: 'A101', status: 'active', allocatedOn: '2024-03-12' },
    { id: 602, guest: 'Simran Kaur', bed: 'B203-1', room: 'B203', status: 'active', allocatedOn: '2024-04-08' },
]

export const payments = [
    { id: 701, guest: 'Aman Gupta', month: 'April', status: 'Paid', amount: 6500, due: 0, paidOn: '2024-04-05' },
    { id: 702, guest: 'Simran Kaur', month: 'April', status: 'Due', amount: 7200, due: 7200, paidOn: '-' },
    { id: 703, guest: 'Aniket Singh', month: 'March', status: 'Paid', amount: 8200, due: 0, paidOn: '2024-03-09' },
]

export const expenses = [
    { id: 801, category: 'Electricity', amount: 22000, date: '2024-04-12', notes: 'April electricity bill' },
    { id: 802, category: 'Food', amount: 18000, date: '2024-04-05', notes: 'Kitchen supplies' },
    { id: 803, category: 'Staff Salary', amount: 34000, date: '2024-04-25', notes: 'Monthly salaries' },
    { id: 804, category: 'Maintenance', amount: 9500, date: '2024-04-18', notes: 'Plumbing and painting' },
]

export const adminDashboard = {
    stats: [
        { id: 1, label: 'PG Owners', value: 24, change: 14, color: 'blue', icon: 'Users' },
        { id: 2, label: 'Total PGs', value: 67, change: 8, color: 'purple', icon: 'Home' },
        { id: 3, label: 'Revenue', value: '₹ 5.8L', change: 12, color: 'green', icon: 'TrendingUp' },
        { id: 4, label: 'Occupancy', value: '84%', change: 6, color: 'teal', icon: 'BarChart3' },
    ],
    revenue: [
        { month: 'Jan', value: 450000 },
        { month: 'Feb', value: 520000 },
        { month: 'Mar', value: 630000 },
        { month: 'Apr', value: 590000 },
        { month: 'May', value: 720000 },
    ],
    occupancy: [
        { name: 'Occupied', value: 74 },
        { name: 'Vacant', value: 26 },
    ],
}

export const ownerDashboard = {
    stats: [
        { id: 1, label: 'Active Guests', value: 32, change: 10, color: 'blue' },
        { id: 2, label: 'Available Beds', value: 8, change: -2, color: 'purple' },
        { id: 3, label: 'Monthly Revenue', value: '₹ 2.1L', change: 5, color: 'green' },
        { id: 4, label: 'Due Amounts', value: '₹ 15,400', change: 3, color: 'red' },
    ],
    revenue: [
        { month: 'Jan', value: 180000 },
        { month: 'Feb', value: 200000 },
        { month: 'Mar', value: 210000 },
        { month: 'Apr', value: 215000 },
    ],
    occupancy: [
        { name: 'Occupied', value: 80 },
        { name: 'Vacant', value: 20 },
    ],
}

export const recentPayments = [
    { id: 1, guest: 'Aman Gupta', amount: 6500, status: 'Paid', date: '04 Apr', method: 'UPI' },
    { id: 2, guest: 'Simran Kaur', amount: 7200, status: 'Pending', date: '08 Apr', method: 'Bank Transfer' },
    { id: 3, guest: 'Aniket Singh', amount: 8200, status: 'Paid', date: '09 Mar', method: 'Cash' },
]

export const recentGuests = [
    { id: 1, name: 'Aman Gupta', room: 'A101', joined: '12 Mar' },
    { id: 2, name: 'Simran Kaur', room: 'B203', joined: '08 Apr' },
    { id: 3, name: 'Pooja N.', room: 'C502', joined: '28 Mar' },
]

export const categories = ['Electricity', 'Food', 'Maintenance', 'Staff Salary', 'Other']

export const expenseSummary = [
    { name: 'Electricity', value: 33 },
    { name: 'Food', value: 27 },
    { name: 'Maintenance', value: 18 },
    { name: 'Staff Salary', value: 15 },
    { name: 'Other', value: 7 },
]
