// // import Board from '~/pages/Boards/_id'
// import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
// // import NotFound from '~/pages/404/NotFound'
// import NotFound from '~/pages/404/NotFound-2'
// import Auth from '~/pages/Auth/Auth'
// import AccountVerification from '~/pages/Auth/AccountVerification'
// import { useSelector } from 'react-redux'
// import { selectCurrentUser } from '~/redux/user/userSlice'

// import Settings from '~/pages/Settings/Settings'
// import BookStore from '~/pages/UserPage/HomePage'

// import Cart from '~/pages/UserPage/Cart'
// import BookDetail from '~/pages/UserPage/BookDetail'
// import Checkout from '~/pages/UserPage/Checkout'

// import OrderSuccessPage from '~/pages/UserPage/OrderSuccess'
// import OrderHistory from '~/pages/UserPage/Order'
// import OrderDetail from '~/pages/UserPage/OrderDetail'
// // Giải pháp clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập vào board
// // Sử dụng Outlet để hiển thị các child route
// const ProtectedRoute = ( { user } ) => {
//   if (!user) return <Navigate to='/login' replace={true}/>
//   return <Outlet />
// }

// function App() {
//   const currentUser = useSelector(selectCurrentUser)
//   return (
//     <Routes>
//       {/* Redirect Route */}
//       <Route path="/" element={
//         <Navigate to="/bookstore" replace={true} />
//       } />
//         <Route path="/bookstore" element={<BookStore /> } />
//       {/* Chưa login mà truy cập vào board => đá về login page */}
//       <Route element={ <ProtectedRoute user={currentUser} />} >
//         {/* Outlet của react router dom sẽ chạy vào các child route trong này  */}
//         {/* List Board */}
       

//         {/* User setting*/}
//         <Route path="/settings/account" element={<Settings /> } />
//         <Route path="/settings/security" element={<Settings /> } />

//         <Route path="/cart" element={<Cart /> } />
//         <Route path="/checkout" element={<Checkout /> } />
//         <Route path="/order-success" element={<OrderSuccessPage /> } />
//       </Route>

//       {/* Public routes */}
//       <Route path="/detail/:id" element={<BookDetail />} />

//       <Route path="/account/orders" element={<OrderHistory />} />
//       <Route path="/account/order-detail" element={<OrderDetail />} />
      
//       {/* Authentication */}
//       <Route path='/login' element={<Auth />} />
//       <Route path='/register' element={<Auth />} />
//       <Route path='/account/verification' element={<AccountVerification />} />

//       {/* Profile */}
//       {/* 404 route*/}
//       <Route path="*" element={<NotFound />} />

//     </Routes>
//   )
// }

// export default App


// src/App.jsx
import AppRoutes from './routes'

function App() {
  return <AppRoutes />
}

export default App