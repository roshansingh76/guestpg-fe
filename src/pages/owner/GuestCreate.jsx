import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, X } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { createGuest } from '../../services/guestService'
import { listPGs, listRooms } from '../../services/pgService'
import { getAssetUrl } from '../../services/api'

export default function GuestCreate() {
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const isOwner = user?.role === 'pg_owner' || user?.role === 'pg_staff'
    const [pgs, setPgs] = useState([])
    const [rooms, setRooms] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(user?.pgId ? String(user.pgId) : '')
    const [saving, setSaving] = useState(false)
    const [photoPreview, setPhotoPreview] = useState('')
    const [idProofPreview, setIdProofPreview] = useState('')
    const [viewingImage, setViewingImage] = useState(null)
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: { name: '', phone: '', aadhar: '', roomId: '', moveInDate: '', moveOutDate: '', emergency: '', emergencyPhone: '', address: '' },
    })

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

    useEffect(() => {
        if (!selectedPgId) {
            setRooms([])
            return
        }

        listRooms(selectedPgId)
            .then(setRooms)
            .catch(() => setRooms([]))
    }, [selectedPgId])

    const onSubmit = async (values) => {
        if (!selectedPgId) {
            toast.error('Please select a PG')
            return
        }
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

            await createGuest(selectedPgId, formData)
            toast.success('Tenant created successfully')
            navigate('/owner/tenants')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create tenant')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Add tenant</p>
                    <h1 className="text-3xl font-semibold text-gray-900">New tenant</h1>
                </div>
                <Button to="/owner/tenants" variant="ghost" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
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
                        {isOwner && <p className="mt-1 text-sm text-gray-500">You can only create tenants for your assigned PG</p>}
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
                        <select {...register('roomId', { required: rooms.length > 0 ? 'Select a room' : false })} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- Select a room --</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.roomNumber}</option>
                            ))}
                        </select>
                        {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>}
                        {selectedPgId && rooms.length === 0 && <p className="mt-2 text-sm text-gray-500">No rooms available for this PG.</p>}
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
                    <div className="md:col-span-2 flex items-center gap-3">
                        <Button type="submit" disabled={saving} variant="primary" className="px-6 py-3">
                            {saving ? 'Saving...' : 'Create tenant'}
                        </Button>
                        <Button to="/owner/tenants" variant="secondary" className="px-6 py-3">
                            Cancel
                        </Button>
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
