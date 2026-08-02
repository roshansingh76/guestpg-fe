import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import { getUser, createUser, updateUser } from '../../services/userService'
import { listRoles } from '../../services/roleService'

export default function StaffUserEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const [roles, setRoles] = useState([])
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '', email: '', phone: '', password: '', role: '', status: 'active' },
    })

    useEffect(() => {
        listRoles({ limit: 100 })
            .then((data) => {
                const list = Array.isArray(data) ? data : []
                setRoles(list.filter((r) => r.name !== 'pg_owner' && r.name !== 'pg_staff'))
            })
            .catch(() => toast.error('Failed to load roles'))
    }, [])

    useEffect(() => {
        if (!id) return setLoading(false)
        getUser(id)
            .then((user) => {
                reset({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '',
                    role: typeof user.role === 'string' ? user.role : user.role?.name || '',
                    status: user.status || 'active',
                })
            })
            .catch(() => toast.error('Failed to load user'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            if (id) {
                const payload = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    role: values.role,
                    status: values.status,
                }
                if (values.password) payload.password = values.password
                await updateUser(id, payload)
                toast.success('User updated successfully')
            } else {
                await createUser({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                    role: values.role,
                })
                toast.success('User created successfully')
            }
            navigate('/admin/staff')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save user')
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
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit Staff User' : 'Add Staff User'}</h1>
                </div>
                <Link to="/admin/staff" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium gap-2">
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input {...register('name', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone <span className="text-red-600">*</span>
                        </label>
                        <input
                            {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' } })}
                            placeholder="9876543210"
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Select a role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>{role.displayName}</option>
                            ))}
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password {!id && <span className="text-red-600">*</span>}
                        </label>
                        <input
                            type="password"
                            {...register('password', {
                                required: id ? false : 'Required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                        {id && <p className="mt-1 text-xs text-gray-500">Leave blank to keep the current password.</p>}
                    </div>
                    {id && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select {...register('status')} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    )}

                    <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : id ? 'Save changes' : 'Create user'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/staff')} className="rounded-2xl border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
