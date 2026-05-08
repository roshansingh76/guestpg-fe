import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { pgOwners } from '../../data/mockData'
import { ArrowLeft } from 'lucide-react'

export default function PGOwnerEdit() {
    const { id } = useParams()
    const owner = useMemo(
        () => pgOwners.find((item) => item.id.toString() === id),
        [id]
    )
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: owner || {},
    })

    const onSubmit = () => {
        toast.success('Owner details saved successfully')
    }

    if (!owner) {
        return (
            <div className="p-8">
                <p className="text-gray-600">Owner not found.</p>
                <Link to="/admin/pg-owners" className="text-blue-600 hover:underline">Back to owners</Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Owner details</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Edit PG Owner</h1>
                </div>
                <Link to="/admin/pg-owners" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back to list
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Owner name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                        <input
                            {...register('phone', { required: 'Phone is required' })}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            {...register('status')}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
