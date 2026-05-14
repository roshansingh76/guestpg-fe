import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft } from 'lucide-react'
import { createCity, getCityById, updateCity } from '../../services/cityService'

export default function CityEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            state: '',
        },
    })

    useEffect(() => {
        if (!id) return setLoading(false)
        getCityById(id)
            .then((data) => {
                const city = data.data || data
                reset({
                    name: city.name || '',
                    state: city.state || '',
                })
            })
            .catch(() => toast.error('Failed to load city'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            if (id) {
                await updateCity(id, values)
                toast.success('City updated successfully')
            } else {
                await createCity(values)
                toast.success('City created successfully')
            }
            navigate('/admin/cities')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save city')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Master data</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit City' : 'Add City'}</h1>
                </div>
                <Button to="/admin/cities" variant="secondary" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={18} /> Back to cities
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City name</label>
                        <input
                            {...register('name', { required: 'City name is required' })}
                            className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                            placeholder="Enter city name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                            {...register('state', { required: 'State is required' })}
                            className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.state
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                            placeholder="Enter state"
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Saving...' : id ? 'Save City' : 'Create City'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/admin/cities')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
