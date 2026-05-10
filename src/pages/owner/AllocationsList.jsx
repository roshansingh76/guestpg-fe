import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
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
            <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Bed allocation</p>
                <h1 className="text-3xl font-semibold text-gray-900">Allocations</h1>
            </div>

            <Card>
                {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Guest</th>
                                    <th className="px-4 py-4">Room</th>
                                    <th className="px-4 py-4">Bed</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Move-in date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allocations.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No active allocations</td></tr>
                                )}
                                {allocations.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.guest}</td>
                                        <td className="px-4 py-4">{item.room}</td>
                                        <td className="px-4 py-4">{item.bed}</td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{item.status}</span>
                                        </td>
                                        <td className="px-4 py-4">{item.moveInDate}</td>
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
