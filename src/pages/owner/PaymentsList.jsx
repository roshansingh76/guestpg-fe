import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Search, Plus, X, User, Calendar, DollarSign, CheckCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { listBills, recordPayment, generateBills } from '../../services/billingService'

export default function PaymentsList() {
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [payForm, setPayForm] = useState({ open: false, billId: null, guestName: '' })
    const [payment, setPayment] = useState({ amount: '', mode: 'cash', referenceNo: '', note: '' })
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    const load = () => {
        if (!pgId) return
        listBills(pgId)
            .then(setList)
            .catch(() => toast.error('Failed to load bills'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [pgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((b) => b.guest?.name?.toLowerCase().includes(q) || b.status?.toLowerCase().includes(q))
    }, [list, search])

    const handleGenerate = async () => {
        try {
            await generateBills(pgId, {})
            toast.success('Bills generated')
            load()
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to generate bills')
        }
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await recordPayment(pgId, payForm.billId, { ...payment, amount: Number(payment.amount) })
            toast.success('Payment recorded')
            setPayForm({ open: false, billId: null, guestName: '' })
            setPayment({ amount: '', mode: 'cash', referenceNo: '', note: '' })
            load()
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to record payment')
        } finally {
            setSaving(false)
        }
    }

    const statusColor = (s) => {
        if (s === 'paid') return 'bg-green-100 text-green-700'
        if (s === 'overdue') return 'bg-red-100 text-red-700'
        if (s === 'partial') return 'bg-yellow-100 text-yellow-700'
        return 'bg-orange-100 text-orange-700'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Billing & Payments</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Payments</h1>
                </div>
                <Button onClick={handleGenerate} icon={Plus} variant="primary" size="md">
                    Generate Bills
                </Button>
            </div>

            {payForm.open && (
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Record payment — {payForm.guestName}</h2>
                        <button onClick={() => setPayForm({ open: false, billId: null, guestName: '' })} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handlePayment} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input type="number" required min={1} value={payment.amount} onChange={(e) => setPayment((p) => ({ ...p, amount: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                            <select value={payment.mode} onChange={(e) => setPayment((p) => ({ ...p, mode: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reference no.</label>
                            <input value={payment.referenceNo} onChange={(e) => setPayment((p) => ({ ...p, referenceNo: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                            <input value={payment.note} onChange={(e) => setPayment((p) => ({ ...p, note: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                                {saving ? 'Saving...' : 'Record payment'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Payment records</p>
                        <h2 className="text-lg font-semibold text-gray-900">Pending & overdue bills</h2>
                    </div>
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by guest or status"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading bills...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Guest
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Month/Year
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
                                    <th className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Action
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No bills found.</p>
                                                <p className="text-xs text-gray-500">Generate bills to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-semibold text-gray-900">{bill.guest?.name}</td>
                                        <td className="px-4 py-4">{bill.billMonth}/{bill.billYear}</td>
                                        <td className="px-4 py-4 font-medium">₹{bill.totalAmount}</td>
                                        <td className="px-4 py-4 text-green-600 font-medium">₹{bill.paidAmount}</td>
                                        <td className="px-4 py-4 text-red-600 font-medium">₹{bill.dueAmount}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {bill.status !== 'paid' && (
                                                <Button
                                                    onClick={() => setPayForm({ open: true, billId: bill.id, guestName: bill.guest?.name })}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Record Payment
                                                </Button>
                                            )}
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
