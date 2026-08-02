import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchableMultiSelect from '../../components/common/SearchableMultiSelect'
import { ArrowLeft } from 'lucide-react'
import { createUser, getAvailablePGs } from '../../services/userService'

export default function PGOwnerCreate() {
    const navigate = useNavigate()
    const [pgs, setPgs] = useState([])
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: { name: '', email: '', phone: '', password: 'password', pgIds: [] },
    })

    const pgOptions = useMemo(
        () => pgs.map((p) => ({ value: p.id, label: `${p.pgName} — ${p.city?.name || p.city || 'N/A'}` })),
        [pgs]
    )

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
                        <input type="email" {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit mobile number' } })} placeholder="9876543210" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input type="password" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign PGs</label>
                        <Controller
                            name="pgIds"
                            control={control}
                            rules={{ validate: (value) => (Array.isArray(value) && value.length > 0) || 'Select at least one PG' }}
                            render={({ field }) => (
                                <SearchableMultiSelect
                                    options={pgOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search PGs by name or city..."
                                    emptyLabel="No matching PGs"
                                    error={errors.pgIds}
                                />
                            )}
                        />
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
