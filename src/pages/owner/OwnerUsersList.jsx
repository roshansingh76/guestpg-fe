import { useEffect, useMemo, useState } from 'react'
import { Pencil, Trash2, Plus, Search, UserCheck, UserX } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listUsers, deleteUser, changeUserStatus } from '../../services/userService'

export default function OwnerUsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })
    const navigate = useNavigate()
    const currentUser = useSelector((s) => s.auth.user)

    useEffect(() => {
        listUsers({ limit: 100 })
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load users'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return users.filter((u) =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.phone?.toLowerCase().includes(q)
        )
    }, [users, query])

    const handleDelete = async () => {
        try {
            await deleteUser(confirm.id)
            setUsers((prev) => prev.filter((u) => u.id !== confirm.id))
            toast.success('User removed')
        } catch {
            toast.error('Failed to delete user')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const toggleStatus = async (user) => {
        const next = user.status === 'active' ? 'inactive' : 'active'
        try {
            await changeUserStatus(user.id, next)
            setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u))
            toast.success(`User ${next}`)
        } catch {
            toast.error('Failed to update status')
        }
    }

    const pgNames = (user) => {
        if (user.userPGs?.length) {
            return user.userPGs.map((a) => a.pg?.pgName).filter(Boolean).join(', ')
        }
        return user.pg?.pgName || 'N/A'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Staff management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">My Users</h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative text-gray-500 w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button onClick={() => navigate('/owner/users/new')} icon={Plus} variant="primary" size="md">
                        Add staff
                    </Button>
                </div>
            </div>

            <Card>
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Name</th>
                                    <th className="px-4 py-4">Email</th>
                                    <th className="px-4 py-4">Phone</th>
                                    <th className="px-4 py-4">PG(s)</th>
                                    <th className="px-4 py-4">Role</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-4 py-4">{user.email}</td>
                                        <td className="px-4 py-4">{user.phone}</td>
                                        <td className="px-4 py-4 max-w-[200px] truncate" title={pgNames(user)}>
                                            {pgNames(user)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleStatus(user)}
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                                                {user.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                            <Button
                                                onClick={() => navigate(`/owner/users/${user.id}/edit`)}
                                                icon={Pencil}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Edit
                                            </Button>
                                            {user.id !== currentUser?.id && (
                                                <Button
                                                    onClick={() => setConfirm({ open: true, id: user.id, name: user.name })}
                                                    icon={Trash2}
                                                    variant="danger"
                                                    size="sm"
                                                >
                                                    Remove
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

            <ConfirmDialog
                open={confirm.open}
                title="Remove user?"
                description={`Remove ${confirm.name} from your PG? They will lose access.`}
                confirmText="Remove user"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
