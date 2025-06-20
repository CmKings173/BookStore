import { useLocation } from "react-router-dom"
import AdminLayout from "~/components/Layout/AdminLayout"

// Import các trang admin
import Dashboard from "~/pages/AdminPage/Dashboard"
import Books from "~/pages/AdminPage/Books"
import Orders from "~/pages/AdminPage/Orders"
import Categories from "~/pages/AdminPage/Categories"
import Customers from "~/pages/AdminPage/Customers"
import Analytics from "~/pages/AdminPage/Analytics"
// import Users from "../pages/Users"
// import Analytics from "../pages/Analytics"
// import Settings from "../pages/Settings"
// import Discounts from "../pages/Discounts"

function AdminRoutes() {
  const location = useLocation()
  const path = location.pathname
  console.log('AdminRoutes - Current Path:', path)

  const renderPage = () => {
    switch (path) {
      case "/admin":
      case "/admin/dashboard":
        return <Dashboard />
      case "/admin/books":
        return <Books />
      case "/admin/orders":
        return <Orders />
      case "/admin/categories":
        return <Categories />
      case "/admin/customers":
        return <Customers />
      case "/admin/analytics":
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminLayout>
      {/* Add more conditions here when you uncomment the imports */}
      {renderPage()}
    </AdminLayout>
  )
}

export default AdminRoutes