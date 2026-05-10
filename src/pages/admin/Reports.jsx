import { BarChart, Bar, LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Card from '../../components/common/Card'
import { adminDashboard, expenseSummary } from '../../data/mockData'

export default function Reports() {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Reports & analytics</p>
                <h1 className="text-3xl font-semibold text-gray-900">Executive reports</h1>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Revenue report</p>
                            <h2 className="text-xl font-semibold text-gray-900">Monthly revenue</h2>
                        </div>
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
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Expense distribution</p>
                            <h2 className="text-xl font-semibold text-gray-900">Cost breakdown</h2>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenseSummary} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Summary</p>
                        <h2 className="text-2xl font-semibold text-gray-900">Business insights</h2>
                    </div>
                </div>
                <ul className="grid gap-4 md:grid-cols-3">
                    <li className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500">Monthly growth</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">+12%</p>
                        <p className="mt-2 text-sm text-gray-500">Compared to last month</p>
                    </li>
                    <li className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500">Occupancy health</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">84%</p>
                        <p className="mt-2 text-sm text-gray-500">Overall property occupancy</p>
                    </li>
                    <li className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500">Average ARPU</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">₹ 8,200</p>
                        <p className="mt-2 text-sm text-gray-500">Average revenue per user</p>
                    </li>
                </ul>
            </Card>
        </div>
    )
}
