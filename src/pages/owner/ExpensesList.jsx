import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Search, Trash2, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listExpenses, createExpense, deleteExpense } from '../../services/expenseService'

const CATEGORIES = ['rent', 'electricity', 'water', 'maintenance', 'salary', 'food', 'internet', 'other']

export default function ExpensesList() {
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null })
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ category: 'other', amount: '', description: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!pgId) return
        listExpenses(pgId)
            .then(setList)
            .catch(() => toast.error('Failed to load expenses'))
            .finally(() => setLoading(false))
    }, [pgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((e) => e.category.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q))
    }, [list, search])

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const created = await createExpense(pgId, { ...form, amount: Number(form.amount) })
            setList((prev) => [created, ...prev])
            setShowForm(false)
            setForm({ category: 'other', amount: '', description: '' })
            toast.success('Expense added')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteExpense(pgId, confirm.id)
            setList((prev) => prev.filter((e) => e.id !== confirm.id))
            toast.success('Expense deleted')
        } catch {
            toast.error('Failed to delete expense')
        } finally {
            setConfirm({ open: false, id: null })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Expense management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Expenses</h1>
                </div>
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {showForm && (
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">New expense</h2>
                        <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                    </div>
                    <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input type="number" required min={1} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-3">
                            <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save expense'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div className="mb-6">
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Category</th>
                                    <th className="px-4 py-4">Amount</th>
                                    <th className="px-4 py-4">Date</th>
                                    <th className="px-4 py-4">Description</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No expenses found</td></tr>
                                )}
                                {filtered.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900 capitalize">{expense.category}</td>
                                        <td className="px-4 py-4">₹ {expense.amount}</td>
                                        <td className="px-4 py-4">{expense.date?.slice(0, 10)}</td>
                                        <td className="px-4 py-4">{expense.description || '—'}</td>
                                        <td className="px-4 py-4">
                                            <button onClick={() => setConfirm({ open: true, id: expense.id })} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ConfirmDialog open={confirm.open} title="Delete expense?" description="This will permanently remove this expense."
                confirmText="Delete" onCancel={() => setConfirm({ open: false, id: null })} onConfirm={handleDelete} />
        </div>
    )
}
