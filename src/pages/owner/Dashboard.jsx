import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '../../components/common/Card'
import StatsCard from '../../components/common/StatsCard'
import { ownerDashboard, recentPayments, recentGuests } from '../../data/mockData'
import { Users, Home, DollarSign, BarChart3 } from 'lucide-react'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {ownerDashboard.stats.map((item) => (
                    <StatsCard
                        key={item.id}
                        icon={item.icon === 'Users' ? Users : item.icon === 'DollarSign' ? DollarSign : item.icon === 'BarChart3' ? BarChart3 : Home}
                        label={item.label}
                        value={item.value}
                        change={{ value: item.change, positive: item.change >= 0 }}
                        color={item.color}
                    />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Revenue</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Monthly income</h2>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1">Updated</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ownerDashboard.revenue} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip formatter={(value) => `₹ ${value}`} />
                                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Occupancy</p>
                            <h2 className="text-2xl font-semibold text-gray-900">Bed utilization</h2>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1">Live</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={ownerDashboard.occupancy} innerRadius={60} outerRadius={100} fill="#3b82f6" dataKey="value" nameKey="name">
                                    {ownerDashboard.occupancy.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip />
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
                            <h2 className="text-xl font-semibold text-gray-900">Latest transactions</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{payment.guest}</p>
                                    <p className="text-sm text-gray-500">{payment.method} • {payment.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${payment.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{payment.status}</p>
                                    <p className="text-gray-900">₹ {payment.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Recent guests</p>
                            <h2 className="text-xl font-semibold text-gray-900">New check-ins</h2>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentGuests.map((guest) => (
                            <div key={guest.id} className="rounded-3xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition">
                                <div>
                                    <p className="font-semibold text-gray-900">{guest.name}</p>
                                    <p className="text-sm text-gray-500">Room {guest.room}</p>
                                </div>
                                <span className="text-sm text-gray-500">{guest.joined}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
