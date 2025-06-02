import { useLocation } from "react-router-dom"
import AdminLayout from "~/components/Layout/AdminLayout"

// Import các trang admin
import Dashboard from "~/pages/AdminPage/Dashboard"
// import Books from "../pages/Books"
// import Orders from "../pages/Orders"
// import Users from "../pages/Users"
// import Analytics from "../pages/Analytics"
// import Settings from "../pages/Settings"
// import Discounts from "../pages/Discounts"

function AdminRoutes() {
  const location = useLocation()
  const path = location.pathname
  console.log('AdminRoutes - Current Path:', path)

  return (
    <AdminLayout>
      {/* Add more conditions here when you uncomment the imports */}
      <Dashboard />
    </AdminLayout>
  )
}

export default AdminRoutes