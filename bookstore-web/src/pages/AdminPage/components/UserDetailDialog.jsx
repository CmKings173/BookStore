// bookstore-web/src/pages/AdminPage/components/UserDetailDialog.jsx
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import { toast } from 'react-toastify'
import { updateUserAPI } from '~/apis/admin'

const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "primary"
    case "client":
      return "default"
    default:
      return "default"
  }
}

const getStatusColor = (status) => {
  return status ? "success" : "error"
}

const getRoleIcon = (role) => {
  switch (role) {
    case "admin":
      return <AdminPanelSettingsIcon fontSize="small" />
    case "client":
      return <PeopleIcon fontSize="small" />
    default:
      return null
  }
}

const getStatusIcon = (status) => {
  return status ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />
}

const UserDetailDialog = ({ open, onClose, user, onUpdate }) => {
  const theme = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(null)

  useEffect(() => {
    if (user) {
      setEditedUser(user)
    } else {
      setEditedUser(null)
    }
  }, [user])

  // If 'user' is null, do not render the dialog content yet.
  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser(user) // Reset về giá trị ban đầu
  }

  const handleSave = async () => {
    try {
      const response = await updateUserAPI(editedUser._id, {
        role: editedUser.role
      })
      
      if (response) {
        toast.success('Cập nhật vai trò thành công!')
        setEditedUser(response) 
        onUpdate(response) 
        setIsEditing(false)
      } else {
        toast.error('Cập nhật không thành công hoặc phản hồi không hợp lệ!')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật vai trò!')
    }
  }

  const handleRoleChange = (event) => {
    setEditedUser(prev => ({
      ...prev,
      role: event.target.value
    }))
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={user.avatar}
            alt={user.displayName || user.username}
            sx={{ 
              width: 50, 
              height: 50,
              bgcolor: theme.palette.primary.main
            }}
          >
            {(user.displayName || user.username)?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.displayName || user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              Chi tiết thông tin người dùng
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Render content only if editedUser is available */}
        {editedUser ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmailIcon color="action" />
                <Typography variant="body1">{editedUser.email}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarTodayIcon color="action" />
                <Typography variant="body1">
                  Ngày tham gia: {new Date(editedUser.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Phần chỉnh sửa */}
            {isEditing ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={editedUser.role}
                    label="Vai trò"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="client">Khách hàng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vai trò
                  </Typography>
                  <Chip 
                    icon={getRoleIcon(editedUser?.role)}
                    label={editedUser?.role === "admin" ? "Admin" : "Khách hàng"}
                    color={getRoleColor(editedUser?.role)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Trạng thái
                  </Typography>
                  <Chip 
                    icon={getStatusIcon(editedUser?.isActive)}
                    label={editedUser?.isActive ? "Active" : "Inactive"}
                    color={getStatusColor(editedUser?.isActive)}
                    size="small"
                  />
                </Grid>
              </>
            )}
          </Grid>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Đang tải thông tin người dùng...</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {isEditing ? (
          <>
            <Button 
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              variant="outlined"
            >
              Hủy
            </Button>
            <Button 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              variant="contained"
            >
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Đóng</Button>
            <Button 
              startIcon={<EditIcon />}
              onClick={handleEdit}
              variant="contained"
            >
              Chỉnh sửa
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default UserDetailDialog