import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card'
import { createBed } from '../../services/bedService'
import { listRooms } from '../../services/roomService'

export default function BedCreate() {
    const navigate = useNavigate()
    const rooms = listRooms()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            number: '',
            room: '',
            status: 'vacant',
        },
    })

    const onSubmit = (values) => {
        createBed(values)
        toast.success('Bed created successfully')
        navigate('/owner/beds')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add bed</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New bed</h1>
                </div>
                <Link to="/owner/beds" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back to beds
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bed number</label>
                        <input
                            {...register('number', { required: 'Bed number is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.number && <p className="mt-2 text-sm text-red-600">{errors.number.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                        <select
                            {...register('room', { required: 'Room is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Select a room</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.number}>{r.number}</option>
                            ))}
                        </select>
                        {errors.room && <p className="mt-2 text-sm text-red-600">{errors.room.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="vacant">vacant</option>
                            <option value="occupied">occupied</option>
                        </select>
                        {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                            Create bed
                        </button>
                        <Link to="/owner/beds" className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}

