import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import AdminRoutes from './adminRoutes'
import UserRoutes from './userRoutes'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import NotFound from '~/pages/404/NotFound-2'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true}/>
  return <Outlet />
}

const AppRoutes = () => {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path="/" element={<Navigate to="/bookstore" replace={true} />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <UserRoutes />
      </Route>

      {/* Admin Routes */}
      <AdminRoutes />

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
