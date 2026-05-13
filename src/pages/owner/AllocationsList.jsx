import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { User, Hash, Calendar, CheckCircle } from 'lucide-react'
import Card from '../../components/common/Card'
import { listGuests } from '../../services/guestService'
import { listBedsByPG } from '../../services/pgService'

export default function AllocationsList() {
    const pgId = useSelector((s) => s.auth.user?.pgId)
    const [guests, setGuests] = useState([])
    const [beds, setBeds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!pgId) return
        Promise.all([listGuests(pgId), listBedsByPG(pgId)])
            .then(([g, b]) => { setGuests(g); setBeds(b) })
            .catch(() => toast.error('Failed to load allocations'))
            .finally(() => setLoading(false))
    }, [pgId])

    // Build allocation view: active guests with a bedId
    const allocations = guests
        .filter((g) => g.status === 'active' && g.bedId)
        .map((g) => {
            const bed = beds.find((b) => b.id === g.bedId)
            return {
                id: g.id,
                guest: g.name,
                bed: bed?.bedNumber || g.bedId,
                room: bed?.room?.roomNumber || '—',
                moveInDate: g.moveInDate?.slice(0, 10),
                status: g.status,
            }
        })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bed Allocation</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Allocations</h1>
                </div>
            </div>

            <Card>
                <div className="mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Active allocations</p>
                    <h2 className="text-lg font-semibold text-gray-900">Bed assignments</h2>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading allocations...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wider text-blue-700 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Guest
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
                                            <Hash className="w-4 h-4" />
                                            Bed
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Move-in Date
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Status
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allocations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            <div className="space-y-1">
                                                <p>No active allocations.</p>
                                                <p className="text-xs text-gray-500">Allocations will appear when guests are assigned to beds.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {allocations.map((item, index) => (
                                    <tr key={item.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{item.guest}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.room}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.bed}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.moveInDate}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-xs font-medium text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
