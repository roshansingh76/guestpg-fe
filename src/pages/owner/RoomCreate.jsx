import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { createRoom, listPGs } from '../../services/pgService'

export default function RoomCreate() {
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const isOwner = user?.role === 'pg_owner' || user?.role === 'pg_staff'
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(user?.pgId ? String(user.pgId) : '')
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { roomNumber: '', roomType: '', acType: 'NonAC', totalBeds: 1, availableBeds: 1, pricePerBed: 0 },
    })

    useEffect(() => {
        const loadPGs = async () => {
            try {
                const pgList = await listPGs()
                setPgs(pgList)
                if (!selectedPgId && pgList.length > 0) {
                    setSelectedPgId(String(pgList[0].id))
                }
            } catch (error) {
                console.error('Failed to load PGs', error)
                toast.error('Failed to load PGs')
            }
        }
        loadPGs()
    }, [])

    const onSubmit = async (values) => {
        if (!selectedPgId) {
            toast.error('Please select a PG')
            return
        }
        setSaving(true)
        try {
            await createRoom(selectedPgId, { ...values, totalBeds: Number(values.totalBeds), availableBeds: Number(values.availableBeds), pricePerBed: Number(values.pricePerBed) })
            toast.success('Room created')
            navigate('/owner/rooms')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create room')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add room</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New room</h1>
                </div>
                <Button to="/owner/rooms" variant="ghost" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select PG</label>
                        <select
                            value={selectedPgId}
                            onChange={(e) => setSelectedPgId(e.target.value)}
                            disabled={isOwner}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">-- Select a PG --</option>
                            {pgs.map((pg) => (
                                <option key={pg.id} value={String(pg.id)}>{pg.pgName}</option>
                            ))}
                        </select>
                        {isOwner && <p className="mt-1 text-sm text-gray-500">You can only create rooms for your assigned PG</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room number</label>
                        <input {...register('roomNumber', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room type</label>
                        <input {...register('roomType', { required: 'Required' })} placeholder="e.g. 4 Sharing" className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                    <div className="md:col-span-2 flex items-center gap-3">
                        <Button type="submit" disabled={saving} variant="primary" className="px-6 py-3">
                            {saving ? 'Saving...' : 'Create room'}
                        </Button>
                        <Button to="/owner/rooms" variant="secondary" className="px-6 py-3">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
