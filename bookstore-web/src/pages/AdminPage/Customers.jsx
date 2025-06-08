import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { toast } from 'react-toastify'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import PeopleIcon from "@mui/icons-material/People"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BlockIcon from "@mui/icons-material/Block"
import FilterListIcon from "@mui/icons-material/FilterList"
import RefreshIcon from "@mui/icons-material/Refresh"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { fetchUsersAPI, deleteUserAPI } from "~/apis/admin"
import DeleteUserDialog from '~/pages/AdminPage/components/DeleteUserDialog'

const getStatusColor = (status) => {
  switch (status) {
    case "Hoạt động":
      return "success"
    case "Tạm khóa":
      return "error"
    default:
      return "default"
  }
}

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

const getStatusIcon = (status) => {
  switch (status) {
    case true :
      return <CheckCircleIcon fontSize="small" />
    case false:
      return <BlockIcon fontSize="small" />
    default:
      return null
  }
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

const getAvatarColor = (name) => {
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#ff5722'
  ]
  // Tạo một số ngẫu nhiên dựa trên tên
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Lấy màu từ mảng colors
  return colors[Math.abs(hash) % colors.length]
}

const Customers = () => {
  const theme = useTheme()
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // Tính toán userStats từ users
  const userStats = {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    blocked: users.filter(user => !user.isActive).length,
    admins: users.filter(user => user.role === "admin").length,
    customers: users.filter(user => user.role === "client").length,
    // totalOrders: 0
  }

  const updateStateData = (res) => {
    // console.log('Updating state with:', res)
    setUsers(res.users || [])
    setTotalUsers(res.totalUsers || 0)
  }

  const query = new URLSearchParams(location.search)
  const currentPage = parseInt(query.get('page') || '1', 10)

  useEffect(() => {
    setPage(currentPage)
    fetchUsersAPI(location.search).then(res => {
      // console.log('API response:', res)
      updateStateData(res)
    }).catch(err => {
      console.error('Error fetching users:', err)
    })
  }, [location.search])

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
  }

  const handleDeleteClick = (book) => {
    setUserToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteUserAPI(userToDelete._id)
      toast.success('Xóa sách thành công!')
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      // Fetch lại danh sách sách
      fetchUsersAPI(location.search).then(updateStateData)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa sách!')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }
  // const filteredUsers = users.filter((user) => {
  //   const matchesSearch =
  //     user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())


  //   const matchesRole = roleFilter === "" || user.role === roleFilter
  //   const matchesStatus = statusFilter === "" || user.isActive === statusFilter

  //   return matchesSearch && matchesRole && matchesStatus
  // })

  if (!users) {
    return <PageLoadingSpinner caption="Đang tải ..." />
  }
  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f7fa" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="bold" 
          sx={{ 
            color: theme.palette.text.primary,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            paddingLeft: 2,
          }}
        >
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin và quyền hạn của tất cả người dùng trong hệ thống
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}md={2.9}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tổng người dùng
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {userStats.total}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main 
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.9}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Đang hoạt động
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {userStats.active}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main 
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.9}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Quản trị viên
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {userStats.admins}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    color: theme.palette.warning.main 
                  }}
                >
                  <AdminPanelSettingsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.9}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    khách hàng
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {userStats.customers}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main 
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterListIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div">
              Bộ lọc tìm kiếm
            </Typography>
            {/* <Box sx={{ ml: 'auto' }}>
              <Button 
                variant="contained" 
                startIcon={<PersonAddIcon />}
                sx={{ borderRadius: "8px", mr: 1 }}
              >
                Thêm người dùng
              </Button>
            </Box> */}
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <TextField  
                label="Tìm kiếm người dùng theo tên hoặc email..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="role-filter-label">Vai trò</InputLabel>
                <Select
                  labelId="role-filter-label"
                  value={roleFilter}
                  label="Vai trò"
                  onChange={handleRoleFilterChange}
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Khách hàng">Khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={handleStatusFilterChange}
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Người dùng</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày tham gia</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow 
                    key={user._id} 
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {user.avatar ? (
                          <Avatar 
                            src={user.avatar}
                            alt={user.displayName || user.username}
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: theme.palette.primary.main,
                              fontWeight: 'bold'
                            }}
                          >
                            {(user.displayName || user.username)?.charAt(0)}
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.displayName || user.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getRoleIcon(user.role)}
                        label={user.role === "client" ? "Khách hàng" : "Admin"} 
                        color={getRoleColor(user.role)} 
                        size="small"
                        variant={user.role === "client" ? "outlined" : "filled"}
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(user.isActive)}
                        label={user.isActive ? "Active" : "Inactive"} 
                        color={user.isActive ? "success" : "error"} 
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewUser(user)}
                          sx={{ 
                            color: theme.palette.info.main,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            mr: 1,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton 
                          size="small"
                          sx={{ 
                            color: theme.palette.warning.main,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            mr: 1,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.warning.main, 0.2),
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton 
                          size="small"
                          sx={{ 
                            color: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.2),
                            }
                          }}
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Không tìm thấy người dùng</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Không có người dùng nào phù hợp với tiêu chí tìm kiếm của bạn
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: selectedUser ? getAvatarColor(selectedUser.name) : 'grey.500',
                width: 50,
                height: 50
              }}
            >
              {selectedUser?.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedUser?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Chi tiết thông tin người dùng
              </Typography>
            </Box>
          </Box>

          
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EmailIcon color="action" />
                  <Typography variant="body1">{selectedUser.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PhoneIcon color="action" />
                  <Typography variant="body1">{selectedUser.phone}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Vai trò</Typography>
                <Chip 
                  icon={getRoleIcon(selectedUser.role)}
                  label={selectedUser.role} 
                  color={getRoleColor(selectedUser.role)} 
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                <Chip 
                  icon={getStatusIcon(selectedUser.status)}
                  label={selectedUser.status} 
                  color={getStatusColor(selectedUser.status)} 
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Ngày tham gia</Typography>
                <Typography variant="body1">{selectedUser.joinDate}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Số đơn hàng</Typography>
                <Typography variant="body1">{selectedUser.orders} đơn</Typography>
              </Grid>
            </Grid>
          )}

           {/* Pagination */}
           {/* {totalUsers > 0 && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  size="large"
                  color="primary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalUsers / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  // onChange={(e, value) => setPage(value)}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/admin/users${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )} */}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        user={userToDelete}
        onConfirm={handleDeleteConfirm}
      />

    </Box>
  )
}

export default Customers