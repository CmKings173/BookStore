// import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
// import NotFound from '~/pages/404/NotFound'
import NotFound from '~/pages/404/NotFound-2'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

import Settings from '~/pages/Settings/Settings'
import HomePage from '~/pages/UserPage/HomePage'
import Cart from '~/pages/UserPage/Cart'
import BookDetail from '~/pages/UserPage/BookDetail'
import Checkout from '~/pages/UserPage/Checkout'
import OrderSuccessPage from '~/pages/UserPage/OrderSuccess'
import OrderHistory from '~/pages/UserPage/OrderHistory'
import OrderDetail from '~/pages/UserPage/OrderDetail'

import DashBoard from '~/pages/AdminPage/Dashboard'
import Books from '~/pages/AdminPage/Books'
import Orders from '~/pages/AdminPage/Orders'
import Customers from '~/pages/AdminPage/Customers'
import Analytics from '~/pages/AdminPage/Analytics'
import AdminLayout from '~/components/Layout/AdminLayout'
// Giải pháp clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập vào board
// Sử dụng Outlet để hiển thị các child route
const ProtectedRoute = ({ user }) => {
  console.log('ProtectedRoute - User:', user)
  if (!user) return <Navigate to='/login' replace={true}/>
  return <Outlet />
}

// Protected Route cho admin
const AdminProtectedRoute = ({ user }) => {
  console.log('AdminProtectedRoute - User:', user)
  if (!user) return <Navigate to='/login' replace={true}/>
  if (user.role !== 'admin') return <Navigate to='/home' replace={true}/>
  return <Outlet />
}

// Admin Layout Component
const AdminLayoutWrapper = () => {
  // console.log('AdminLayoutWrapper rendering')
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  // console.log('App - Current User:', currentUser)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path="/" element={<Navigate to="/home" replace={true} />} />

      {/* Public Routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/book-detail/:id" element={<BookDetail />} />
      {/* Authentication route */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/account/orders" element={<OrderHistory />} />
        <Route path="/account/order-detail/:id" element={<OrderDetail />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminProtectedRoute user={currentUser} />}>
        <Route path="/admin" element={<AdminLayoutWrapper />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="books" element={<Books />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App


// src/App.jsx
// import AppRoutes from './routes/index.jsx'

// function App() {
//   console.log('App component is rendering')
//   return <AppRoutes />
// }

// export default App