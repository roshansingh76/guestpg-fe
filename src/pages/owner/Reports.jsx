import { BarChart, Bar, LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import Card from '../../components/common/Card'
import { ownerDashboard, expenseSummary } from '../../data/mockData'

export default function Reports() {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Owner reports</p>
                <h1 className="text-3xl font-semibold text-gray-900">Operational insights</h1>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Occupancy trend</p>
                            <h2 className="text-xl font-semibold text-gray-900">Monthly bed utilization</h2>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ownerDashboard.revenue} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                            <h2 className="text-xl font-semibold text-gray-900">Cost by category</h2>
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
                                <Bar dataKey="value" fill="#10b981" radius={[12, 12, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Bed turnover</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">78%</p>
                    </div>
                    <div className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Pending dues</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">₹ 15,400</p>
                    </div>
                    <div className="rounded-3xl border border-gray-100 p-6 bg-slate-50">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Average rent</p>
                        <p className="mt-3 text-3xl font-semibold text-gray-900">₹ 7,800</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
