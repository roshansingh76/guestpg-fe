import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
    open,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    tone = 'danger',
    onConfirm,
    onCancel,
}) {
    if (!open) return null

    const confirmClasses =
        tone === 'danger'
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-2xl bg-red-50 p-3 text-red-700">
                        <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-700 font-semibold hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-2xl px-5 py-3 text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClasses}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

