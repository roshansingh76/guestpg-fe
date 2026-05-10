import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { listRooms, updateBed, listBedsByPG } from '../../services/pgService'

export default function BedEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [rooms, setRooms] = useState([])
    const [bed, setBed] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (!pgId) return
        Promise.all([listRooms(pgId), listBedsByPG(pgId)])
            .then(([roomsData, bedsData]) => {
                setRooms(roomsData)
                const found = bedsData.find((b) => b.id.toString() === id)
                if (found) { setBed(found); reset(found) }
            })
            .catch(() => toast.error('Failed to load data'))
            .finally(() => setLoading(false))
    }, [pgId, id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            await updateBed(pgId, bed.roomId, id, { bedNumber: values.bedNumber, status: values.status })
            toast.success('Bed updated')
            navigate('/owner/beds')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update bed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>
    if (!bed) return <div className="p-8"><p className="text-gray-600">Bed not found.</p><Link to="/owner/beds" className="text-blue-600 hover:underline">Back</Link></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit bed</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{bed.bedNumber}</h1>
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
                        <select {...register('roomId')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            {rooms.map((r) => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select {...register('status')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="reserved">Reserved</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save bed'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
