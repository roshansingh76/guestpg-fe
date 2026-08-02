import { useEffect, useMemo, useState } from 'react'
import { Eye, Search, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { listPGs } from '../../services/pgService'

export default function OwnerPGsList() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        listPGs()
            .then((data) => setList(Array.isArray(data) ? data : data.pgs || []))
            .catch(() => toast.error('Failed to load PGs'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return list.filter((pg) => {
            const cityName = pg.city?.name || pg.city || ''
            return (
                pg.pgName?.toLowerCase().includes(q) ||
                pg.ownerName?.toLowerCase().includes(q) ||
                cityName.toLowerCase().includes(q)
            )
        })
    }, [list, query])

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row md:items-center">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">My properties</p>
                    <h1 className="text-3xl font-semibold text-gray-900">My PGs</h1>
                </div>
                <div className="relative text-gray-500 w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search PGs"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <Card>
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">PG name</th>
                                    <th className="px-4 py-4">City</th>
                                    <th className="px-4 py-4">Type</th>
                                    <th className="px-4 py-4">Rooms</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <Building2 className="mx-auto mb-3 text-gray-300" size={40} />
                                            <p className="text-gray-400">No PGs found</p>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((pg) => (
                                    <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{pg.pgName}</td>
                                        <td className="px-4 py-4">{pg.city?.name || pg.city || 'N/A'}</td>
                                        <td className="px-4 py-4">{pg.pgType}</td>
                                        <td className="px-4 py-4">{pg.numberOfRooms}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    pg.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {pg.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Button
                                                onClick={() => navigate(`/owner/pgs/${pg.id}`)}
                                                icon={Eye}
                                                variant="outline"
                                                size="sm"
                                            >
                                                View
                                            </Button>
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
