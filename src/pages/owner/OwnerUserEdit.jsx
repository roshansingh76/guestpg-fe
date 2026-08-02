import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { createUser, getUser, updateUser } from '../../services/userService'
import { listPGs } from '../../services/pgService'

export default function OwnerUserEdit() {
    const { id } = useParams()
    const isEdit = Boolean(id)
    const navigate = useNavigate()
    const currentUser = useSelector((s) => s.auth.user)
    const ownerPgIds = currentUser?.pgIds || (currentUser?.pgId ? [currentUser.pgId] : [])

    const [pgs, setPgs] = useState([])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(isEdit)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '', email: '', phone: '', password: '', pgIds: [] },
    })

    useEffect(() => {
        // Load only the PGs this owner manages
        listPGs()
            .then((data) => setPgs(Array.isArray(data) ? data : data.pgs || []))
            .catch(() => toast.error('Failed to load PGs'))
    }, [])

    useEffect(() => {
        if (!isEdit) return
        getUser(id)
            .then((user) => {
                reset({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '',
                    pgIds: user.pgIds || (user.pgId ? [user.pgId] : []),
                })
            })
            .catch(() => toast.error('Failed to load user'))
            .finally(() => setLoading(false))
    }, [id, isEdit, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            const pgIds = Array.isArray(values.pgIds)
                ? values.pgIds.map(Number).filter(Boolean)
                : values.pgIds
                ? [Number(values.pgIds)]
                : []

            if (pgIds.length === 0) {
                toast.error('Assign at least one PG')
                return
            }

            const payload = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: 'pg_staff',
                pgIds,
            }

            if (values.password) payload.password = values.password

            if (isEdit) {
                await updateUser(id, payload)
                toast.success('User updated')
            } else {
                if (!values.password) {
                    toast.error('Password is required')
                    return
                }
                await createUser({ ...payload, password: values.password })
                toast.success('Staff user created')
            }
            navigate('/owner/users')
        } catch (err) {
            toast.error(
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                'Failed to save user'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="text-center text-gray-500 py-12">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">
                        {isEdit ? 'Edit staff' : 'Add staff'}
                    </p>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        {isEdit ? 'Edit user' : 'New staff user'}
                    </h1>
                </div>
                <Button
                    onClick={() => navigate('/owner/users')}
                    variant="ghost"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            {...register('name', { required: 'Required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            {...register('phone', { required: 'Required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password {isEdit && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                        </label>
                        <input
                            type="password"
                            {...register('password', { required: !isEdit ? 'Required' : false })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={isEdit ? 'Leave blank to keep current' : ''}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign to PG(s) <span className="text-gray-400 font-normal">(hold Ctrl / Cmd to select multiple)</span>
                        </label>
                        <select
                            {...register('pgIds', {
                                validate: (value) =>
                                    (Array.isArray(value) ? value.length > 0 : !!value) ||
                                    'Select at least one PG',
                            })}
                            multiple
                            className="h-40 w-full rounded-2xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {pgs.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.pgName} — {p.city?.name || 'N/A'}
                                </option>
                            ))}
                        </select>
                        {errors.pgIds && <p className="mt-1 text-sm text-red-600">{errors.pgIds.message}</p>}
                        {pgs.length === 0 && (
                            <p className="mt-1 text-sm text-gray-400">No PGs available</p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : isEdit ? 'Update user' : 'Create user'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/owner/users')}
                            className="rounded-2xl border border-gray-200 px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
