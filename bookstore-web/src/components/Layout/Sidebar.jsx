
import { useNavigate, useLocation } from "react-router-dom"
import { styled } from "@mui/material/styles"
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
} from "@mui/material"

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import DiscountIcon from "@mui/icons-material/LocalOffer"
import PeopleIcon from "@mui/icons-material/People"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"

const drawerWidth = 240

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "center",
  backgroundColor: "#34495e",
  color: "white",
  borderBottom: "1px solid #2c3e50",
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#2c3e50",
    color: "white",
    borderRight: "none",
  },
}))

const menuItems = [
  {
    title: "Tổng quan",
    icon: <DashboardIcon />,
    path: "/admin",
    badge: null,
  },
  {
    title: "Quản lý sách",
    icon: <MenuBookIcon />,
    path: "/admin/books",
    badge: "20",
  },
  {
    title: "Quản lý đơn hàng",
    icon: <ShoppingCartIcon />,
    path: "/admin/orders",
    badge: "5",
  },
  {
    title: "Người dùng",
    icon: <PeopleIcon />,
    path: "/admin/customers",
    badge: null,
  },
]

const systemItems = [
  {
    title: "Thống kê",
    icon: <AnalyticsIcon />,
    path: "/admin/analytics",
  },
  {
    title: "Cài đặt",
    icon: <SettingsIcon />,
    path: "/admin/settings",
  },
]

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (path) => {
    navigate(path)
    // Close drawer on mobile
    if (window.innerWidth < 900) {
      onClose()
    }
  }

  const handleLogout = () => {
    // Handle logout logic
    navigate("/login")
  }

  return (
    <StyledDrawer variant="persistent" anchor="left" open={open}>
      {/* Header */}
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            📚
          </Typography>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1 }}>
              BookStore
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: "#34495e" }} />

      {/* Main Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "#34495e",
                },
                ...(location.pathname === item.path && {
                  backgroundColor: "#3498db",
                  "&:hover": {
                    backgroundColor: "#2980b9",
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ backgroundColor: "#34495e", mx: 2 }} />

      {/* System Menu */}
      <List sx={{ px: 1, py: 1 }}>
        <ListItem>
          <Typography variant="caption" sx={{ color: "#bdc3c7", fontWeight: "bold", px: 2 }}>
            HỆ THỐNG
          </Typography>
        </ListItem>
        {systemItems.map((item) => (
          <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "#34495e",
                },
                ...(location.pathname === item.path && {
                  backgroundColor: "#3498db",
                  "&:hover": {
                    backgroundColor: "#2980b9",
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: location.pathname === item.path ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(231, 76, 60, 0.2)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          />
        </ListItemButton>
      </Box>
    </StyledDrawer>
  )
}

export default Sidebar
