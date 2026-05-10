import { useState } from 'react'
import { Menu, LogOut, ChevronDown } from 'lucide-react'

export default function Navbar({ user, onMenuClick, onLogout }) {
    const [profileOpen, setProfileOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-40">
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between px-4 md:px-8 py-4">
                {/* Left Side - Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-600 hover:text-slate-900"
                >
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Welcome</p>
                        <p className="text-sm font-semibold text-slate-900 leading-4">{user?.role === 'super_admin' ? 'Admin Console' : 'Owner Dashboard'}</p>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Right Side - Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/70 border border-transparent hover:border-white/60 transition"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold shadow-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="font-semibold text-sm text-slate-900 leading-4">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-2 z-50">
                            <button
                                onClick={() => {
                                    onLogout()
                                    setProfileOpen(false)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </nav>
    )
}
