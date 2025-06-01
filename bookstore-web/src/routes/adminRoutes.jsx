import { Route } from 'react-router-dom'
import AdminLayout from '~/pages/AdminPage/components/AdminLayout'
import Dashboard from '~/pages/AdminPage/Dashboard'
import BookList from '~/pages/AdminPage/Books/BookList'
import BookForm from '~/pages/AdminPage/Books/BookForm'
import OrderList from '~/pages/AdminPage/Orders/OrderList'
import UserList from '~/pages/AdminPage/Users/UserList'
import Statistics from '~/pages/AdminPage/Statistics/SalesStats'

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="books" element={<BookList />} />
      <Route path="books/new" element={<BookForm />} />
      <Route path="books/:id" element={<BookDetail />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="orders/:id" element={<OrderDetail />} />
      <Route path="users" element={<UserList />} />
      <Route path="users/:id" element={<UserDetail />} />
      <Route path="statistics" element={<Statistics />} />
    </Route>
  )
}

export default AdminRoutes
