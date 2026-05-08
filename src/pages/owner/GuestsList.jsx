import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { deleteGuest, listGuests } from '../../services/guestService'

export default function GuestsList() {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [search, setSearch] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })

    useEffect(() => {
        setList(listGuests())
    }, [])

    const filteredGuests = useMemo(() => {
        return list.filter((guest) => {
            const q = search.toLowerCase()
            return (
                guest.name.toLowerCase().includes(q) ||
                guest.phone.includes(q) ||
                guest.aadhar.includes(q)
            )
        })
    }, [list, search])

    const handleDelete = (guest) => {
        setConfirm({ open: true, id: guest.id, name: guest.name })
    }

    const handleEdit = (id) => {
        navigate(`/owner/guests/${id}/edit`)
    }

    const handleAdd = () => {
        navigate('/owner/guests/new')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Guest management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Guests</h1>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Guest
                </button>
            </div>

            <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by name, phone or Aadhaar"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Guest</th>
                                <th className="px-4 py-4">Phone</th>
                                <th className="px-4 py-4">Aadhaar</th>
                                <th className="px-4 py-4">Joined</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{guest.name}</td>
                                    <td className="px-4 py-4">{guest.phone}</td>
                                    <td className="px-4 py-4">{guest.aadhar}</td>
                                    <td className="px-4 py-4">{guest.joiningDate}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${guest.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {guest.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button onClick={() => handleEdit(guest.id)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(guest)} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
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
                title="Delete guest?"
                description={`This will permanently remove ${confirm.name || 'this guest'} from your list.`}
                confirmText="Delete guest"
                onCancel={() => setConfirm({ open: false, id: null, name: '' })}
                onConfirm={() => {
                    deleteGuest(confirm.id)
                    setList(listGuests())
                    setConfirm({ open: false, id: null, name: '' })
                    toast.success('Guest deleted successfully')
                }}
            />
        </div>
    )
}
