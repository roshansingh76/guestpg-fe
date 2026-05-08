import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import { adminDashboard, recentPayments, recentGuests } from '../../data/mockData'
import { Home, Users, TrendingUp, BarChart3 } from 'lucide-react'

const iconMap = {
    Users,
    Home,
    TrendingUp,
    BarChart3,
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {adminDashboard.stats.map((item) => {
                    const Icon = iconMap[item.icon] || Home
                    return (
                        <StatsCard
                            key={item.id}
                            icon={Icon}
                            label={item.label}
                            value={item.value}
                            change={{ value: item.change, positive: item.change >= 0 }}
                            color={item.color === 'teal' ? 'green' : item.color}
                        />
                    )
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Revenue overview</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Monthly earnings</h2>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1">+12%</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={adminDashboard.revenue} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip formatter={(value) => `₹ ${value}`} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Occupancy status</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Bed utilization</h2>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1">Stable</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={adminDashboard.occupancy}
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={4}
                                >
                                    {adminDashboard.occupancy.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Recent payments</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Latest activity</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{payment.guest}</p>
                                    <p className="text-sm text-gray-500">{payment.method} • {payment.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${payment.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {payment.status}
                                    </p>
                                    <p className="text-gray-900">₹ {payment.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">New guests</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Recent arrivals</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentGuests.map((guest) => (
                            <div key={guest.id} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{guest.name}</p>
                                    <p className="text-sm text-gray-500">Room {guest.room}</p>
                                </div>
                                <span className="text-sm text-gray-500">Joined {guest.joined}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
