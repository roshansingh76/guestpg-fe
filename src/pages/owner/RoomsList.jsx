import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { deleteRoom, listRooms } from '../../services/roomService'

export default function RoomsList() {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, label: '' })

    useEffect(() => {
        setList(listRooms())
    }, [])

    const filteredRooms = useMemo(() => {
        return list.filter((room) => {
            const q = search.toLowerCase()
            return room.number.toLowerCase().includes(q) || room.type.toLowerCase().includes(q)
        })
    }, [list, search])

    const handleDelete = (room) => {
        setConfirm({ open: true, id: room.id, label: room.number })
    }

    const handleEdit = (id) => {
        navigate(`/owner/rooms/${id}/edit`)
    }

    const handleAdd = () => {
        navigate('/owner/rooms/new')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Room management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Rooms</h1>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Room
                </button>
            </div>

            <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search rooms"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Room</th>
                                <th className="px-4 py-4">Sharing</th>
                                <th className="px-4 py-4">Total beds</th>
                                <th className="px-4 py-4">Available</th>
                                <th className="px-4 py-4">Rent</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{room.number}</td>
                                    <td className="px-4 py-4">{room.type}</td>
                                    <td className="px-4 py-4">{room.totalBeds}</td>
                                    <td className="px-4 py-4">{room.availableBeds}</td>
                                    <td className="px-4 py-4">₹ {room.rent}</td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button onClick={() => handleEdit(room.id)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(room)} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <ConfirmDialog
                open={confirm.open}
                title="Delete room?"
                description={`This will permanently remove ${confirm.label || 'this room'} from your list.`}
                confirmText="Delete room"
                onCancel={() => setConfirm({ open: false, id: null, label: '' })}
                onConfirm={() => {
                    deleteRoom(confirm.id)
                    setList(listRooms())
                    setConfirm({ open: false, id: null, label: '' })
                    toast.success('Room deleted successfully')
                }}
            />
        </div>
    )
}
