import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import { getRole, createRole, updateRole, getPermissions } from '../../services/roleService'

// Maps backend permission resources (users, pgs, tenants, ...) onto the app's
// sidebar modules so role editing reads the same way the sidebar is organized.
const MODULE_GROUPS = [
    { module: 'Users', resources: ['users'] },
    { module: 'PG Management', resources: ['pgs', 'tenants', 'billing', 'expenses'] },
    { module: 'Masters', resources: ['cities', 'areas'] },
    { module: 'Role Management', resources: ['roles'] },
]

const RESOURCE_LABELS = {
    users: 'Users',
    pgs: 'PGs',
    tenants: 'Tenants',
    billing: 'Billing',
    expenses: 'Expenses',
    cities: 'Cities',
    areas: 'Areas',
    roles: 'Roles',
}

const ACTION_LABELS = {
    read: 'View',
    write: 'Create / Edit',
    delete: 'Delete',
}

export default function RoleEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const [grouped, setGrouped] = useState({})
    const [selectedPermissions, setSelectedPermissions] = useState(new Set())
    const [permissionsError, setPermissionsError] = useState(false)
    const [isSystem, setIsSystem] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '', displayName: '', description: '' },
    })

    useEffect(() => {
        getPermissions()
            .then((data) => setGrouped(data.grouped || {}))
            .catch(() => toast.error('Failed to load permission list'))
    }, [])

    useEffect(() => {
        if (!id) return setLoading(false)
        getRole(id)
            .then((role) => {
                reset({ name: role.name, displayName: role.displayName, description: role.description || '' })
                setSelectedPermissions(new Set(role.permissions || []))
                setIsSystem(!!role.isSystem)
            })
            .catch(() => toast.error('Failed to load role'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const togglePermission = (permission) => {
        setSelectedPermissions((prev) => {
            const next = new Set(prev)
            if (next.has(permission)) next.delete(permission)
            else next.add(permission)
            return next
        })
    }

    const toggleResource = (resourcePermissions, checked) => {
        setSelectedPermissions((prev) => {
            const next = new Set(prev)
            resourcePermissions.forEach((p) => (checked ? next.add(p) : next.delete(p)))
            return next
        })
    }

    const onSubmit = async (values) => {
        setPermissionsError(false)
        if (selectedPermissions.size === 0) {
            setPermissionsError(true)
            toast.error('Select at least one permission')
            return
        }
        setSaving(true)
        try {
            const payload = {
                displayName: values.displayName,
                description: values.description,
                permissions: Array.from(selectedPermissions),
            }
            if (id) {
                await updateRole(id, payload)
                toast.success('Role updated successfully')
            } else {
                await createRole({ ...payload, name: values.name })
                toast.success('Role created successfully')
            }
            navigate('/admin/roles')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to save role')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Users & Roles</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit Role' : 'Add Role'}</h1>
                </div>
                <Link to="/admin/roles" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium gap-2">
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role Key <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register('name', {
                                    required: 'Role key is required',
                                    pattern: { value: /^[a-z0-9_]+$/, message: 'Lowercase letters, numbers and underscores only' },
                                })}
                                disabled={!!id}
                                placeholder="e.g. accounts_manager"
                                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.name
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            {id && <p className="mt-1 text-xs text-gray-500">The role key cannot be changed after creation.</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                {...register('displayName', { required: 'Display name is required' })}
                                placeholder="e.g. Accounts Manager"
                                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.displayName
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                            />
                            {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                rows={2}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Module Permissions</h2>
                            {isSystem && <span className="text-xs text-gray-500">System role — permissions can still be adjusted</span>}
                        </div>
                        {permissionsError && <p className="mb-3 text-sm text-red-600">Select at least one permission.</p>}

                        <div className="space-y-4">
                            {MODULE_GROUPS.map(({ module, resources }) => {
                                const modulePermissions = resources.flatMap((r) => grouped[r] || [])
                                if (modulePermissions.length === 0) return null
                                const allChecked = modulePermissions.every((p) => selectedPermissions.has(p))

                                return (
                                    <div key={module} className="rounded-2xl border border-gray-200 p-4">
                                        <label className="flex items-center gap-2 mb-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                onChange={(e) => toggleResource(modulePermissions, e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="font-semibold text-gray-900">{module}</span>
                                        </label>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pl-6">
                                            {resources.map((resource) => {
                                                const perms = grouped[resource]
                                                if (!perms || perms.length === 0) return null
                                                return (
                                                    <div key={resource} className="space-y-1.5">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                            {RESOURCE_LABELS[resource] || resource}
                                                        </p>
                                                        {perms.map((permission) => {
                                                            const action = permission.split(':')[1]
                                                            return (
                                                                <label key={permission} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedPermissions.has(permission)}
                                                                        onChange={() => togglePermission(permission)}
                                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                    {ACTION_LABELS[action] || action}
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : id ? 'Save Changes' : 'Create Role'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/roles')}
                            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
