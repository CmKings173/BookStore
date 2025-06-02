import { useState } from "react"
import { useLocation, Outlet } from "react-router-dom"
import { styled } from "@mui/material/styles"
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import LogoutIcon from "@mui/icons-material/Logout"
import { useNavigate } from "react-router-dom"

import Sidebar from "./Sidebar"
// import { useAuth } from "../../contexts/AuthContext"

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  backgroundColor: "#f5f6fa",
  minHeight: "100vh",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#2c3e50",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const getPageTitle = (pathname) => {
  switch (pathname) {
    case "/admin":
    case "/admin/dashboard":
      return "Dashboard Tổng quan"
    case "/admin/books":
      return "Quản lý sách"
    case "/admin/orders":
      return "Quản lý đơn hàng"
    case "/admin/discounts":
      return "Mã giảm giá"
    case "/admin/customers":
      return "Quản lý khách hàng"
    case "/admin/analytics":
      return "Thống kê bán hàng"
    case "/admin/settings":
      return "Cài đặt"
    default:
      return "BookStore Admin"
  }
}

function AdminLayout() {
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  // const { user, logout } = useAuth()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // logout()
    navigate("/login")
    handleMenuClose()
  }

  const handleProfile = () => {
    navigate("/admin/profile")
    handleMenuClose()
  }

  const handleSettings = () => {
    navigate("/admin/settings")
    handleMenuClose()
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {getPageTitle(location.pathname)}
          </Typography>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
              {/* {user?.name || "Admin User"} */}
            </Typography>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#3498db",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {/* {user?.name?.charAt(0).toUpperCase() || "A"} */}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                minWidth: 200,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfile}>
              <Avatar sx={{ bgcolor: "#3498db" }} />
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <Avatar sx={{ bgcolor: "#95a5a6" }}>⚙️</Avatar>
              Cài đặt
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "#e74c3c" }}>
              <Avatar sx={{ bgcolor: "#e74c3c" }}>
                <LogoutIcon fontSize="small" />
              </Avatar>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBarStyled>

      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Main>
    </Box>
  )
}

export default AdminLayout
