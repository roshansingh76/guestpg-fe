import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Plus, Search, Pencil, Trash2, User, Mail, Phone, ShieldCheck, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listUsers, deleteUser, changeUserStatus } from '../../services/userService'

const formatRoleName = (role) => {
    if (!role) return '—'
    const name = typeof role === 'string' ? role : role.displayName || role.name
    return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function StaffUsersList() {
    const navigate = useNavigate()
    const currentUser = useSelector((s) => s.auth.user)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })

    useEffect(() => {
        listUsers({ roles: 'super_admin,staff' })
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load staff users'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q))
    }, [users, query])

    const handleDelete = async () => {
        try {
            await deleteUser(confirm.id)
            setUsers((prev) => prev.filter((u) => u.id !== confirm.id))
            toast.success('User deleted')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to delete user')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const toggleStatus = async (user) => {
        const next = user.status === 'active' ? 'inactive' : 'active'
        try {
            await changeUserStatus(user.id, next)
            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)))
            toast.success(`User ${next}`)
        } catch {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Users & Roles</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Staff / Sub Admins</h1>
                </div>
                <Button onClick={() => navigate('/admin/staff/new')} icon={Plus} variant="primary" size="md">
                    Add Staff
                </Button>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Staff listings</p>
                        <h2 className="text-lg font-semibold text-gray-900">All admin-side users</h2>
                    </div>
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search staff"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading staff...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name
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
                                            <ShieldCheck className="w-4 h-4" />
                                            Role
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
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No staff users found.</p>
                                                <p className="text-xs text-gray-500">Add a staff member to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((user, index) => (
                                    <tr key={user.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                                {formatRoleName(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(user)}
                                                disabled={user.id === currentUser?.id}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                                title={user.id === currentUser?.id ? "You can't change your own status" : undefined}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {user.status === 'active' ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/staff/${user.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => user.id !== currentUser?.id && setConfirm({ open: true, id: user.id, name: user.name })}
                                                    disabled={user.id === currentUser?.id}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                    title={user.id === currentUser?.id ? "You can't delete your own account" : 'Delete User'}
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
                title="Delete user?"
                description={`Remove ${confirm.name}? This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
