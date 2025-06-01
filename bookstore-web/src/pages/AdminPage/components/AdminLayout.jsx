import { Box, CssBaseline } from '@mui/material'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

function AdminLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader />
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout