import { useMemo } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import { getGuest, updateGuest } from '../../services/guestService'

export default function GuestEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const guest = useMemo(
        () => getGuest(id),
        [id]
    )
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: guest || {},
    })

    const onSubmit = (values) => {
        updateGuest(id, values)
        toast.success('Guest profile updated')
        navigate('/owner/guests')
    }

    if (!guest) {
        return (
            <div className="p-8">
                <p className="text-gray-600">Guest not found.</p>
                <Link to="/owner/guests" className="text-blue-600 hover:underline">Back to guests</Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit guest</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Guest profile</h1>
                </div>
                <Link to="/owner/guests" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back to guest list
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            {...register('name', { required: 'Guest name is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            {...register('phone', { required: 'Phone is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar</label>
                        <input
                            {...register('aadhar', { required: 'Aadhaar is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.aadhar && <p className="mt-2 text-sm text-red-600">{errors.aadhar.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency contact</label>
                        <input
                            {...register('emergency', { required: 'Emergency contact is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.emergency && <p className="mt-2 text-sm text-red-600">{errors.emergency.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                            {...register('address', { required: 'Address is required' })}
                            rows={3}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
                            Save profile
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
