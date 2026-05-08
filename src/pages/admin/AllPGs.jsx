import { useMemo, useState } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { pgs } from '../../data/mockData'

export default function AllPGs() {
    const [list, setList] = useState(pgs)
    const [query, setQuery] = useState('')

    const filteredItems = useMemo(() => {
        return list.filter((pg) => {
            const q = query.toLowerCase()
            return pg.name.toLowerCase().includes(q) || pg.owner.toLowerCase().includes(q) || pg.city.toLowerCase().includes(q)
        })
    }, [list, query])

    const handleDelete = (id) => {
        setList((prev) => prev.filter((item) => item.id !== id))
        toast.success('PG removed successfully')
    }

    const handleAdd = () => {
        toast.success('Add PG action opened')
    }

    const handleEdit = (name) => {
        toast.success(`Edit ${name} opened`)
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
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search PGs"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                        <Plus size={18} /> Add PG
                    </button>
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">PG name</th>
                                <th className="px-4 py-4">Owner</th>
                                <th className="px-4 py-4">City</th>
                                <th className="px-4 py-4">Rooms</th>
                                <th className="px-4 py-4">Beds</th>
                                <th className="px-4 py-4">Occupancy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map((pg) => (
                                <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{pg.name}</td>
                                    <td className="px-4 py-4">{pg.owner}</td>
                                    <td className="px-4 py-4">{pg.city}</td>
                                    <td className="px-4 py-4">{pg.rooms}</td>
                                    <td className="px-4 py-4">{pg.beds}</td>
                                    <td className="px-4 py-4">{pg.occupied}%</td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(pg.name)}
                                            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pg.id)}
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
