import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft } from 'lucide-react'
import { createUser, getAvailablePGs } from '../../services/userService'

export default function PGOwnerCreate() {
    const navigate = useNavigate()
    const [pgs, setPgs] = useState([])
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { name: '', email: '', phone: '', password: 'password', pgIds: [] },
    })

    useEffect(() => {
        getAvailablePGs().then(setPgs).catch(() => toast.error('Failed to load PGs'))
    }, [])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            await createUser({
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password,
                role: 'pg_owner',
                pgIds: Array.isArray(values.pgIds)
                    ? values.pgIds.map(Number)
                    : values.pgIds
                    ? [Number(values.pgIds)]
                    : [],
            })
            toast.success('Owner created')
            navigate('/admin/pg-owners')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create owner')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add owner</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New PG Owner</h1>
                </div>
                <Button to="/admin/pg-owners" variant="ghost" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input {...register('name', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" {...register('email', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input {...register('phone', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" {...register('password', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign PGs</label>
                        <select
                            {...register('pgIds', {
                                validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value) || 'Select at least one PG',
                            })}
                            multiple
                            className="h-40 w-full rounded-2xl border border-gray-200 px-4 py-3 bg-white"
                        >
                            {pgs.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.pgName} — {p.city}
                                </option>
                            ))}
                        </select>
                        {errors.pgIds && <p className="mt-1 text-sm text-red-600">{errors.pgIds.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Create owner'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
