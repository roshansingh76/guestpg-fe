import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { allocations } from '../../data/mockData'

export default function AllocationsList() {
    const [list, setList] = useState(allocations)

    const handleDelete = (id) => {
        setList((prev) => prev.filter((item) => item.id !== id))
        toast.success('Allocation removed successfully')
    }

    const handleEdit = (guest) => {
        toast.success(`Edit allocation for ${guest} opened`)
    }

    const handleAdd = () => {
        toast.success('Assign bed action opened')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Bed allocation</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Allocations</h1>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Assign Bed
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Guest</th>
                                <th className="px-4 py-4">Room</th>
                                <th className="px-4 py-4">Bed</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-4 py-4">Allocated on</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {list.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{item.guest}</td>
                                    <td className="px-4 py-4">{item.room}</td>
                                    <td className="px-4 py-4">{item.bed}</td>
                                    <td className="px-4 py-4"><span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{item.status}</span></td>
                                    <td className="px-4 py-4">{item.allocatedOn}</td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button onClick={() => handleEdit(item.guest)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
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
