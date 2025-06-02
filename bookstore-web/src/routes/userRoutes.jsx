import { useLocation } from 'react-router-dom'
import BookStore from '~/pages/UserPage/HomePage'
import Cart from '~/pages/UserPage/Cart'
import BookDetail from '~/pages/UserPage/BookDetail'
import Checkout from '~/pages/UserPage/Checkout'
import OrderSuccessPage from '~/pages/UserPage/OrderSuccess'
import OrderHistory from '~/pages/UserPage/Order'
import OrderDetail from '~/pages/UserPage/OrderDetail'
import Settings from '~/pages/Settings/Settings'

const UserRoutes = () => {
  const location = useLocation()
  const path = location.pathname
  console.log('UserRoutes - Current Path:', path)

  if (path.includes('/detail/')) {
    console.log('Rendering BookDetail')
    return <BookDetail />
  }
  if (path === '/cart') {
    console.log('Rendering Cart')
    return <Cart />
  }
  if (path === '/checkout') {
    console.log('Rendering Checkout')
    return <Checkout />
  }
  if (path === '/order-success') {
    console.log('Rendering OrderSuccess')
    return <OrderSuccessPage />
  }
  if (path === '/account/orders') {
    console.log('Rendering OrderHistory')
    return <OrderHistory />
  }
  if (path === '/account/order-detail') {
    console.log('Rendering OrderDetail')
    return <OrderDetail />
  }
  if (path === '/settings/account' || path === '/settings/security') {
    console.log('Rendering Settings')
    return <Settings />
  }
  
  console.log('Rendering BookStore (default)')
  return <BookStore />
}

export default UserRoutes
