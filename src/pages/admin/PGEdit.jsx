import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import { getPG, createPG, updatePG } from '../../services/pgService'

export default function PGEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (!id) return setLoading(false)
        getPG(id)
            .then((data) => {
                // backend wraps response as data or plain object depending on endpoint
                const pg = data.data || data
                reset(pg)
            })
            .catch(() => toast.error('Failed to load PG'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            // Validate latitude/longitude before sending to backend
            const lat = Number(values.latitude)
            const lng = Number(values.longitude)
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                toast.error('Latitude and longitude are required and must be numbers')
                setSaving(false)
                return
            }

            const payload = {
                pgName: values.pgName,
                ownerName: values.ownerName,
                ownerPhone: values.ownerPhone,
                ownerEmail: values.ownerEmail,
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2,
                nearbyMark: values.nearbyMark,
                area: values.area,
                city: values.city,
                state: values.state,
                latitude: lat,
                longitude: lng,
                pgType: values.pgType,
                numberOfRooms: Number(values.numberOfRooms) || 0,
                isFoodAvailable: !!values.isFoodAvailable,
            }

            if (id) {
                await updatePG(id, payload)
                toast.success('PG updated')
            } else {
                await createPG(payload)
                toast.success('PG created')
            }
            navigate('/admin/pgs')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save PG')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Property management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit PG' : 'Add PG'}</h1>
                </div>
                <Link to="/admin/pgs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PG Name</label>
                        <input {...register('pgName', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                        {errors.pgName && <p className="mt-1 text-sm text-red-600">{errors.pgName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                        <input {...register('ownerName', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Email</label>
                        <input type="email" {...register('ownerEmail', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner Phone</label>
                        <input {...register('ownerPhone', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input {...register('addressLine1', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                        <input {...register('addressLine2')} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nearby landmark</label>
                        <input {...register('nearbyMark')} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area / Locality</label>
                        <input {...register('area', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input {...register('city', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input {...register('state', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input {...register('latitude', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input {...register('longitude', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PG Type</label>
                        <select {...register('pgType', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-white">
                            <option value="Boys">Boys</option>
                            <option value="Girls">Girls</option>
                            <option value="CoLiving">CoLiving</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of rooms</label>
                        <input type="number" {...register('numberOfRooms')} className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-4">
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" {...register('isFoodAvailable')} className="form-checkbox" />
                            <span className="text-sm text-gray-700">Food available</span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : id ? 'Save changes' : 'Create PG'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
