import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './stores/store'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/common/Layout'

// Auth Pages
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Admin Dashboard
import Dashboard from './pages/admin/Dashboard'
import PGOwnersList from './pages/admin/PGOwnersList'
import PGOwnerEdit from './pages/admin/PGOwnerEdit'
import PGEdit from './pages/admin/PGEdit'
import PGOwnerCreate from './pages/admin/PGOwnerCreate'
import AllPGs from './pages/admin/AllPGs'
import Reports from './pages/admin/Reports'

// PG Owner Dashboard
import OwnerDashboard from './pages/owner/Dashboard'
import GuestsList from './pages/owner/GuestsList'
import GuestEdit from './pages/owner/GuestEdit'
import GuestCreate from './pages/owner/GuestCreate'
import RoomsList from './pages/owner/RoomsList'
import RoomCreate from './pages/owner/RoomCreate'
import RoomEdit from './pages/owner/RoomEdit'
import BedsList from './pages/owner/BedsList'
import BedCreate from './pages/owner/BedCreate'
import BedEdit from './pages/owner/BedEdit'
import AllocationsList from './pages/owner/AllocationsList'
import PaymentsList from './pages/owner/PaymentsList'
import ExpensesList from './pages/owner/ExpensesList'
import BillsList from './pages/owner/BillsList'
import BillsCreate from './pages/owner/BillsCreate'
import BillDetails from './pages/owner/BillDetails'
import OwnerReports from './pages/owner/Reports'

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Super Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute role={['super_admin', 'admin']}>
                                <Layout>
                                    <Routes>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="pg-owners" element={<PGOwnersList />} />
                                        <Route path="pg-owners/new" element={<PGOwnerCreate />} />
                                        <Route path="pg-owners/:id/edit" element={<PGOwnerEdit />} />
                                        <Route path="pgs/new" element={<PGEdit />} />
                                        <Route path="pgs/:id/edit" element={<PGEdit />} />
                                        <Route path="pgs" element={<AllPGs />} />
                                        <Route path="reports" element={<Reports />} />
                                        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* PG Owner Routes */}
                    <Route
                        path="/owner/*"
                        element={
                            <ProtectedRoute role={['pg_owner', 'super_admin']}>
                                <Layout>
                                    <Routes>
                                        <Route path="dashboard" element={<OwnerDashboard />} />
                                        <Route path="guests" element={<GuestsList />} />
                                        <Route path="guests/new" element={<GuestCreate />} />
                                        <Route path="guests/:id/edit" element={<GuestEdit />} />
                                        <Route path="tenants" element={<GuestsList />} />
                                        <Route path="tenants/new" element={<GuestCreate />} />
                                        <Route path="tenants/:id/edit" element={<GuestEdit />} />
                                        <Route path="rooms" element={<RoomsList />} />
                                        <Route path="rooms/new" element={<RoomCreate />} />
                                        <Route path="rooms/:id/edit" element={<RoomEdit />} />
                                        <Route path="beds" element={<BedsList />} />
                                        <Route path="beds/new" element={<BedCreate />} />
                                        <Route path="beds/:id/edit" element={<BedEdit />} />
                                        <Route path="allocations" element={<AllocationsList />} />
                                        <Route path="payments" element={<PaymentsList />} />
                                        <Route path="bills" element={<BillsList />} />
                                        <Route path="bills/new" element={<BillsCreate />} />
                                        <Route path="bills/:id" element={<BillDetails />} />
                                        <Route path="expenses" element={<ExpensesList />} />
                                        <Route path="reports" element={<OwnerReports />} />
                                        <Route path="*" element={<Navigate to="/owner/dashboard" />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
