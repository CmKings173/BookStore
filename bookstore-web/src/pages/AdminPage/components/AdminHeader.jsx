import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '~/redux/user/userSlice';

function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  // State for notification menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Handle notification menu
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Handle profile menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/admin')}
        >
          BookStore Admin
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notifications */}
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleProfileClick}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={currentUser?.avatar}
            >
              {currentUser?.name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <MenuItem onClick={handleNotificationClose}>
            <Typography variant="subtitle2">Thông báo mới</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationClose}>
            <Typography variant="body2">Đơn hàng mới #1234</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose}>
            <Typography variant="body2">Sản phẩm sắp hết hàng</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationClose}>
            <Typography variant="body2">Cập nhật hệ thống</Typography>
          </MenuItem>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: { width: 200 }
          }}
        >
          <MenuItem onClick={() => {
            handleProfileClose();
            navigate('/admin/profile');
          }}>
            <AccountCircle sx={{ mr: 1 }} />
            <Typography>Hồ sơ</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            handleProfileClose();
            navigate('/admin/settings');
          }}>
            <SettingsIcon sx={{ mr: 1 }} />
            <Typography>Cài đặt</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} />
            <Typography>Đăng xuất</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
