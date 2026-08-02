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
import CityList from './pages/admin/CityList'
import AreaList from './pages/admin/AreaList'
import CityEdit from './pages/admin/CityEdit'
import AreaEdit from './pages/admin/AreaEdit'
import StaffUsersList from './pages/admin/StaffUsersList'
import StaffUserEdit from './pages/admin/StaffUserEdit'
import RolesList from './pages/admin/RolesList'
import RoleEdit from './pages/admin/RoleEdit'
import StateList from './pages/admin/StateList'
import StateEdit from './pages/admin/StateEdit'

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
import OwnerPGsList from './pages/owner/PGsList'
import OwnerPGView from './pages/owner/PGView'
import OwnerUsersList from './pages/owner/OwnerUsersList'
import OwnerUserEdit from './pages/owner/OwnerUserEdit'

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
                            <ProtectedRoute role={['super_admin', 'staff']}>
                                <Layout>
                                    <Routes>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="pg-owners" element={<PGOwnersList />} />
                                        <Route path="pg-owners/new" element={<PGOwnerCreate />} />
                                        <Route path="pg-owners/:id/edit" element={<PGOwnerEdit />} />
                                        <Route path="pgs/new" element={<PGEdit />} />
                                        <Route path="pgs/:id/edit" element={<PGEdit />} />
                                        <Route path="pgs" element={<AllPGs />} />
                                        <Route path="states" element={<StateList />} />
                                        <Route path="states/new" element={<StateEdit />} />
                                        <Route path="states/:id/edit" element={<StateEdit />} />
                                        <Route path="cities" element={<CityList />} />
                                        <Route path="cities/new" element={<CityEdit />} />
                                        <Route path="cities/:id/edit" element={<CityEdit />} />
                                        <Route path="areas" element={<AreaList />} />
                                        <Route path="areas/new" element={<AreaEdit />} />
                                        <Route path="areas/:id/edit" element={<AreaEdit />} />
                                        <Route path="reports" element={<Reports />} />
                                        <Route path="staff" element={<StaffUsersList />} />
                                        <Route path="staff/new" element={<StaffUserEdit />} />
                                        <Route path="staff/:id/edit" element={<StaffUserEdit />} />
                                        <Route path="roles" element={<RolesList />} />
                                        <Route path="roles/new" element={<RoleEdit />} />
                                        <Route path="roles/:id/edit" element={<RoleEdit />} />
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
                                        <Route path="pgs" element={<OwnerPGsList />} />
                                        <Route path="pgs/:id" element={<OwnerPGView />} />
                                        <Route path="users" element={<OwnerUsersList />} />
                                        <Route path="users/new" element={<OwnerUserEdit />} />
                                        <Route path="users/:id/edit" element={<OwnerUserEdit />} />
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
