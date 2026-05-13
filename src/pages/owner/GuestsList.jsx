import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search, Pencil, Trash2, Plus, Image, X, Building, User, Phone, FileText, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { deleteGuest, listGuests } from '../../services/guestService'
import { listPGs } from '../../services/pgService'
import { getAssetUrl } from '../../services/api'

export default function GuestsList() {
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const isOwner = user?.role === 'pg_owner' || user?.role === 'pg_staff'
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(user?.pgId ? String(user.pgId) : '')
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })
    const [viewingImage, setViewingImage] = useState(null)

    useEffect(() => {
        const loadPGs = async () => {
            try {
                const pgList = await listPGs()
                setPgs(pgList)
                // Set first PG if user is owner or if no selection yet
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
            setList([])
            setLoading(false)
            return
        }
        setLoading(true)
        localStorage.setItem('selectedPgId', selectedPgId)
        listGuests(selectedPgId)
            .then(setList)
            .catch(() => toast.error('Failed to load tenants'))
            .finally(() => setLoading(false))
    }, [selectedPgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((g) =>
            g.name.toLowerCase().includes(q) || g.phone.includes(q) || g.aadhar?.includes(q)
        )
    }, [list, search])

    const confirmDelete = (guest) => setConfirm({ open: true, id: guest.id, name: guest.name })

    const handleDelete = async () => {
        try {
            await deleteGuest(selectedPgId, confirm.id)
            setList((prev) => prev.filter((g) => g.id !== confirm.id))
            toast.success('Tenant deleted')
        } catch {
            toast.error('Failed to delete tenant')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const selectedPG = pgs.find((pg) => String(pg.id) === selectedPgId)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Tenant Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Tenants</h1>
                </div>
                <Button onClick={() => navigate('/owner/tenants/new', { state: { selectedPgId } })} icon={Plus} variant="primary" size="md">
                    Add Tenant
                </Button>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Tenant listings</p>
                        <h2 className="text-lg font-semibold text-gray-900">All tenants</h2>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative">
                            <select
                                value={selectedPgId}
                                onChange={(e) => setSelectedPgId(e.target.value)}
                                disabled={isOwner}
                                className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">All PGs</option>
                                {pgs.map((pg) => (
                                    <option key={pg.id} value={String(pg.id)}>{pg.pgName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative text-gray-500 w-full md:w-80">
                            <Search className="absolute left-3 top-3.5" size={18} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone or Aadhaar"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading tenants...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4" />
                                            PG
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Aadhaar
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Move-in
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Documents
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Status
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Actions
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No tenants found.</p>
                                                <p className="text-xs text-gray-500">Add a tenant to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((tenant, index) => (
                                    <tr key={tenant.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{selectedPG?.pgName || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{tenant.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{tenant.phone}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{tenant.aadhar || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tenant.moveInDate?.slice(0, 10)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {tenant.photoUrl && (
                                                    <button
                                                        onClick={() => setViewingImage({ src: getAssetUrl(tenant.photoUrl), alt: `${tenant.name} Photo` })}
                                                        className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-blue-600 text-xs hover:bg-blue-100 transition"
                                                        title="View photo"
                                                    >
                                                        <Image size={12} /> Photo
                                                    </button>
                                                )}
                                                {tenant.idProofUrl && (
                                                    <button
                                                        onClick={() => setViewingImage({ src: getAssetUrl(tenant.idProofUrl), alt: `${tenant.name} ID Proof` })}
                                                        className="inline-flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-2 py-1 text-green-600 text-xs hover:bg-green-100 transition"
                                                        title="View ID proof"
                                                    >
                                                        <Image size={12} /> ID
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                tenant.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/owner/tenants/${tenant.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Tenant"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(tenant)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Tenant"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ConfirmDialog
                open={confirm.open}
                title="Delete tenant?"
                description={`Remove ${confirm.name}? This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={handleDelete}
            />

            {viewingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="relative bg-white rounded-lg max-w-2xl max-h-96">
                        <button
                            onClick={() => setViewingImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                        <img src={viewingImage.src} alt={viewingImage.alt} className="max-w-full max-h-96 rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    )
}
