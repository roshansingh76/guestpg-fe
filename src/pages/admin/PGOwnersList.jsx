import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listUsers, deleteUser, changeUserStatus } from '../../services/userService'

export default function PGOwnersList() {
    const navigate = useNavigate()
    const [owners, setOwners] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })

    useEffect(() => {
        listUsers({ role: 'pg_owner' })
            .then((data) => setOwners(Array.isArray(data) ? data : data.users || []))
            .catch(() => toast.error('Failed to load owners'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return owners.filter((o) => o.name?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.phone?.includes(q))
    }, [owners, query])

    const handleDelete = async () => {
        try {
            await deleteUser(confirm.id)
            setOwners((prev) => prev.filter((o) => o.id !== confirm.id))
            toast.success('Owner deleted')
        } catch {
            toast.error('Failed to delete owner')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const toggleStatus = async (owner) => {
        const next = owner.status === 'active' ? 'inactive' : 'active'
        try {
            await changeUserStatus(owner.id, next)
            setOwners((prev) => prev.map((o) => o.id === owner.id ? { ...o, status: next } : o))
            toast.success(`Owner ${next}`)
        } catch {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">PG Owner Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">PG Owners</h1>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
                    <div className="relative text-gray-500">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search owners"
                            className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button onClick={() => navigate('/admin/pg-owners/new')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                        <Plus size={18} /> Add Owner
                    </button>
                </div>
            </div>

            <Card>
                {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Owner</th>
                                    <th className="px-4 py-4">Email</th>
                                    <th className="px-4 py-4">Phone</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No owners found</td></tr>
                                )}
                                {filtered.map((owner) => (
                                    <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{owner.name}</td>
                                        <td className="px-4 py-4">{owner.email}</td>
                                        <td className="px-4 py-4">{owner.phone}</td>
                                        <td className="px-4 py-4">
                                            <button onClick={() => toggleStatus(owner)}
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {owner.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 space-x-2">
                                            <button onClick={() => navigate(`/admin/pg-owners/${owner.id}/edit`)}
                                                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button onClick={() => setConfirm({ open: true, id: owner.id, name: owner.name })}
                                                className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
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

            <ConfirmDialog open={confirm.open} title="Delete owner?" description={`Remove ${confirm.name}? This cannot be undone.`}
                confirmText="Delete" onCancel={() => setConfirm({ open: false, id: null, name: '' })} onConfirm={handleDelete} />
        </div>
    )
}
