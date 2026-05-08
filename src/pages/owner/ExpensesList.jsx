import { useMemo, useState } from 'react'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import { expenses } from '../../data/mockData'

export default function ExpensesList() {
    const [list, setList] = useState(expenses)
    const [search, setSearch] = useState('')
    const filteredExpenses = useMemo(() => {
        return list.filter((item) => {
            const q = search.toLowerCase()
            return item.category.toLowerCase().includes(q) || item.notes.toLowerCase().includes(q)
        })
    }, [list, search])

    const handleDelete = (id) => {
        setList((prev) => prev.filter((item) => item.id !== id))
        toast.success('Expense removed successfully')
    }

    const handleEdit = (category) => {
        toast.success(`Edit ${category} expense opened`)
    }

    const handleAdd = () => {
        toast.success('Add expense action opened')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Expense management</p>
                    <h1 className="text-3xl font-semibold text-gray-900">Expenses</h1>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative text-gray-500 w-full md:w-80">
                        <Search className="absolute left-3 top-3.5" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search expenses"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-4">Category</th>
                                <th className="px-4 py-4">Amount</th>
                                <th className="px-4 py-4">Date</th>
                                <th className="px-4 py-4">Notes</th>
                                <th className="px-4 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-medium text-gray-900">{expense.category}</td>
                                    <td className="px-4 py-4">₹ {expense.amount}</td>
                                    <td className="px-4 py-4">{expense.date}</td>
                                    <td className="px-4 py-4">{expense.notes}</td>
                                    <td className="px-4 py-4 flex flex-wrap items-center gap-2">
                                        <button onClick={() => handleEdit(expense.category)} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 text-sm hover:bg-blue-100">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(expense.id)} className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-red-700 text-sm hover:bg-red-100">
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
