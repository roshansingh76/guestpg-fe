import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listRooms, deleteRoom } from '../../services/pgService'

export default function RoomsList() {
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, label: '' })

    useEffect(() => {
        if (!pgId) return
        listRooms(pgId)
            .then(setList)
            .catch(() => toast.error('Failed to load rooms'))
            .finally(() => setLoading(false))
    }, [pgId])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return list.filter((r) => r.roomNumber?.toLowerCase().includes(q) || r.roomType?.toLowerCase().includes(q))
    }, [list, search])

    const handleDelete = async () => {
        try {
            await deleteRoom(pgId, confirm.id)
            setList((prev) => prev.filter((r) => r.id !== confirm.id))
            toast.success('Room deleted')
        } catch {
            toast.error('Failed to delete room')
        } finally {
            setConfirm({ open: false, id: null, label: '' })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Room management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Rooms</h1>
                </div>
                <button onClick={() => navigate('/owner/rooms/new')} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Room
                </button>
            </div>

            <Card>
                <div className="mb-6">
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rooms"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Room</th>
                                    <th className="px-4 py-4">Type</th>
                                    <th className="px-4 py-4">AC</th>
                                    <th className="px-4 py-4">Total beds</th>
                                    <th className="px-4 py-4">Available</th>
                                    <th className="px-4 py-4">Rent/bed</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No rooms found</td></tr>
                                )}
                                {filtered.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{room.roomNumber}</td>
                                        <td className="px-4 py-4">{room.roomType}</td>
                                        <td className="px-4 py-4">{room.acType}</td>
                                        <td className="px-4 py-4">{room.totalBeds}</td>
                                        <td className="px-4 py-4">{room.availableBeds}</td>
                                        <td className="px-4 py-4">₹ {room.pricePerBed}</td>
                                        <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                            <button onClick={() => navigate(`/owner/rooms/${room.id}/edit`)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button onClick={() => setConfirm({ open: true, id: room.id, label: room.roomNumber })} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ConfirmDialog open={confirm.open} title="Delete room?" description={`Remove room ${confirm.label}?`}
                confirmText="Delete room" onCancel={() => setConfirm({ open: false, id: null, label: '' })} onConfirm={handleDelete} />
        </div>
    )
}
