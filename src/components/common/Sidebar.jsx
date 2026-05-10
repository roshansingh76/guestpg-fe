import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { X, BarChart3, Users, Home, Settings, DollarSign, Zap } from 'lucide-react'

export default function Sidebar({ open, onClose }) {
    const { user } = useSelector((state) => state.auth)
    const location = useLocation()

    const isSuperAdmin = user?.role === 'super_admin'

    const adminMenu = [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'PG Owners', path: '/admin/pg-owners' },
        { icon: Settings, label: 'PGs', path: '/admin/pgs' },
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    ]

    const ownerMenu = [
        { icon: Home, label: 'Dashboard', path: '/owner/dashboard' },
        { icon: Users, label: 'Guests', path: '/owner/guests' },
        { icon: Settings, label: 'Rooms', path: '/owner/rooms' },
        { icon: Settings, label: 'Beds', path: '/owner/beds' },
        { icon: Settings, label: 'Allocations', path: '/owner/allocations' },
        { icon: DollarSign, label: 'Payments', path: '/owner/payments' },
        { icon: Zap, label: 'Expenses', path: '/owner/expenses' },
        { icon: BarChart3, label: 'Reports', path: '/owner/reports' },
    ]

    const menu = isSuperAdmin ? adminMenu : ownerMenu

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-72 bg-slate-950/90 text-slate-100 backdrop-blur-xl border-r border-white/10 shadow-[0_10px_50px_rgba(2,6,23,0.35)] transform transition-transform duration-300 z-50 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:static`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-[0_10px_20px_rgba(59,130,246,0.25)]">
                            PG
                        </div>
                        <div>
                            <h1 className="font-bold text-white leading-5">PG Manager</h1>
                            <p className="text-xs text-slate-300/80">Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-slate-300 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                    {menu.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition ${location.pathname === item.path
                                    ? 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)]'
                                    : 'text-slate-200/90 hover:bg-white/5 hover:border-white/10'
                                } border border-transparent`}
                            onClick={onClose}
                        >
                            {location.pathname === item.path && (
                                <span className="absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/80" />
                            )}
                            <item.icon size={20} className={`${location.pathname === item.path ? 'text-white' : 'text-slate-300/80 group-hover:text-white'}`} />
                            <span className={`font-semibold ${location.pathname === item.path ? 'text-white' : 'text-slate-100'}`}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-300/80 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
