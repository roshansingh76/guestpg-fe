import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft } from 'lucide-react'
import { getAllCities } from '../../services/cityService'
import { createArea, getAreaById, updateArea } from '../../services/areaService'

export default function AreaEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [cities, setCities] = useState([])
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            cityId: '',
        },
    })

    useEffect(() => {
        Promise.all([getAllCities(), id ? getAreaById(id) : Promise.resolve(null)])
            .then(([citiesResponse, areaResponse]) => {
                const citiesData = Array.isArray(citiesResponse) ? citiesResponse : []
                setCities(citiesData)

                if (areaResponse) {
                    const area = areaResponse.data || areaResponse
                    reset({
                        name: area.name || '',
                        cityId: area.city?.id || area.cityId || '',
                    })
                }
            })
            .catch(() => toast.error('Failed to load data'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            if (id) {
                await updateArea(id, { name: values.name, cityId: Number(values.cityId) })
                toast.success('Area updated successfully')
            } else {
                await createArea({ name: values.name, cityId: Number(values.cityId) })
                toast.success('Area created successfully')
            }
            navigate('/admin/areas')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save area')
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
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit Area' : 'Add Area'}</h1>
                </div>
                <Button to="/admin/areas" variant="secondary" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={18} /> Back to areas
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area name</label>
                        <input
                            {...register('name', { required: 'Area name is required' })}
                            className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                            placeholder="Enter area name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <select
                            {...register('cityId', { required: 'City is required' })}
                            className={`w-full rounded-2xl border px-4 py-3 bg-white focus:outline-none focus:ring-2 transition ${errors.cityId
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>}
                    </div>

                    <div className="md:col-span-2 flex gap-4">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Saving...' : id ? 'Save Area' : 'Create Area'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/admin/areas')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
