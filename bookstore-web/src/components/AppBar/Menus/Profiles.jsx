import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link, useNavigate } from 'react-router-dom'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Lấy các hook cần thiết từ react-redux
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Hook xác nhận từ thư viện material-ui-confirm
  const confirmLogout = useConfirm()

  // Hàm xử lý logout với confirm
  const handleLogout = () => {
    confirmLogout({
      title: 'Log out of your account?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        dispatch(logoutUserAPI())
      })
      .catch(() => {})
  }

  const handleLogin = () => {
    navigate('/login')
    handleClose()
  }

  const handleRegister = () => {
    navigate('/register')
    handleClose()
  }

  return (
    <Box>
      <Tooltip title={currentUser ? "Account settings" : "Login/Register"}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 34, height: 34 }}
            alt={currentUser?.username || 'Guest'}
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          ' aria-labelledby': 'demo-positioned-button'
        }}
      >
        {currentUser ? (
          <>
            <Link to="/settings/account" style={{ color:'inherit'}}>
              <MenuItem sx={{ '&:hover':{ color: 'success.light' } }}>
                <Avatar src={currentUser?.avatar} sx={{ width: 28, height: 28, mr: 2 }} /> Profile
              </MenuItem>
            </Link>

            <Divider />
            
            {currentUser.role === 'admin' && (
              <Link to="/admin" style={{ color:'inherit'}}>
                <MenuItem>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Go to Admin
                </MenuItem>
              </Link>
            )}

            <Link to="/settings/account" style={{ color:'inherit'}}>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
            </Link>

            <MenuItem onClick={handleLogout} sx={{
              '&:hover':{
                color: 'warning.dark',
                '& .logout-icon': { color: 'warning.dark' }
              }
            }}>
              <ListItemIcon>
                <Logout className="logout-icon" fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
            <MenuItem onClick={handleRegister}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              Register
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}

export default Profiles