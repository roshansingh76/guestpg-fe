import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { getAllStates } from '../../services/stateService'

export default function StateList() {
    const navigate = useNavigate()
    const [states, setStates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllStates()
            .then((data) => setStates(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load states'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Master data</p>
                    <h1 className="text-3xl font-semibold text-gray-900">States</h1>
                    <p className="mt-2 text-gray-600">Manage state master data that cities are mapped to.</p>
                </div>
                <Button onClick={() => navigate('/admin/states/new')} icon={Plus} variant="primary">
                    Add State
                </Button>
            </div>

            <Card>
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading states...</p>
                ) : states.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No states available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-4">State</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Cities</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {states.map((state) => (
                                    <tr key={state.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900">{state.name}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${state.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {state.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">{state.cities?.length ?? 0}</td>
                                        <td className="px-4 py-4">
                                            <Button onClick={() => navigate(`/admin/states/${state.id}/edit`)} icon={Pencil} variant="outline" size="sm">
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
