import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { getRoom, updateRoom } from '../../services/roomService'

export default function RoomEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const room = useMemo(() => getRoom(id), [id])

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: room || {},
    })

    const onSubmit = (values) => {
        updateRoom(id, {
            ...values,
            totalBeds: Number(values.totalBeds),
            availableBeds: Number(values.availableBeds),
            rent: Number(values.rent),
        })
        toast.success('Room updated successfully')
        navigate('/owner/rooms')
    }

    if (!room) {
        return (
            <div className="p-8">
                <p className="text-gray-600">Room not found.</p>
                <Link to="/owner/rooms" className="text-blue-600 hover:underline">Back to rooms</Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit room</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{room.number}</h1>
                </div>
                <Link to="/owner/rooms" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back to rooms
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room number</label>
                        <input
                            {...register('number', { required: 'Room number is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.number && <p className="mt-2 text-sm text-red-600">{errors.number.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sharing type</label>
                        <input
                            {...register('type', { required: 'Sharing type is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 4 Sharing"
                        />
                        {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total beds</label>
                        <input
                            type="number"
                            {...register('totalBeds', { required: 'Total beds is required', min: { value: 1, message: 'Minimum 1 bed' } })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.totalBeds && <p className="mt-2 text-sm text-red-600">{errors.totalBeds.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available beds</label>
                        <input
                            type="number"
                            {...register('availableBeds', { required: 'Available beds is required', min: { value: 0, message: 'Cannot be negative' } })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.availableBeds && <p className="mt-2 text-sm text-red-600">{errors.availableBeds.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rent (₹)</label>
                        <input
                            type="number"
                            {...register('rent', { required: 'Rent is required', min: { value: 0, message: 'Cannot be negative' } })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.rent && <p className="mt-2 text-sm text-red-600">{errors.rent.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                            Save room
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

