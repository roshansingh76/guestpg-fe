import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Pencil, Trash2, Plus, Hash, CheckCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listBedsByPG, deleteBed, listRooms } from '../../services/pgService'

export default function BedsList() {
    const navigate = useNavigate()
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [confirm, setConfirm] = useState({ open: false, roomId: null, bedId: null, label: '' })

    useEffect(() => {
        if (!pgId) return
        listBedsByPG(pgId)
            .then(setList)
            .catch(() => toast.error('Failed to load beds'))
            .finally(() => setLoading(false))
    }, [pgId])

    const handleDelete = async () => {
        try {
            await deleteBed(pgId, confirm.roomId, confirm.bedId)
            setList((prev) => prev.filter((b) => b.id !== confirm.bedId))
            toast.success('Bed deleted')
        } catch {
            toast.error('Failed to delete bed')
        } finally {
            setConfirm({ open: false, roomId: null, bedId: null, label: '' })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bed Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Beds</h1>
                </div>
                <Button onClick={() => navigate('/owner/beds/new')} icon={Plus} variant="primary" size="md">
                    Add Bed
                </Button>
            </div>

            <Card>
                <div className="mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bed listings</p>
                    <h2 className="text-lg font-semibold text-gray-900">All beds</h2>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading beds...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4" />
                                            Bed Number
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4" />
                                            Room
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
                                {list.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No beds found.</p>
                                                <p className="text-xs text-gray-500">Create a bed to get started.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {list.map((bed, index) => (
                                    <tr key={bed.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{bed.bedNumber}</td>
                                        <td className="px-6 py-4 text-gray-600">{bed.room?.roomNumber || bed.roomId}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                bed.status === 'occupied'
                                                    ? 'bg-red-100 text-red-800'
                                                    : bed.status === 'reserved'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                            }`}>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {bed.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/owner/beds/${bed.id}/edit`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Edit Bed"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirm({ open: true, roomId: bed.roomId, bedId: bed.id, label: bed.bedNumber })}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Bed"
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
                title="Delete bed?"
                description={`Remove bed ${confirm.label}? This cannot be undone.`}
                confirmText="Delete"
                onCancel={() => setConfirm({ open: false, roomId: null, bedId: null, label: '' })}
                onConfirm={handleDelete}
            />
        </div>
    )
}
