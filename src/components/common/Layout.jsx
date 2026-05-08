import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../stores/authSlice'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        await dispatch(logoutUser())
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar
                    user={user}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    onLogout={handleLogout}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
