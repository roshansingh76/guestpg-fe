import { useEffect, useMemo, useState } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { listPGs, deletePG, changePGStatus } from '../../services/pgService'

export default function AllPGs() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })
    const navigate = useNavigate()

    useEffect(() => {
        listPGs()
            .then((data) => setList(Array.isArray(data) ? data : data.pgs || []))
            .catch(() => toast.error('Failed to load PGs'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return list.filter((pg) => pg.pgName?.toLowerCase().includes(q) || pg.ownerName?.toLowerCase().includes(q) || pg.city?.toLowerCase().includes(q))
    }, [list, query])

    const handleDelete = async () => {
        try {
            await deletePG(confirm.id)
            setList((prev) => prev.filter((p) => p.id !== confirm.id))
            toast.success('PG removed')
        } catch {
            toast.error('Failed to delete PG')
        } finally {
            setConfirm({ open: false, id: null, name: '' })
        }
    }

    const toggleStatus = async (pg) => {
        const next = pg.status === 'active' ? 'inactive' : 'active'
        try {
            await changePGStatus(pg.id, next)
            setList((prev) => prev.map((p) => p.id === pg.id ? { ...p, status: next } : p))
            toast.success(`PG ${next}`)
        } catch {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Property management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">All PGs</h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative text-gray-500 w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PGs"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <Button onClick={() => navigate('/admin/pgs/new')} icon={Plus} variant="primary" size="md">
                        Add PG
                    </Button>
                </div>
            </div>

            <Card>
                {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">PG name</th>
                                    <th className="px-4 py-4">Owner</th>
                                    <th className="px-4 py-4">City</th>
                                    <th className="px-4 py-4">Type</th>
                                    <th className="px-4 py-4">Rooms</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No PGs found</td></tr>
                                )}
                                {filtered.map((pg) => (
                                    <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{pg.pgName}</td>
                                        <td className="px-4 py-4">{pg.ownerName}</td>
                                        <td className="px-4 py-4">{pg.city}</td>
                                        <td className="px-4 py-4">{pg.pgType}</td>
                                        <td className="px-4 py-4">{pg.numberOfRooms}</td>
                                        <td className="px-4 py-4">
                                            <button onClick={() => toggleStatus(pg)}
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {pg.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                            <Button onClick={() => navigate(`/admin/pgs/${pg.id}/edit`)} icon={Pencil} variant="outline" size="sm">
                                                Edit
                                            </Button>
                                            <Button onClick={() => setConfirm({ open: true, id: pg.id, name: pg.pgName })} icon={Trash2} variant="danger" size="sm">
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ConfirmDialog open={confirm.open} title="Delete PG?" description={`Remove ${confirm.name}? All data will be lost.`}
                confirmText="Delete PG" onCancel={() => setConfirm({ open: false, id: null, name: '' })} onConfirm={handleDelete} />
        </div>
    )
}
