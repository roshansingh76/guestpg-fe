import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async ({ email }) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success('Check your email for password reset link')
            navigate('/login')
        }, 1200)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <Link to="/login" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8">
                        <ArrowLeft size={20} /> Back to Login
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600 text-sm mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                                    placeholder="your@email.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
