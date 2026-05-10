import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { loginUser } from '../../stores/authSlice'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { isLoading, error, user, isAuthenticated } = useSelector((state) => state.auth)

    // Redirect already-logged-in users away from login page
    useEffect(() => {
        if (!isAuthenticated) return
        if (user?.role === 'super_admin') {
            navigate('/admin/dashboard', { replace: true })
        } else if (user?.role === 'pg_owner') {
            navigate('/owner/dashboard', { replace: true })
        }
    }, [isAuthenticated, navigate, user])

    const onSubmit = async (values) => {
        const result = await dispatch(loginUser(values))
        if (loginUser.fulfilled.match(result)) {
            toast.success('Login successful!')
            const role = result.payload.user?.role
            if (role === 'super_admin') {
                navigate('/admin/dashboard', { replace: true })
            } else {
                navigate('/owner/dashboard', { replace: true })
            }
        } else {
            toast.error(result.payload || 'Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            PG
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">PG Manager</h1>
                    <p className="text-gray-600 text-center text-sm mb-8">Login to your admin dashboard</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                    placeholder="admin@pgsystem.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50"
                        >
                            <LogIn size={20} />
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials</p>
                        <div className="text-xs text-blue-800 space-y-1">
                            <p><span className="font-medium">Super Admin:</span> admin@pgsystem.com / password</p>
                            <p><span className="font-medium">PG Owner:</span> owner@pgsystem.com / password</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
