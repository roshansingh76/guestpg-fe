import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { ArrowLeft } from 'lucide-react'
import { createState, getStateById, updateState } from '../../services/stateService'

export default function StateEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(Boolean(id))
    const [saving, setSaving] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            isActive: true,
        },
    })

    useEffect(() => {
        if (!id) return setLoading(false)
        getStateById(id)
            .then((state) => {
                reset({
                    name: state.name || '',
                    isActive: !!state.isActive,
                })
            })
            .catch(() => toast.error('Failed to load state'))
            .finally(() => setLoading(false))
    }, [id, reset])

    const onSubmit = async (values) => {
        setSaving(true)
        try {
            const payload = { name: values.name, isActive: values.isActive ? 1 : 0 }
            if (id) {
                await updateState(id, payload)
                toast.success('State updated successfully')
            } else {
                await createState(payload)
                toast.success('State created successfully')
            }
            navigate('/admin/states')
        } catch (err) {
            toast.error(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save state')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="p-8 text-gray-500">Loading...</p>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Master data</p>
                    <h1 className="text-3xl font-semibold text-gray-900">{id ? 'Edit State' : 'Add State'}</h1>
                </div>
                <Button to="/admin/states" variant="secondary" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={18} /> Back to states
                </Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State name</label>
                        <input
                            {...register('name', { required: 'State name is required' })}
                            className={`w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-300'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                }`}
                            placeholder="Enter state name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    {id && (
                        <div>
                            <label className="flex items-center gap-3 mt-8 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    )}

                    <div className="md:col-span-2 flex gap-4">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Saving...' : id ? 'Save State' : 'Create State'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => navigate('/admin/states')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
