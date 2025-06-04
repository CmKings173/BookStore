"use client"

import { useState } from "react"
import {
  Box,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  Tooltip,
  TablePagination,
  useTheme,
  alpha,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import VisibilityIcon from "@mui/icons-material/Visibility"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RefreshIcon from "@mui/icons-material/Refresh"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FilterListIcon from "@mui/icons-material/FilterList"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import CancelIcon from "@mui/icons-material/Cancel"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const orders = [
  {
    id: "#3102",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    date: "23/06/2024",
    total: 320000,
    status: "Đã giao",
    items: 2,
  },
  {
    id: "#3101",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    date: "22/06/2024",
    total: 150000,
    status: "Đang giao",
    items: 1,
  },
  {
    id: "#3100",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    date: "21/06/2024",
    total: 480000,
    status: "Đang xử lý",
    items: 3,
  },
  {
    id: "#3099",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    date: "20/06/2024",
    total: 95000,
    status: "Đã hủy",
    items: 1,
  },
  {
    id: "#3098",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    date: "19/06/2024",
    total: 275000,
    status: "Đã giao",
    items: 2,
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Đã giao":
      return "success"
    case "Đang giao":
      return "primary"
    case "Đang xử lý":
      return "warning"
    case "Đã hủy":
      return "error"
    default:
      return "default"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "Đã giao":
      return <CheckCircleIcon fontSize="small" />
    case "Đang giao":
      return <LocalShippingOutlinedIcon fontSize="small" />
    case "Đang xử lý":
      return <ShoppingCartIcon fontSize="small" />
    case "Đã hủy":
      return <CancelIcon fontSize="small" />
    default:
      return null
  }
}

function Orders () {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Tính toán số lượng đơn hàng theo trạng thái
  const orderStats = {
    total: orders.length,
    completed: orders.filter(order => order.status === "Đã giao").length,
    processing: orders.filter(order => order.status === "Đang xử lý").length,
    shipping: orders.filter(order => order.status === "Đang giao").length,
    cancelled: orders.filter(order => order.status === "Đã hủy").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
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
          Quản lý đơn hàng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và theo dõi tất cả đơn hàng của khách hàng
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                    Tổng đơn hàng
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {orderStats.total}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main 
                  }}
                >
                  <ShoppingCartIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
                    Đã giao
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {orderStats.completed}
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
        
        <Grid item xs={12} sm={6} md={3}>
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
                    Đang xử lý
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {orderStats.processing}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1), 
                    color: theme.palette.warning.main 
                  }}
                >
                  <ShoppingCartIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
                    Tổng doanh thu
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={theme.palette.secondary.main}>
                    {orderStats.totalRevenue.toLocaleString("vi-VN")}₫
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                    color: theme.palette.secondary.main 
                  }}
                >
                  <AttachMoneyIcon />
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
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                label="Tìm kiếm đơn hàng theo mã hoặc tên khách hàng..."
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Lọc theo trạng thái"
                  onChange={handleStatusFilterChange}
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Đã giao">Đã giao</MenuItem>
                  <MenuItem value="Đang giao">Đang giao</MenuItem>
                  <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
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
          <Table sx={{ minWidth: 650 }} aria-label="order table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày đặt</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                <TableRow 
                  key={order.id} 
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                    {order.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{order.customer}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${order.items} cuốn`} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 'medium'
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium', color: theme.palette.success.main }}>
                    {order.total.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(order.status)}
                      label={order.status} 
                      color={getStatusColor(order.status)} 
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem chi tiết">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: theme.palette.info.main,
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          mr: 1,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                          }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cập nhật vận chuyển">
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: theme.palette.success.main,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.success.main, 0.2),
                          }
                        }}
                      >
                        <LocalShippingIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <SearchIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Không tìm thấy đơn hàng</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm của bạn
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Card>
    </Box>
  )
}

export default Orders