import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, role }) {
    const { user, isAuthenticated } = useSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (role && user?.role !== role) {
        return <Navigate to="/login" replace />
    }

    return children
}
