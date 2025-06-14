import { useState, useEffect } from "react"
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
// import RefreshIcon from "@mui/icons-material/Refresh"
// import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FilterListIcon from "@mui/icons-material/FilterList"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import CancelIcon from "@mui/icons-material/Cancel"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { getAllOrdersAPI } from '~/apis/admin'
import OrderDetailModal from './components/OrderDetailModal'
import OrderUpdateModal from './components/OrderUpdateModal'

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "success"
    case "shipping":
      return "primary"
    case "confirmed":
      return "info"
    case "pending":
      return "warning"
    case "cancelled":
      return "error"
    default:
      return "default"
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return <CheckCircleIcon fontSize="small" />
    case "shipping":
      return <LocalShippingOutlinedIcon fontSize="small" />
    case "confirmed":
      return <ShoppingCartIcon fontSize="small" />
    case "cancelled":
      return <CancelIcon fontSize="small" />
    default:
      return null
  }
}

function Orders() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getAllOrdersAPI()
        setOrders(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage)
  // }

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10))
  //   setPage(0)
  // }

  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersAPI();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Tính toán số lượng đơn hàng theo trạng thái
  const orderStats = {
    total: orders.length,
    delivered: orders.filter(order => order.status === "delivered").length,
    confirmed: orders.filter(order => order.status === "confirmed").length,
    pending: orders.filter(order => order.status === "pending").length,
    shipping: orders.filter(order => order.status === "shipping").length,
    cancelled: orders.filter(order => order.status === "cancelled").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
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
                    {orderStats.delivered}
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
                    Chờ xác nhận
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {orderStats?.pending || 0 }
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
                  <MenuItem value="delivered">Đã giao</MenuItem>
                  <MenuItem value="shipping">Đang giao</MenuItem>
                  <MenuItem value="confirmed">Đang xử lý</MenuItem>
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
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
                <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày đặt</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tổng tiền</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                    {order._id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{order.shippingInfo.fullName}</TableCell>
                  <TableCell>{order.shippingInfo.phone}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${order.items.length} cuốn`} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 'medium'
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium', color: theme.palette.success.main }}>
                    {order.totalAmount.toLocaleString("vi-VN")}₫
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
                        onClick={() => handleViewOrderDetails(order._id)}
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
                    <Tooltip title="Cập nhật trạng thái">
                      <IconButton 
                        size="small"
                        onClick={() => handleUpdateOrder(order)}
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
      </Card>

      {/* Add OrderDetailModal */}
      <OrderDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderId={selectedOrderId}
      />

      {/* Add OrderUpdateModal */}
      <OrderUpdateModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </Box>
  )
}

export default Orders