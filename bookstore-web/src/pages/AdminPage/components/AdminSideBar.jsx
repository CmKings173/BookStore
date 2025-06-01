import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  ShoppingCart as OrderIcon,
  People as UserIcon,
  BarChart as StatisticsIcon,
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState({
    books: false,
    orders: false,
    users: false
  });

  // Handle submenu toggle
  const handleToggle = (menu) => {
    setOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Check if menu item is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin'
    },
    {
      title: 'Quản lý sách',
      icon: <BookIcon />,
      path: '/admin/books',
      submenu: [
        { title: 'Danh sách sách', path: '/admin/books' },
        { title: 'Thêm sách mới', path: '/admin/books/new' },
        { title: 'Danh mục', path: '/admin/books/categories' }
      ]
    },
    {
      title: 'Quản lý đơn hàng',
      icon: <OrderIcon />,
      path: '/admin/orders',
      submenu: [
        { title: 'Tất cả đơn hàng', path: '/admin/orders' },
        { title: 'Đơn hàng mới', path: '/admin/orders/new' },
        { title: 'Đơn hàng đang xử lý', path: '/admin/orders/processing' }
      ]
    },
    {
      title: 'Quản lý người dùng',
      icon: <UserIcon />,
      path: '/admin/users',
      submenu: [
        { title: 'Danh sách người dùng', path: '/admin/users' },
        { title: 'Thêm người dùng', path: '/admin/users/new' }
      ]
    },
    {
      title: 'Thống kê',
      icon: <StatisticsIcon />,
      path: '/admin/statistics'
    },
    {
      title: 'Vận chuyển',
      icon: <ShippingIcon />,
      path: '/admin/shipping'
    },
    {
      title: 'Thanh toán',
      icon: <PaymentIcon />,
      path: '/admin/payments'
    },
    {
      title: 'Cài đặt',
      icon: <SettingsIcon />,
      path: '/admin/settings'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px', // Height of AppBar
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <div key={item.title}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.submenu) {
                      handleToggle(item.title.toLowerCase().replace(' ', ''));
                    } else {
                      navigate(item.path);
                    }
                  }}
                  selected={isActive(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  {item.submenu && (
                    open[item.title.toLowerCase().replace(' ', '')] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>

              {item.submenu && (
                <Collapse
                  in={open[item.title.toLowerCase().replace(' ', '')]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.title}
                        sx={{
                          pl: 4,
                          backgroundColor: isActive(subItem.path) ? 'primary.light' : 'inherit',
                          '&:hover': {
                            backgroundColor: isActive(subItem.path) ? 'primary.light' : 'action.hover',
                          },
                        }}
                        onClick={() => navigate(subItem.path)}
                      >
                        <ListItemText
                          primary={subItem.title}
                          sx={{
                            color: isActive(subItem.path) ? 'primary.main' : 'inherit',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default AdminSidebar;  