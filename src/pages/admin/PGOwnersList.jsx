import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { pgOwners } from '../../data/mockData'

export default function PGOwnersList() {
    const navigate = useNavigate()
    const [owners, setOwners] = useState(pgOwners)
    const [query, setQuery] = useState('')
    const filteredOwners = useMemo(() => {
        return owners.filter((owner) => {
            const lower = query.toLowerCase()
            return owner.name.toLowerCase().includes(lower) || owner.email.toLowerCase().includes(lower) || owner.phone.includes(lower)
        })
    }, [owners, query])

    const handleDelete = (id) => {
        setOwners((prev) => prev.filter((owner) => owner.id !== id))
        toast.success('Owner deleted successfully')
    }

    const handleAdd = () => {
        toast.success('Add owner action opened')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">PG Owner Management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">PG Owners</h1>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
                    <div className="relative text-gray-500">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search owners"
                            className="pl-10 pr-4 py-3 border border-gray-200 rounded-2xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="button" onClick={handleAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                        <Plus size={18} /> Add Owner
                    </button>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Owner</th>
                                <th className="px-4 py-4">Email</th>
                                <th className="px-4 py-4">Phone</th>
                                <th className="px-4 py-4">Properties</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOwners.map((owner) => (
                                <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-900">{owner.name}</p>
                                    </td>
                                    <td className="px-4 py-4">{owner.email}</td>
                                    <td className="px-4 py-4">{owner.phone}</td>
                                    <td className="px-4 py-4">{owner.properties}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${owner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {owner.status}</span>
                                    </td>
                                    <td className="px-4 py-4 space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/pg-owners/${owner.id}/edit`)}
                                            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(owner.id)}
                                            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
