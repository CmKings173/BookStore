import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import UserRoutes from './userRoutes'
import AdminRoutes from './adminRoutes'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import NotFound from '~/pages/404/NotFound-2'

const ProtectedRoute = ({ user }) => {
  console.log('ProtectedRoute - Current User:', user)
  if (!user) {
    console.log('No user found, redirecting to login')
    return <Navigate to='/login' replace={true}/>
  }
  console.log('User authenticated, rendering protected content')
  return <Outlet />
}

const AppRoutes = () => {
  const currentUser = useSelector(selectCurrentUser)
  console.log('AppRoutes - Current User:', currentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path="/" element={<Navigate to="/bookstore" replace={true} />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="bookstore" element={<UserRoutes />} />
        <Route path="book-detail/:id" element={<UserRoutes />} />
        <Route path="cart" element={<UserRoutes />} />
        <Route path="checkout" element={<UserRoutes />} />
        <Route path="order-success" element={<UserRoutes />} />
        <Route path="account/orders" element={<UserRoutes />} />
        <Route path="account/order-detail" element={<UserRoutes />} />
        <Route path="settings/account" element={<UserRoutes />} />
        <Route path="settings/security" element={<UserRoutes />} />
      </Route>

      {/* Admin Routes - Public Access */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Auth Routes */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
