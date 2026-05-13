import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Search, Trash2, Plus, X, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listExpenses, createExpense, updateExpense, deleteExpense } from '../../services/expenseService'
import { listPGs } from '../../services/pgService'

const CATEGORIES = ['rent', 'electricity', 'water', 'maintenance', 'salary', 'food', 'internet', 'other']

export default function ExpensesList() {
    const user = useSelector((s) => s.auth.user)
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(String(user?.pgId || ''))
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null })
    const [showForm, setShowForm] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    const [form, setForm] = useState({ pgId: String(user?.pgId || ''), category: 'other', amount: '', description: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        listPGs()
            .then((data) => {
                setPgs(data)
                if (!selectedPgId) {
                    const defaultPg = user?.pgId ? String(user.pgId) : String(data?.[0]?.id || '')
                    setSelectedPgId(defaultPg)
                    setForm((prev) => ({ ...prev, pgId: defaultPg }))
                }
            })
            .catch(() => toast.error('Failed to load PGs'))
    }, [])

    useEffect(() => {
        if (!selectedPgId) {
            setLoading(false)
            setList([])
            return
        }

        setLoading(true)
        listExpenses(Number(selectedPgId))
            .then(setList)
            .catch(() => toast.error('Failed to load expenses'))
            .finally(() => setLoading(false))
    }, [selectedPgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((e) => e.category.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q))
    }, [list, search])

    const clearForm = () => {
        setEditingExpense(null)
        setForm({
            pgId: String(selectedPgId || user?.pgId || ''),
            category: 'other',
            amount: '',
            description: '',
        })
    }

    const openExpenseForm = (expense) => {
        if (expense) {
            setEditingExpense(expense)
            setForm({
                pgId: String(expense.pgId),
                category: expense.category || 'other',
                amount: String(expense.amount),
                description: expense.description || '',
            })
        } else {
            clearForm()
        }
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        clearForm()
    }

    const saveExpense = async (e) => {
        e.preventDefault()
        setSaving(true)

        const targetPgId = Number(form.pgId || selectedPgId || user?.pgId)
        const payload = {
            category: form.category,
            amount: Number(form.amount),
            description: form.description,
        }

        try {
            if (editingExpense) {
                const updated = await updateExpense(targetPgId, editingExpense.id, payload)
                toast.success('Expense updated')
                if (String(targetPgId) !== String(selectedPgId)) {
                    setList((prev) => prev.filter((expense) => expense.id !== editingExpense.id))
                    if (String(targetPgId) === String(selectedPgId)) {
                        setList((prev) => prev.map((expense) => (expense.id === updated.id ? updated : expense)))
                    }
                } else {
                    setList((prev) => prev.map((expense) => (expense.id === updated.id ? updated : expense)))
                }
            } else {
                const created = await createExpense(targetPgId, payload)
                setList((prev) => [created, ...prev])
                toast.success('Expense added')
            }
            closeForm()
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save expense')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteExpense(Number(selectedPgId || user?.pgId), confirm.id)
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
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Expense Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Expenses</h1>
                </div>
                <Button onClick={() => openExpenseForm(null)} icon={Plus} variant="primary" size="md">
                    Add Expense
                </Button>
            </div>

            {showForm && (
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">{editingExpense ? 'Edit expense' : 'New expense'}</h2>
                        <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={saveExpense} className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PG</label>
                            <select
                                value={form.pgId}
                                onChange={(e) => setForm((f) => ({ ...f, pgId: e.target.value }))}
                                required
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {pgs.map((pg) => (
                                    <option key={pg.id} value={pg.id}>{pg.pgName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
                            >
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                            <input
                                type="number"
                                required
                                min={1}
                                value={form.amount}
                                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                                {saving ? 'Saving...' : editingExpense ? 'Update expense' : 'Save expense'}
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Expense entries</p>
                        <h2 className="text-lg font-semibold text-gray-900">All expenses</h2>
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
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by category or description"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading expenses...</p>
                ) : (
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
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No expenses found.</p>
                                                <p className="text-xs text-gray-500">Add an expense to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-semibold text-gray-900 capitalize">{expense.category}</td>
                                        <td className="px-4 py-4 font-medium">₹{expense.amount}</td>
                                        <td className="px-4 py-4">{expense.date?.slice(0, 10)}</td>
                                        <td className="px-4 py-4 text-gray-500">{expense.description || '—'}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => openExpenseForm(expense)}
                                                    icon={Edit3}
                                                    variant="outline"
                                                    size="sm"
                                                />
                                                <Button
                                                    onClick={() => setConfirm({ open: true, id: expense.id })}
                                                    icon={Trash2}
                                                    variant="danger"
                                                    size="sm"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ConfirmDialog
                open={confirm.open}
                title="Delete expense?"
                description="This will permanently remove this expense. This cannot be undone."
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
