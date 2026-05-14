import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import { getPG, createPG, updatePG } from '../../services/pgService'
import { getCities } from '../../services/cityService'
import { getAreasByCity } from '../../services/areaService'

export default function PGEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const [cities, setCities] = useState([])
    const [areas, setAreas] = useState([])
    const [loadingCities, setLoadingCities] = useState(true)
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            isFoodAvailable: false,
        },
    })

    const selectedCityId = watch('cityId')

    const formatPGForForm = (pg) => ({
        pgName: pg.pgName || '',
        ownerName: pg.ownerName || '',
        ownerPhone: pg.ownerPhone || '',
        ownerEmail: pg.ownerEmail || '',
        addressLine1: pg.addressLine1 || '',
        addressLine2: pg.addressLine2 || '',
        nearbyMark: pg.nearbyMark || '',
        areaId: pg.area?.id || pg.areaId || '',
        cityId: pg.city?.id || pg.cityId || '',
        state: pg.state || '',
        latitude: pg.latitude?.toString() || '',
        longitude: pg.longitude?.toString() || '',
        pgType: pg.pgType || '',
        numberOfRooms: pg.numberOfRooms?.toString() || '',
        isFoodAvailable: pg.isFoodAvailable || false,
    })

    // Load cities
    useEffect(() => {
        getCities()
            .then((citiesList) => {
                setCities(Array.isArray(citiesList) ? citiesList : [])
            })
            .catch(() => {
                toast.error('Failed to load cities')
                setCities([])
            })
            .finally(() => setLoadingCities(false))
    }, [])

    // Load areas when city is selected
    useEffect(() => {
        if (selectedCityId && !loadingCities) {
            getAreasByCity(selectedCityId)
                .then((areasList) => {
                    setAreas(Array.isArray(areasList) ? areasList : [])
                })
                .catch(() => {
                    toast.error('Failed to load areas')
                    setAreas([])
                })
        } else {
            setAreas([])
        }
    }, [selectedCityId, loadingCities])

    // Load PG if editing
    useEffect(() => {
        if (!id) return setLoading(false)
        getPG(id)
            .then((data) => {
                // backend wraps response as data or plain object depending on endpoint
                const pg = data.data || data
                reset(formatPGForForm(pg))
            })
            .catch(() => toast.error('Failed to load PG'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            // Validate latitude/longitude before sending to backend
            const lat = Number(values.latitude)
            const lng = Number(values.longitude)
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                toast.error('Latitude and longitude are required and must be numbers')
                setSaving(false)
                return
            }

            const payload = {
                pgName: values.pgName,
                ownerName: values.ownerName,
                ownerPhone: values.ownerPhone,
                ownerEmail: values.ownerEmail,
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2,
                nearbyMark: values.nearbyMark,
                areaId: Number(values.areaId),
                cityId: Number(values.cityId),
                state: values.state,
                latitude: lat,
                longitude: lng,
                pgType: values.pgType,
                numberOfRooms: Number(values.numberOfRooms) || 0,
                isFoodAvailable: !!values.isFoodAvailable,
            }

            if (id) {
                await updatePG(id, payload)
                toast.success('PG updated successfully')
            } else {
                await createPG(payload)
                toast.success('PG created successfully')
            }
            navigate('/admin/pgs')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save PG')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Property management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit PG' : 'Add PG'}</h1>
                </div>
                <Link to="/admin/pgs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium gap-2">
                    <ArrowLeft size={18} /> Back
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Owner Details Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Owner Details</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('ownerName', { required: 'Owner name is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.ownerName
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="Enter owner's full name"
                                />
                                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register('ownerEmail', { required: 'Owner email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.ownerEmail
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="owner@example.com"
                                />
                                {errors.ownerEmail && <p className="mt-1 text-sm text-red-600">{errors.ownerEmail.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Owner Phone <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('ownerPhone', { required: 'Owner phone is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.ownerPhone
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                                {errors.ownerPhone && <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* PG Details Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">PG Details</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PG Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('pgName', { required: 'PG name is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.pgName
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="Enter PG name"
                                />
                                {errors.pgName && <p className="mt-1 text-sm text-red-600">{errors.pgName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PG Type <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register('pgType', { required: 'PG type is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 bg-white focus:outline-none focus:ring-2 transition ${errors.pgType
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Boys">Boys</option>
                                    <option value="Girls">Girls</option>
                                    <option value="CoLiving">CoLiving</option>
                                </select>
                                {errors.pgType && <p className="mt-1 text-sm text-red-600">{errors.pgType.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Rooms
                                </label>
                                <input
                                    type="number"
                                    {...register('numberOfRooms')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-3 mt-6 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('isFoodAvailable')}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Food available</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register('cityId', { required: 'City is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 bg-white focus:outline-none focus:ring-2 transition ${errors.cityId
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    disabled={loadingCities || cities.length === 0}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>}
                                {loadingCities && <p className="mt-1 text-sm text-gray-500">Loading cities...</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Area / Locality <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register('areaId', { required: 'Area is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 bg-white focus:outline-none focus:ring-2 transition ${errors.areaId
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    disabled={!selectedCityId || areas.length === 0}
                                >
                                    <option value="">
                                        {!selectedCityId ? 'Select a city first' : areas.length === 0 ? 'No areas available' : 'Select Area'}
                                    </option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.areaId && <p className="mt-1 text-sm text-red-600">{errors.areaId.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('state', { required: 'State is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.state
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="e.g., Haryana, Delhi"
                                />
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nearby Landmark
                                </label>
                                <input
                                    {...register('nearbyMark')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="e.g., Near Metro Station"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-b pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Address</h2>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 1 <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('addressLine1', { required: 'Address line 1 is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.addressLine1
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="Enter street address"
                                />
                                {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address Line 2
                                </label>
                                <input
                                    {...register('addressLine2')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Apartment, suite, etc. (optional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Coordinates Section */}
                    <div className="pb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Coordinates</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('latitude', { required: 'Latitude is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.latitude
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="e.g., 28.6139"
                                    step="0.0001"
                                />
                                {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register('longitude', { required: 'Longitude is required' })}
                                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.longitude
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="e.g., 77.2090"
                                    step="0.0001"
                                />
                                {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : id ? 'Save Changes' : 'Create PG'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/pgs')}
                            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
