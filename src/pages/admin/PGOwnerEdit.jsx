import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft } from 'lucide-react'
import { getAvailablePGs, getUser, updateUser } from '../../services/userService'

export default function PGOwnerEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pgs, setPgs] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { pgIds: [] },
    })

    useEffect(() => {
        Promise.all([getAvailablePGs(), getUser(id)])
            .then(([availablePgs, userData]) => {
                setPgs(availablePgs)
                reset({
                    ...userData,
                    pgIds: Array.isArray(userData.pgIds) ? userData.pgIds.map(String) : [],
                })
            })
            .catch(() => toast.error('Failed to load owner'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            const payload = {
                name: values.name,
                phone: values.phone,
                status: values.status,
                pgIds: Array.isArray(values.pgIds)
                    ? values.pgIds.map(Number)
                    : values.pgIds
                    ? [Number(values.pgIds)]
                    : [],
            }
            if (values.password) payload.password = values.password
            await updateUser(id, payload)
            toast.success('Owner updated')
            navigate('/admin/pg-owners')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update owner')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Owner details</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Edit PG Owner</h1>
                </div>
                <Button to="/admin/pg-owners" variant="ghost" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input {...register('name', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" {...register('email')} disabled className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input {...register('phone', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" {...register('password')} placeholder="Leave empty to keep existing" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select {...register('status')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned PGs</label>
                        <select
                            {...register('pgIds', {
                                validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value) || 'Select at least one PG',
                            })}
                            multiple
                            className="h-40 w-full rounded-2xl border border-gray-200 px-4 py-3 bg-white"
                        >
                            {pgs.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.pgName} — {p.city?.name || p.city || 'N/A'}
                                </option>
                            ))}
                        </select>
                        {errors.pgIds && <p className="mt-1 text-sm text-red-600">{errors.pgIds.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
