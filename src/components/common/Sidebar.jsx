import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import {
    X,
    ChevronDown,
    BarChart3,
    Users,
    Home,
    Settings,
    DollarSign,
    Zap,
    MapPin,
    Building2,
    UserCog,
    BedDouble,
    ClipboardList,
    Wallet,
    Receipt,
    ShieldCheck,
} from 'lucide-react'

export default function Sidebar({ open, onClose }) {
    const { user } = useSelector((state) => state.auth)
    const location = useLocation()

    const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'staff'

    const adminMenu = [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        {
            icon: UserCog,
            label: 'Users & Roles',
            children: [
                { icon: Users, label: 'PG Owners', path: '/admin/pg-owners' },
                { icon: UserCog, label: 'Staff / Sub Admins', path: '/admin/staff' },
                ...(user?.role === 'super_admin'
                    ? [{ icon: ShieldCheck, label: 'Roles', path: '/admin/roles' }]
                    : []),
            ],
        },
        {
            icon: Building2,
            label: 'PG Management',
            children: [
                { icon: Building2, label: 'All PGs', path: '/admin/pgs' },
                { icon: Users, label: 'Tenants', path: '/owner/tenants' },
                { icon: BedDouble, label: 'Rooms', path: '/owner/rooms' },
                { icon: Receipt, label: 'Bills', path: '/owner/bills' },
                { icon: Zap, label: 'Expenses', path: '/owner/expenses' },
            ],
        },
        {
            icon: Settings,
            label: 'Masters',
            children: [
                { icon: MapPin, label: 'States', path: '/admin/states' },
                { icon: MapPin, label: 'Cities', path: '/admin/cities' },
                { icon: MapPin, label: 'Areas', path: '/admin/areas' },
            ],
        },
        {
            icon: BarChart3,
            label: 'Reports',
            children: [
                { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
            ],
        },
    ]

    const ownerMenu = [
        { icon: Home, label: 'Dashboard', path: '/owner/dashboard' },
        {
            icon: UserCog,
            label: 'Users',
            children: [
                { icon: Users, label: 'Users', path: '/owner/users' },
            ],
        },
        {
            icon: Building2,
            label: 'PG Management',
            children: [
                { icon: Building2, label: 'My PGs', path: '/owner/pgs' },
                { icon: Users, label: 'Tenants', path: '/owner/tenants' },
                { icon: BedDouble, label: 'Rooms', path: '/owner/rooms' },
                { icon: BedDouble, label: 'Beds', path: '/owner/beds' },
                { icon: ClipboardList, label: 'Allocations', path: '/owner/allocations' },
                { icon: Wallet, label: 'Payments', path: '/owner/payments' },
                { icon: Receipt, label: 'Bills', path: '/owner/bills' },
                { icon: Zap, label: 'Expenses', path: '/owner/expenses' },
            ],
        },
        {
            icon: BarChart3,
            label: 'Reports',
            children: [
                { icon: BarChart3, label: 'Reports', path: '/owner/reports' },
            ],
        },
    ]

    const menu = isSuperAdmin ? adminMenu : ownerMenu

    const findActiveGroup = () =>
        menu.find((item) => item.children?.some((child) => child.path === location.pathname))?.label ?? null

    const [openMenu, setOpenMenu] = useState(findActiveGroup)

    // Keep the group containing the active route open, and every other group collapsed.
    useEffect(() => {
        const activeGroup = findActiveGroup()
        if (activeGroup) setOpenMenu(activeGroup)
    }, [location.pathname])

    const toggleGroup = (label) => {
        setOpenMenu((prev) => (prev === label ? null : label))
    }

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
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
                    {menu.map((item) => {
                        if (!item.children) {
                            const active = location.pathname === item.path
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition ${active
                                            ? 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)]'
                                            : 'text-slate-200/90 hover:bg-white/5 hover:border-white/10'
                                        } border border-transparent`}
                                    onClick={onClose}
                                >
                                    {active && (
                                        <span className="absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/80" />
                                    )}
                                    <item.icon size={20} className={`${active ? 'text-white' : 'text-slate-300/80 group-hover:text-white'}`} />
                                    <span className={`font-semibold ${active ? 'text-white' : 'text-slate-100'}`}>{item.label}</span>
                                </NavLink>
                            )
                        }

                        const isOpen = openMenu === item.label
                        const groupHasActiveChild = item.children.some((child) => child.path === location.pathname)

                        return (
                            <div key={item.label}>
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(item.label)}
                                    className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition border border-transparent ${groupHasActiveChild
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-200/90 hover:bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <item.icon size={20} className={`${groupHasActiveChild ? 'text-white' : 'text-slate-300/80 group-hover:text-white'}`} />
                                    <span className={`font-semibold flex-1 text-left ${groupHasActiveChild ? 'text-white' : 'text-slate-100'}`}>{item.label}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 mt-1' : 'max-h-0'}`}
                                >
                                    <div className="space-y-1 pb-1">
                                        {item.children.map((child) => {
                                            const active = location.pathname === child.path
                                            return (
                                                <NavLink
                                                    key={child.path}
                                                    to={child.path}
                                                    className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl transition ${active
                                                            ? 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)]'
                                                            : 'text-slate-200/90 hover:bg-white/5 hover:border-white/10'
                                                        } border border-transparent ml-3`}
                                                    onClick={() => {
                                                        setOpenMenu(item.label)
                                                        onClose()
                                                    }}
                                                >
                                                    {active && (
                                                        <span className="absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white/80" />
                                                    )}
                                                    <child.icon size={18} className={`${active ? 'text-white' : 'text-slate-300/80 group-hover:text-white'}`} />
                                                    <span className={`font-semibold ${active ? 'text-white' : 'text-slate-100'}`}>{child.label}</span>
                                                </NavLink>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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
