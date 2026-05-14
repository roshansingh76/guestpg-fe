import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { getAllAreas } from '../../services/areaService'

export default function AreaList() {
    const [areas, setAreas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllAreas()
            .then((data) => setAreas(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load areas'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Master data</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Areas</h1>
                    <p className="mt-2 text-gray-600">View all configured areas and their parent cities.</p>
                </div>
                <Button onClick={() => navigate('/admin/areas/new')} icon={Plus} variant="primary">
                    Add Area
                </Button>
            </div>

            <Card>
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading areas...</p>
                ) : areas.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No areas available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">Area</th>
                                    <th className="px-4 py-4">City</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Created</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {areas.map((area) => (
                                    <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{area.name}</td>
                                        <td className="px-4 py-4">{area.city?.name || '—'}</td>
                                        <td className="px-4 py-4">{area.status}</td>
                                        <td className="px-4 py-4">{new Date(area.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">
                                            <Button onClick={() => navigate(`/admin/areas/${area.id}/edit`)} icon={Pencil} variant="outline" size="sm">
                                                Edit
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
