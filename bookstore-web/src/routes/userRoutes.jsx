import { Route } from 'react-router-dom'
import BookStore from '~/pages/UserPage/HomePage'
import Cart from '~/pages/UserPage/Cart'
import BookDetail from '~/pages/UserPage/BookDetail'
import Checkout from '~/pages/UserPage/Checkout'
import OrderSuccessPage from '~/pages/UserPage/OrderSuccess'
import OrderHistory from '~/pages/UserPage/Order'
import OrderDetail from '~/pages/UserPage/OrderDetail'
import Settings from '~/pages/Settings/Settings'

const UserRoutes = () => {
  return (
    <>
      <Route path="/bookstore" element={<BookStore />} />
      <Route path="/detail/:id" element={<BookDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/account/orders" element={<OrderHistory />} />
      <Route path="/account/order-detail" element={<OrderDetail />} />
      <Route path="/settings/account" element={<Settings />} />
      <Route path="/settings/security" element={<Settings />} />
    </>
  )
}

export default UserRoutes
