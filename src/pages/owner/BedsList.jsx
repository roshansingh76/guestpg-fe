import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { deleteBed, listBeds } from '../../services/bedService'

export default function BedsList() {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [confirm, setConfirm] = useState({ open: false, id: null, label: '' })

    useEffect(() => {
        setList(listBeds())
    }, [])

    const handleDelete = (bed) => {
        setConfirm({ open: true, id: bed.id, label: bed.number })
    }

    const handleEdit = (id) => {
        navigate(`/owner/beds/${id}/edit`)
    }

    const handleAdd = () => {
        navigate('/owner/beds/new')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bed management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Beds</h1>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Bed
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Bed</th>
                                <th className="px-4 py-4">Room</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((bed) => (
                                <tr key={bed.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{bed.number}</td>
                                    <td className="px-4 py-4">{bed.room}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bed.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {bed.status}</span>
                                    </td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button onClick={() => handleEdit(bed.id)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(bed)} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
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
                title="Delete bed?"
                description={`This will permanently remove ${confirm.label || 'this bed'} from your list.`}
                confirmText="Delete bed"
                onCancel={() => setConfirm({ open: false, id: null, label: '' })}
                onConfirm={() => {
                    deleteBed(confirm.id)
                    setList(listBeds())
                    setConfirm({ open: false, id: null, label: '' })
                    toast.success('Bed deleted successfully')
                }}
            />
        </div>
    )
}
