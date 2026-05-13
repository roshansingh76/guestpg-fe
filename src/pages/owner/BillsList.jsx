import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Search, Plus, Eye, Building, User, Calendar, DollarSign, CheckCircle, FileText, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { listAllBills } from '../../services/billingService'
import { listPGs } from '../../services/pgService'

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

export default function BillsList() {
    const user = useSelector((s) => s.auth.user)
    const [bills, setBills] = useState([])
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState('')
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const loadPGs = () => {
        listPGs()
            .then((data) => {
                setPgs(data)
                // Removed default PG selection to show all bills by default
            })
            .catch(() => toast.error('Failed to load PGs'))
    }

    const loadData = () => {
        setLoading(true)
        const params = {}
        if (selectedPgId) params.pgId = selectedPgId

        listAllBills(params)
            .then(setBills)
            .catch(() => toast.error('Failed to load bills'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadPGs()
    }, [])

    useEffect(() => {
        if (pgs.length > 0) {
            loadData()
        }
    }, [selectedPgId, pgs])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return bills.filter((bill) =>
            bill.tenant?.name?.toLowerCase().includes(q) ||
            bill.status?.toLowerCase().includes(q) ||
            bill.billMonth?.toString().includes(q) ||
            bill.billYear?.toString().includes(q)
        )
    }, [bills, search])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bills management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Monthly Bills</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => navigate('/owner/bills/new')} icon={Plus} variant="primary" size="md">
                        Create bill entry
                    </Button>
                    <Button onClick={loadData} variant="secondary" size="md">
                        Refresh bills
                    </Button>
                </div>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Monthly bill entries</p>
                        <h2 className="text-lg font-semibold text-gray-900">Generated bills</h2>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative">
                            <select
                                value={selectedPgId}
                                onChange={(e) => setSelectedPgId(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">All PGs</option>
                                {pgs.map((pg) => (
                                    <option key={pg.id} value={pg.id}>{pg.pgName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative text-gray-500 w-full md:w-80">
                            <Search className="absolute left-3 top-3.5" size={18} />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by guest, month or status"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                {loading ? <p className="text-center text-gray-500 py-8">Loading bills...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4" />
                                            PG
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Tenant
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Month
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Due Date
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Total
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Paid
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            Due
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Status
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Items
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Actions
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-2">
                                                <p>No bills found.</p>
                                                <p className="text-sm text-gray-500">Create a bill entry after adding active tenants, or refresh once bills are generated.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((bill, index) => (
                                    <tr key={bill.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{bill.pg?.pgName || 'N/A'}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{bill.tenant?.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{MONTHS[bill.billMonth - 1]} {bill.billYear}</td>
                                        <td className="px-6 py-4 text-gray-600">{bill.dueDate?.slice(0, 10)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹ {bill.totalAmount}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">₹ {bill.paidAmount}</td>
                                        <td className="px-6 py-4 text-red-600 font-medium">₹ {bill.dueAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                                bill.status === 'paid' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : bill.status === 'overdue' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : bill.status === 'partial' 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xl">
                                            <div className="space-y-1">
                                                {bill.items?.length > 0 ? (
                                                    bill.items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2 border">
                                                            <span className="font-medium text-slate-700">{item.label}</span>
                                                            <span className="text-slate-600">₹{item.amount}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 italic">No items</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => navigate(`/owner/bills/${bill.id}`)} 
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="View / Edit Bill"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
