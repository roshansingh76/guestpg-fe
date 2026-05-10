import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import { Users, Home, DollarSign, BarChart3 } from 'lucide-react'
import { listGuests } from '../../services/guestService'
import { listRooms, listBedsByPG } from '../../services/pgService'
import { listBills } from '../../services/billingService'
import { getExpenseSummary } from '../../services/expenseService'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

export default function Dashboard() {
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [stats, setStats] = useState({ guests: 0, rooms: 0, revenue: 0, pending: 0 })
    const [beds, setBeds] = useState([])
    const [recentGuests, setRecentGuests] = useState([])
    const [recentBills, setRecentBills] = useState([])
    const [expSummary, setExpSummary] = useState([])

    useEffect(() => {
        if (!pgId) return
        Promise.all([
            listGuests(pgId),
            listRooms(pgId),
            listBedsByPG(pgId),
            listBills(pgId),
            getExpenseSummary(pgId).catch(() => []),
        ]).then(([guests, rooms, bedsData, bills, expData]) => {
            const activeGuests = guests.filter((g) => g.status === 'active')
            const paidRevenue = bills.filter((b) => b.status === 'paid').reduce((s, b) => s + b.paidAmount, 0)
            const pendingDue = bills.filter((b) => b.status !== 'paid').reduce((s, b) => s + b.dueAmount, 0)
            setStats({ guests: activeGuests.length, rooms: rooms.length, revenue: paidRevenue, pending: pendingDue })
            setBeds(bedsData)
            setRecentGuests(guests.slice(0, 5))
            setRecentBills(bills.slice(0, 5))
            if (Array.isArray(expData)) setExpSummary(expData)
        })
    }, [pgId])

    const occupied = beds.filter((b) => b.status === 'occupied').length
    const vacant = beds.filter((b) => b.status === 'vacant').length
    const occupancyData = [
        { name: 'Occupied', value: occupied },
        { name: 'Vacant', value: vacant },
    ]

    const statsCards = [
        { label: 'Active guests', value: stats.guests, icon: Users, color: 'blue' },
        { label: 'Total rooms', value: stats.rooms, icon: Home, color: 'purple' },
        { label: 'Revenue collected', value: `₹ ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
        { label: 'Pending dues', value: `₹ ${stats.pending.toLocaleString()}`, icon: BarChart3, color: 'orange' },
    ]

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((item) => (
                    <StatsCard key={item.label} icon={item.icon} label={item.label} value={item.value} color={item.color} />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Occupancy</p>
                        <h2 className="text-2xl font-semibold text-gray-900">Bed utilization</h2>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={occupancyData} innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={4}>
                                    {occupancyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Recent bills</p>
                        <h2 className="text-xl font-semibold text-gray-900">Latest transactions</h2>
                    </div>
                    <div className="space-y-3">
                        {recentBills.length === 0 && <p className="text-gray-400 text-sm">No bills yet</p>}
                        {recentBills.map((bill) => (
                            <div key={bill.id} className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{bill.guest?.name}</p>
                                    <p className="text-sm text-gray-500">{bill.billMonth}/{bill.billYear}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold capitalize ${bill.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>{bill.status}</p>
                                    <p className="text-gray-900">₹ {bill.totalAmount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Recent guests</p>
                        <h2 className="text-xl font-semibold text-gray-900">New check-ins</h2>
                    </div>
                    <div className="space-y-3">
                        {recentGuests.length === 0 && <p className="text-gray-400 text-sm">No guests yet</p>}
                        {recentGuests.map((guest) => (
                            <div key={guest.id} className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{guest.name}</p>
                                    <p className="text-sm text-gray-500">{guest.phone}</p>
                                </div>
                                <span className="text-sm text-gray-500">{guest.moveInDate?.slice(0, 10)}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Bed status</p>
                        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {['vacant', 'occupied', 'reserved'].map((s) => (
                            <div key={s} className="rounded-2xl border border-gray-100 p-4 text-center bg-slate-50">
                                <p className="text-2xl font-bold text-gray-900">{beds.filter((b) => b.status === s).length}</p>
                                <p className="text-xs text-gray-500 capitalize mt-1">{s}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
