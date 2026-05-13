import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Save, DollarSign } from 'lucide-react'
import Card from '../../components/common/Card'
import { getBill, addBillItem, updateBillItem, recordPayment } from '../../services/billingService'

const BILL_CATEGORIES = [
    'Rent',
    'Electricity',
    'Water',
    'Maintenance',
    'Internet',
    'Other',
]

export default function BillDetails() {
    const { id } = useParams()
    const user = useSelector((s) => s.auth.user)
    const navigate = useNavigate()
    const [bill, setBill] = useState(null)
    const [loading, setLoading] = useState(true)
    const [savingItem, setSavingItem] = useState(false)
    const [addingItem, setAddingItem] = useState(false)
    const [paying, setPaying] = useState(false)
    const [itemEdits, setItemEdits] = useState({})
    const [newItem, setNewItem] = useState({ label: 'Rent', amount: '' })
    const [payment, setPayment] = useState({ amount: '', mode: 'cash', referenceNo: '', note: '' })

    const loadBill = async () => {
        setLoading(true)
        try {
            const data = await getBill(Number(id))
            setBill(data)
            setItemEdits(
                data?.items?.reduce((acc, item) => {
                    acc[item.id] = { label: item.label, amount: String(item.amount) }
                    return acc
                }, {}) || {}
            )
        } catch (err) {
            toast.error('Failed to load bill details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) loadBill()
    }, [id])

    const handleItemChange = (itemId, field, value) => {
        setItemEdits((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value,
            },
        }))
    }

    const handleSaveItem = async (item) => {
        const changes = itemEdits[item.id]
        if (!changes) return

        const payload = {}
        if (changes.label && changes.label !== item.label) payload.label = changes.label
        if (changes.amount !== undefined && Number(changes.amount) !== item.amount) payload.amount = Number(changes.amount)

        if (!Object.keys(payload).length) {
            toast('No changes to save')
            return
        }

        setSavingItem(true)
        try {
            const updatedBill = await updateBillItem(Number(id), item.id, payload)
            setBill(updatedBill)
            toast.success('Bill item updated')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update item')
        } finally {
            setSavingItem(false)
        }
    }

    const handleAddItem = async () => {
        if (!newItem.amount || Number(newItem.amount) <= 0) {
            toast.error('Enter a valid item amount')
            return
        }

        setAddingItem(true)
        try {
            const updatedBill = await addBillItem(Number(id), {
                label: newItem.label,
                amount: Number(newItem.amount),
            })
            setBill(updatedBill)
            setNewItem({ label: 'Rent', amount: '' })
            toast.success('Item added to bill')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add item')
        } finally {
            setAddingItem(false)
        }
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        if (!payment.amount || Number(payment.amount) <= 0) {
            toast.error('Enter a valid payment amount')
            return
        }
        if (!bill?.pg?.id) {
            toast.error('Missing PG information')
            return
        }

        setPaying(true)
        try {
            await recordPayment(bill.pg.id, bill.id, {
                amount: Number(payment.amount),
                mode: payment.mode,
                referenceNo: payment.referenceNo,
                note: payment.note,
            })
            toast.success('Payment recorded')
            setPayment({ amount: '', mode: 'cash', referenceNo: '', note: '' })
            loadBill()
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to record payment')
        } finally {
            setPaying(false)
        }
    }

    const statusColor = (status) => {
        if (status === 'paid') return 'bg-green-100 text-green-700'
        if (status === 'overdue') return 'bg-red-100 text-red-700'
        if (status === 'partial') return 'bg-yellow-100 text-yellow-700'
        return 'bg-orange-100 text-orange-700'
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bill details</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Bill #{id}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button to="/owner/bills" variant="secondary" size="md" className="gap-2 px-5 py-3">
                        <ArrowLeft size={18} /> Back to list
                    </Button>
                </div>
            </div>

            {loading ? (
                <Card>
                    <p className="text-center text-gray-500 py-8">Loading bill details...</p>
                </Card>
            ) : !bill ? (
                <Card>
                    <p className="text-center text-red-600 py-8">Bill not found.</p>
                </Card>
            ) : (
                <>
                    <Card>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-wider text-gray-500">PG</p>
                                <p className="text-lg font-semibold text-gray-900">{bill.pg?.pgName || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Tenant</p>
                                <p className="text-lg font-semibold text-gray-900">{bill.tenant?.name || 'N/A'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Billing period</p>
                                <p className="text-lg font-semibold text-gray-900">{bill.billMonth}/{bill.billYear}</p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-4">
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Total amount</p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">₹ {bill.totalAmount}</p>
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Paid amount</p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">₹ {bill.paidAmount}</p>
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Due amount</p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">₹ {bill.dueAmount}</p>
                            </div>
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6">
                                <p className="text-sm uppercase tracking-wider text-gray-500">Status</p>
                                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusColor(bill.status)}`}>
                                    {bill.status}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Bill items</p>
                                <h2 className="text-lg font-semibold text-gray-900">Edit or add bill items</h2>
                            </div>
                            <button onClick={() => addBillItem && null} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition">
                                <Plus size={18} /> Add item
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                    <tr>
                                        <th className="px-4 py-4">Category</th>
                                        <th className="px-4 py-4">Amount</th>
                                        <th className="px-4 py-4">Updated</th>
                                        <th className="px-4 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bill.items?.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <select value={itemEdits[item.id]?.label || item.label}
                                                    onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                                                    className="rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                    {BILL_CATEGORIES.map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input type="number" min={0} value={itemEdits[item.id]?.amount ?? String(item.amount)}
                                                    onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                                                    className="w-32 rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4">
                                                <button onClick={() => handleSaveItem(item)} disabled={savingItem}
                                                    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50">
                                                    <Save size={16} /> Save
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select value={newItem.label} onChange={(e) => setNewItem((prev) => ({ ...prev, label: e.target.value }))}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                        {BILL_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                    <input type="number" min={1} value={newItem.amount} onChange={(e) => setNewItem((prev) => ({ ...prev, amount: e.target.value }))}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex items-end">
                                    <button type="button" onClick={handleAddItem} disabled={addingItem}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                                        <Plus size={18} /> Add new item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">Payment</p>
                                <h2 className="text-lg font-semibold text-gray-900">Mark amount received</h2>
                            </div>
                        </div>
                        <form onSubmit={handlePayment} className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                                <input type="number" min={1} value={payment.amount} onChange={(e) => setPayment((prev) => ({ ...prev, amount: e.target.value }))}
                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                                <select value={payment.mode} onChange={(e) => setPayment((prev) => ({ ...prev, mode: e.target.value }))}
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
                                <input value={payment.referenceNo} onChange={(e) => setPayment((prev) => ({ ...prev, referenceNo: e.target.value }))}
                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                                <input value={payment.note} onChange={(e) => setPayment((prev) => ({ ...prev, note: e.target.value }))}
                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" disabled={paying}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50">
                                    <DollarSign size={18} /> Mark received
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment history</h3>
                            {bill.payments?.length > 0 ? (
                                <div className="space-y-3">
                                    {bill.payments.map((paymentRecord) => (
                                        <div key={paymentRecord.id} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-900">₹ {paymentRecord.amount}</p>
                                                    <p className="text-sm text-gray-500">{paymentRecord.mode.replace('_', ' ')}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(paymentRecord.paidAt).toLocaleString()}</p>
                                            </div>
                                            {paymentRecord.referenceNo && <p className="text-sm text-gray-500">Ref: {paymentRecord.referenceNo}</p>}
                                            {paymentRecord.note && <p className="text-sm text-gray-500">Note: {paymentRecord.note}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No payments recorded yet.</p>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
