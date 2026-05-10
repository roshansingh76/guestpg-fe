import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { createBed, listRooms } from '../../services/pgService'

export default function BedCreate() {
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [rooms, setRooms] = useState([])
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { bedNumber: '', roomId: '', status: 'vacant' },
    })

    useEffect(() => {
        if (!pgId) return
        listRooms(pgId).then(setRooms).catch(() => { })
    }, [pgId])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            await createBed(pgId, values.roomId, { bedNumber: values.bedNumber, status: values.status })
            toast.success('Bed created')
            navigate('/owner/beds')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create bed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add bed</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New bed</h1>
                </div>
                <Link to="/owner/beds" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"><ArrowLeft size={18} /> Back</Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bed number</label>
                        <input {...register('bedNumber', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.bedNumber && <p className="mt-1 text-sm text-red-600">{errors.bedNumber.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                        <select {...register('roomId', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">Select a room</option>
                            {rooms.map((r) => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
                        </select>
                        {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select {...register('status')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Create bed'}
                        </button>
                        <Link to="/owner/beds" className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50">Cancel</Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}
