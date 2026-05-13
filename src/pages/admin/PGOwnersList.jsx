import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, User, Mail, Phone, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
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
            .then((data) => {
                console.log('Owners data:', data)
                setOwners(Array.isArray(data) ? data : [])
            })
            .catch((error) => {
                console.error('Failed to load owners:', error)
                toast.error('Failed to load owners')
            })
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
                <Button onClick={() => navigate('/admin/pg-owners/new')} icon={Plus} variant="primary" size="md">
                    Add Owner
                </Button>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Owner listings</p>
                        <h2 className="text-lg font-semibold text-gray-900">All owners</h2>
                    </div>
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search owners"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading owners...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Owner Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone
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
                                            Actions
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No owners found.</p>
                                                <p className="text-xs text-gray-500">Add an owner to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((owner, index) => (
                                    <tr key={owner.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{owner.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{owner.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{owner.phone}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(owner)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                    owner.status === 'active'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {owner.status === 'active' ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/pg-owners/${owner.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Owner"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirm({ open: true, id: owner.id, name: owner.name })}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Owner"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                title="Delete owner?"
                description={`Remove ${confirm.name}? This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
