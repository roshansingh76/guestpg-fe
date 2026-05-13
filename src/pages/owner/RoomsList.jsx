import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search, Pencil, Trash2, Plus, Building, Hash, Fan, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listRooms, deleteRoom, listPGs } from '../../services/pgService'

export default function RoomsList() {
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)
    const isOwner = user?.role === 'pg_owner' || user?.role === 'pg_staff'
    const [pgs, setPgs] = useState([])
    const [selectedPgId, setSelectedPgId] = useState(user?.pgId ? String(user.pgId) : '')
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, label: '' })

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
        listRooms(selectedPgId)
            .then(setList)
            .catch(() => toast.error('Failed to load rooms'))
            .finally(() => setLoading(false))
    }, [selectedPgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((r) => r.roomNumber?.toLowerCase().includes(q) || r.roomType?.toLowerCase().includes(q))
    }, [list, search])

    const handleDelete = async () => {
        try {
            await deleteRoom(selectedPgId, confirm.id)
            setList((prev) => prev.filter((r) => r.id !== confirm.id))
            toast.success('Room deleted')
        } catch {
            toast.error('Failed to delete room')
        } finally {
            setConfirm({ open: false, id: null, label: '' })
        }
    }

    const selectedPG = pgs.find((pg) => String(pg.id) === selectedPgId)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Room Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Rooms</h1>
                </div>
                <Button onClick={() => navigate('/owner/rooms/new')} icon={Plus} variant="primary" size="md">
                    Add Room
                </Button>
            </div>

            <Card>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Room listings</p>
                        <h2 className="text-lg font-semibold text-gray-900">All rooms</h2>
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
                                placeholder="Search by room no or type"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading rooms...</p>
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
                                            <Hash className="w-4 h-4" />
                                            Room No
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Type
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Fan className="w-4 h-4" />
                                            AC
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4" />
                                            Total Beds
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Available
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Fan className="w-4 h-4" />
                                            Rent/Bed
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
                                                <p>No rooms found.</p>
                                                <p className="text-xs text-gray-500">Create a room to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((room, index) => (
                                    <tr key={room.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{selectedPG?.pgName || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{room.roomNumber}</td>
                                        <td className="px-6 py-4 text-gray-600">{room.roomType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${room.acType === 'AC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                <Fan className="w-3 h-3 mr-1" />
                                                {room.acType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{room.totalBeds}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${room.availableBeds > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {room.availableBeds}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{room.pricePerBed}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/owner/rooms/${room.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Room"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirm({ open: true, id: room.id, label: room.roomNumber })}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Room"
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
                title="Delete room?"
                description={`Remove room ${confirm.label}? This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, id: null, label: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
