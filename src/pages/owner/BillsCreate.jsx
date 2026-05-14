import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { listPGs } from '../../services/pgService'
import { listGuests } from '../../services/guestService'
import { generateBills } from '../../services/billingService'

const BILL_CATEGORIES = [
    'Rent',
    'Electricity',
    'Water',
    'Maintenance',
    'Internet',
    'Other',
]

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

export default function BillsCreate() {
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const isOwner = user?.role === 'pg_owner' || user?.role === 'pg_staff'
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(user?.pgId ? String(user.pgId) : '')
    const [tenants, setTenants] = useState([])
    const [loadingPGs, setLoadingPGs] = useState(false)
    const [loadingTenants, setLoadingTenants] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState(() => {
        const now = new Date()
        return {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            dueDate: '',
        }
    })
    const [items, setItems] = useState([{ tenantId: '', label: 'Rent', amount: '' }])
    const [autoGenerateRentBills, setAutoGenerateRentBills] = useState(false)

    useEffect(() => {
        const loadPGs = async () => {
            setLoadingPGs(true)
            try {
                const pgList = await listPGs()
                setPgs(pgList)
                if (!selectedPgId && pgList.length > 0) {
                    setSelectedPgId(String(pgList[0].id))
                }
            } catch (error) {
                toast.error('Failed to load PGs')
            } finally {
                setLoadingPGs(false)
            }
        }

        loadPGs()
    }, [])

    useEffect(() => {
        if (!selectedPgId) {
            setTenants([])
            return
        }

        setLoadingTenants(true)
        listGuests(selectedPgId)
            .then((data) => setTenants((data || []).filter((tenant) => tenant.status === 'active')))
            .catch(() => {
                setTenants([])
                toast.error('Failed to load tenants')
            })
            .finally(() => setLoadingTenants(false))
    }, [selectedPgId])

    const updateItem = (index, field, value) => {
        setItems((prev) => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item))
    }

    const addItem = () => setItems((prev) => [...prev, { tenantId: '', label: 'Rent', amount: '' }])
    const removeItem = (index) => setItems((prev) => prev.filter((_, idx) => idx !== index))

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedPgId) {
            toast.error('Please select a PG')
            return
        }

        if (!form.dueDate) {
            toast.error('Please choose a due date')
            return
        }

        let payload = {
            month: Number(form.month),
            year: Number(form.year),
            dueDate: form.dueDate,
        }

        if (!autoGenerateRentBills) {
            if (items.length === 0) {
                toast.error('Please add at least one bill item or enable automatic rent generation')
                return
            }

            const extraItems = items.map((item) => ({
                tenantId: Number(item.tenantId),
                label: item.label,
                amount: Number(item.amount),
            }))

            const invalid = extraItems.find((item) => !item.tenantId || !item.amount || item.amount <= 0)
            if (invalid) {
                toast.error('Each item must have a tenant, a category, and a positive amount')
                return
            }

            payload.extraItems = extraItems
        }

        setSaving(true)
        try {
            await generateBills(Number(selectedPgId), payload)
            toast.success('Monthly bills created')
            navigate('/owner/bills')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create bills')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Create monthly bills</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New bill entry</h1>
                </div>
                <Button to="/owner/bills" variant="secondary" size="md" className="gap-2 px-5 py-3">
                    <ArrowLeft size={18} /> Back to list
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select PG</label>
                            <select value={selectedPgId} onChange={(e) => setSelectedPgId(e.target.value)} disabled={isOwner}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                                <option value="">-- Select a PG --</option>
                                {pgs.map((pg) => (
                                    <option key={pg.id} value={String(pg.id)}>{pg.pgName} — {pg.city?.name || pg.city || 'N/A'}</option>
                                ))}
                            </select>
                            {isOwner && <p className="mt-2 text-sm text-gray-500">You can only create bills for your assigned PG.</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bill month</label>
                            <select value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bill year</label>
                            <input type="number" min={2024} value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due date</label>
                            <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 flex items-start gap-3">
                            <input
                                id="autoGenerateRentBills"
                                type="checkbox"
                                checked={autoGenerateRentBills}
                                onChange={(e) => setAutoGenerateRentBills(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <label htmlFor="autoGenerateRentBills" className="text-sm font-medium text-gray-700">Generate default rent bills for active tenants using room price</label>
                                <p className="text-sm text-gray-500">When enabled, the system will create one Rent bill per active tenant with their room price, without manual item entry.</p>
                            </div>
                        </div>

                        {!autoGenerateRentBills && (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Bill items</h2>
                                        <p className="text-sm text-gray-500">Choose tenant and category after selecting PG.</p>
                                    </div>
                                    <button type="button" onClick={addItem}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition">
                                        <Plus size={16} /> Add item
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="grid gap-4 md:grid-cols-4 items-end">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant</label>
                                                <select value={item.tenantId} onChange={(e) => updateItem(index, 'tenantId', e.target.value)}
                                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                    <option value="">Select tenant</option>
                                                    {tenants.map((tenant) => (
                                                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                <select value={item.label} onChange={(e) => updateItem(index, 'label', e.target.value)}
                                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize">
                                                    {BILL_CATEGORIES.map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                                                <input type="number" min={1} value={item.amount} onChange={(e) => updateItem(index, 'amount', e.target.value)}
                                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => removeItem(index)} className="mt-6 inline-flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 text-sm hover:bg-red-100 transition">
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {selectedPgId && !loadingTenants && tenants.length === 0 && (
                        <p className="text-sm text-red-600">No active tenants found for this PG. Create or activate tenants first.</p>
                    )}

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={saving || (selectedPgId && !loadingTenants && tenants.length === 0)} variant="primary" className="px-6 py-3">
                            {saving ? 'Creating bills...' : 'Create bills'}
                        </Button>
                        <Button to="/owner/bills" variant="secondary" className="px-6 py-3">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
