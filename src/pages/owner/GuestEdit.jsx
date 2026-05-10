import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { getGuest, updateGuest } from '../../services/guestService'

export default function GuestEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (!pgId) return
        getGuest(pgId, id)
            .then((data) => reset(data))
            .catch(() => toast.error('Failed to load guest'))
            .finally(() => setLoading(false))
    }, [pgId, id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            await updateGuest(pgId, id, values)
            toast.success('Guest updated')
            navigate('/owner/guests')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update guest')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit guest</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Guest profile</h1>
                </div>
                <Link to="/owner/guests" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input {...register('name', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input {...register('phone', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar</label>
                        <input {...register('aadhar', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.aadhar && <p className="mt-1 text-sm text-red-600">{errors.aadhar.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency contact</label>
                        <input {...register('emergency')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency phone</label>
                        <input {...register('emergencyPhone')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea {...register('address')} rows={3} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save profile'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
