import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { createRoom } from '../../services/roomService'

export default function RoomCreate() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            number: '',
            type: '',
            totalBeds: 1,
            availableBeds: 0,
            rent: 0,
        },
    })

    const onSubmit = (values) => {
        createRoom({
            ...values,
            totalBeds: Number(values.totalBeds),
            availableBeds: Number(values.availableBeds),
            rent: Number(values.rent),
        })
        toast.success('Room created successfully')
        navigate('/owner/rooms')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add room</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New room</h1>
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
                    <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                            Create room
                        </button>
                        <Link to="/owner/rooms" className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}

