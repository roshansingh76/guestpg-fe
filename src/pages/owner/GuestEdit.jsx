import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, X } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { getGuest, updateGuest } from '../../services/guestService'
import { listPGs, listRooms } from '../../services/pgService'
import { getAssetUrl } from '../../services/api'

export default function GuestEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const pgId = user?.pgId || localStorage.getItem('selectedPgId')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pgName, setPgName] = useState('')
    const [rooms, setRooms] = useState([])
    const [photoPreview, setPhotoPreview] = useState('')
    const [idProofPreview, setIdProofPreview] = useState('')
    const [viewingImage, setViewingImage] = useState(null)
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

    useEffect(() => {
        if (!pgId) return
        getGuest(pgId, id)
            .then((data) => {
                reset(data)
                setPhotoPreview(data.photoUrl || '')
                setIdProofPreview(data.idProofUrl || '')
            })
            .catch(() => toast.error('Failed to load guest'))
            .finally(() => setLoading(false))
    }, [pgId, id, reset])

    useEffect(() => {
        if (!pgId) return
        listRooms(pgId)
            .then(setRooms)
            .catch(() => setRooms([]))
    }, [pgId])

    useEffect(() => {
        if (!pgId) return
        listPGs()
            .then((pgList) => {
                const pg = pgList.find((item) => String(item.id) === String(pgId))
                setPgName(pg?.pgName || '')
            })
            .catch(() => {})
    }, [pgId])

    const photoFiles = watch('photo')
    const idProofFiles = watch('idProof')

    useEffect(() => {
        if (photoFiles?.[0]) {
            const reader = new FileReader()
            reader.onloadend = () => setPhotoPreview(reader.result)
            reader.readAsDataURL(photoFiles[0])
        }
    }, [photoFiles])

    useEffect(() => {
        if (idProofFiles?.[0]) {
            const reader = new FileReader()
            reader.onloadend = () => setIdProofPreview(reader.result)
            reader.readAsDataURL(idProofFiles[0])
        }
    }, [idProofFiles])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('phone', values.phone)
            formData.append('aadhar', values.aadhar)
            if (values.roomId) formData.append('roomId', values.roomId)
            if (values.moveInDate) formData.append('moveInDate', values.moveInDate)
            if (values.moveOutDate) formData.append('moveOutDate', values.moveOutDate)
            if (values.emergency) formData.append('emergency', values.emergency)
            if (values.emergencyPhone) formData.append('emergencyPhone', values.emergencyPhone)
            if (values.address) formData.append('address', values.address)
            if (values.photo?.[0]) formData.append('photo', values.photo[0])
            if (values.idProof?.[0]) formData.append('idProof', values.idProof[0])

            await updateGuest(pgId, id, formData)
            toast.success('Tenant updated')
            navigate('/owner/tenants')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update tenant')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Edit tenant</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Tenant profile</h1>
                </div>
                <Button to="/owner/tenants" variant="ghost" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PG Name</label>
                        <input value={pgName} disabled className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-700 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input {...register('name', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input {...register('phone', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar</label>
                        <input {...register('aadhar', { required: 'Required' })} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.aadhar && <p className="mt-1 text-sm text-red-600">{errors.aadhar.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select room</label>
                        <select {...register('roomId')} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Select a room --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.roomNumber}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Move-in date</label>
                        <input type="date" {...register('moveInDate')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Move-out date</label>
                        <input type="date" {...register('moveOutDate')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tenant photo</label>
                        {photoPreview && (
                            <div className="mb-3 relative inline-block">
                                <img src={photoPreview.startsWith('data:') ? photoPreview : getAssetUrl(photoPreview)} alt="Tenant" className="w-24 h-24 rounded-lg object-cover border border-gray-200 cursor-pointer" onClick={() => setViewingImage({ src: photoPreview.startsWith('data:') ? photoPreview : getAssetUrl(photoPreview), alt: 'Tenant Photo' })} />
                            </div>
                        )}
                        <input type="file" accept="image/*" {...register('photo')} className="w-full text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID proof image</label>
                        {idProofPreview && (
                            <div className="mb-3 relative inline-block">
                                <img src={idProofPreview.startsWith('data:') ? idProofPreview : getAssetUrl(idProofPreview)} alt="ID Proof" className="w-24 h-24 rounded-lg object-cover border border-gray-200 cursor-pointer" onClick={() => setViewingImage({ src: idProofPreview.startsWith('data:') ? idProofPreview : getAssetUrl(idProofPreview), alt: 'ID Proof' })} />
                            </div>
                        )}
                        <input type="file" accept="image/*" {...register('idProof')} className="w-full text-gray-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency contact</label>
                        <input {...register('emergency')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Emergency phone</label>
                        <input {...register('emergencyPhone')} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea {...register('address')} rows={3} className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={saving} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save profile'}
                        </button>
                    </div>
                </form>
            </Card>

            {viewingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative bg-white rounded-lg">
                        <button onClick={() => setViewingImage(null)} className="absolute -top-10 right-0 text-white hover:text-gray-300">
                            <X size={24} />
                        </button>
                        <img src={viewingImage.src} alt={viewingImage.alt} className="max-w-2xl max-h-96 rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    )
}
