import { useLocation } from 'react-router-dom'
import BookStore from '~/pages/UserPage/HomePage'
import Cart from '~/pages/UserPage/Cart'
import BookDetail from '~/pages/UserPage/BookDetail'
import Checkout from '~/pages/UserPage/Checkout'
import OrderSuccessPage from '~/pages/UserPage/OrderSuccess'
import OrderHistory from '~/pages/UserPage/OrderHistory'
import OrderDetail from '~/pages/UserPage/OrderDetail'
import Settings from '~/pages/Settings/Settings'
import NewsList from '~/pages/UserPage/NewsList'
import NewsDetail from '~/pages/UserPage/NewsDetail'

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
  if (path === '/news') {
    console.log('Rendering NewsList')
    return <NewsList />
  }
  if (path.startsWith('/news/')) {
    console.log('Rendering NewsDetail')
    return <NewsDetail />
  }
  
  console.log('Rendering BookStore (default)')
  return <BookStore />
}

export default UserRoutes
