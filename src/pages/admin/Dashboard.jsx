import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import { Home, Users, TrendingUp, BarChart3 } from 'lucide-react'
import { listPGs } from '../../services/pgService'
import { listUsers } from '../../services/userService'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function Dashboard() {
    const [pgs, setPGs] = useState([])
    const [owners, setOwners] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            listPGs().then((d) => Array.isArray(d) ? d : d.pgs || []),
            listUsers({ role: 'pg_owner' }).then((d) => Array.isArray(d) ? d : d.users || []),
        ])
            .then(([pgData, ownerData]) => { setPGs(pgData); setOwners(ownerData) })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const activePGs = pgs.filter((p) => p.status === 'active').length
    const inactivePGs = pgs.filter((p) => p.status === 'inactive').length
    const activeOwners = owners.filter((o) => o.status === 'active').length

    const pgTypeData = ['Boys', 'Girls', 'CoLiving'].map((t) => ({
        name: t, value: pgs.filter((p) => p.pgType === t).length,
    })).filter((d) => d.value > 0)

    const statsCards = [
        { label: 'Total PGs', value: pgs.length, icon: Home, color: 'blue' },
        { label: 'Active PGs', value: activePGs, icon: TrendingUp, color: 'green' },
        { label: 'PG Owners', value: owners.length, icon: Users, color: 'purple' },
        { label: 'Active owners', value: activeOwners, icon: BarChart3, color: 'orange' },
    ]

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((item) => (
                    <StatsCard key={item.label} icon={item.icon} label={item.label} value={loading ? '...' : item.value} color={item.color} />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">PG distribution</p>
                        <h2 className="text-2xl font-semibold text-gray-900">By type</h2>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pgTypeData} innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={4}>
                                    {pgTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">PG status</p>
                        <h2 className="text-2xl font-semibold text-gray-900">Active vs Inactive</h2>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'Active', value: activePGs }, { name: 'Inactive', value: inactivePGs }]} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={[12, 12, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Recent PGs</p>
                    <h2 className="text-xl font-semibold text-gray-900">Latest properties</h2>
                </div>
                <div className="space-y-3">
                    {pgs.slice(0, 5).map((pg) => (
                        <div key={pg.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
                            <div>
                                <p className="font-semibold text-gray-900">{pg.pgName}</p>
                                <p className="text-sm text-gray-500">{pg.city?.name || pg.city || 'Unknown city'} • {pg.pgType}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {pg.status}
                            </span>
                        </div>
                    ))}
                    {pgs.length === 0 && !loading && <p className="text-gray-400 text-sm">No PGs yet</p>}
                </div>
            </Card>
        </div>
    )
}
