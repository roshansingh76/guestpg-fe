import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, ShieldCheck, CheckCircle, Lock, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listRoles, deleteRole, changeRoleStatus } from '../../services/roleService'

export default function RolesList() {
    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })

    useEffect(() => {
        listRoles({ limit: 100 })
            .then((data) => setRoles(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load roles'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return roles.filter((r) => r.displayName?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q))
    }, [roles, query])

    const handleDelete = async () => {
        try {
            await deleteRole(confirm.id)
            setRoles((prev) => prev.filter((r) => r.id !== confirm.id))
            toast.success('Role deleted')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to delete role')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const toggleStatus = async (role) => {
        const next = role.isActive ? 'inactive' : 'active'
        try {
            const updated = await changeRoleStatus(role.id, next)
            setRoles((prev) => prev.map((r) => (r.id === role.id ? updated : r)))
            toast.success(`Role ${next}`)
        } catch {
            toast.error('Failed to update role status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Users & Roles</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Roles</h1>
                </div>
                <Button onClick={() => navigate('/admin/roles/new')} icon={Plus} variant="primary" size="md">
                    Add Role
                </Button>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Role listings</p>
                        <h2 className="text-lg font-semibold text-gray-900">All roles</h2>
                    </div>
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search roles"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading roles...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Role
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">Description</th>
                                    <th className="px-6 py-4 text-left">Permissions</th>
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
                                                <p>No roles found.</p>
                                                <p className="text-xs text-gray-500">Add a role to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((role, index) => (
                                    <tr key={role.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                {role.displayName}
                                                {role.isSystem && (
                                                    <span title="System role" className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                                                        <Lock className="w-3 h-3" /> System
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">{role.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs">{role.description || '—'}</td>
                                        <td className="px-6 py-4 text-gray-600">{role.permissions?.length || 0} permissions</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(role)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                                    role.isActive
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {role.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => !role.isSystem && setConfirm({ open: true, id: role.id, name: role.displayName })}
                                                    disabled={role.isSystem}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                    title={role.isSystem ? 'System roles cannot be deleted' : 'Delete Role'}
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
                title="Delete role?"
                description={`Remove ${confirm.name}? Users with this role will keep it assigned; reassign them first. This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
