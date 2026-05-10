import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { getRoom, updateRoom } from '../../services/pgService'

export default function RoomEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (!pgId) return
        getRoom(pgId, id)
            .then((data) => reset(data))
            .catch(() => toast.error('Failed to load room'))
            .finally(() => setLoading(false))
    }, [pgId, id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            await updateRoom(pgId, id, { ...values, totalBeds: Number(values.totalBeds), availableBeds: Number(values.availableBeds), pricePerBed: Number(values.pricePerBed) })
            toast.success('Room updated')
            navigate('/owner/rooms')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update room')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit room</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Room details</h1>
                </div>
                <Link to="/owner/rooms" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"><ArrowLeft size={18} /> Back</Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room number</label>
                        <input {...register('roomNumber', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room type</label>
                        <input {...register('roomType', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.roomType && <p className="mt-1 text-sm text-red-600">{errors.roomType.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">AC type</label>
                        <select {...register('acType')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="NonAC">Non-AC</option>
                            <option value="AC">AC</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total beds</label>
                        <input type="number" {...register('totalBeds', { required: 'Required', min: 1 })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.totalBeds && <p className="mt-1 text-sm text-red-600">{errors.totalBeds.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available beds</label>
                        <input type="number" {...register('availableBeds', { required: 'Required', min: 0 })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.availableBeds && <p className="mt-1 text-sm text-red-600">{errors.availableBeds.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price per bed (₹)</label>
                        <input type="number" {...register('pricePerBed', { required: 'Required', min: 0 })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.pricePerBed && <p className="mt-1 text-sm text-red-600">{errors.pricePerBed.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save room'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
