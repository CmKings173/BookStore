import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Pagination from "@mui/material/Pagination"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"

// Icons
import SearchIcon from "@mui/icons-material/Search"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ReceiptIcon from "@mui/icons-material/Receipt"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import RepeatIcon from "@mui/icons-material/Repeat"
import DownloadIcon from "@mui/icons-material/Download"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import FilterListIcon from "@mui/icons-material/FilterList"
import { toast } from 'react-toastify'
import { fetchOrdersAPI } from '~/apis/client'
import { updateOrderStatusAPI } from '~/apis';
// Order status components with appropriate colors
const OrderStatus = ({ status }) => {
  let color = "default"
  let icon = null
  let label = status

  switch (status) {
    case "pending":
      color = "warning"
      icon = <ShoppingCartIcon fontSize="small" />
      label = "Chờ xác nhận"
      break
    case "confirmed":
      color = "info"
      icon = <LocalShippingIcon fontSize="small" />
      label = "Đang xử lý"
      break
    case "shipping":
      color = "primary"
      icon = <LocalShippingIcon fontSize="small" />
      label = "Đang giao hàng"
      break
    case "delivered":
      color = "success"
      icon = <CheckCircleIcon fontSize="small" />
      label = "Đã giao hàng"
      break
    case "cancelled":
      color = "error"
      icon = <CancelIcon fontSize="small" />
      label = "Đã hủy"
      break
    default:
      icon = <ReceiptIcon fontSize="small" />
  }

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size="small"
      sx={{
        fontWeight: 500,
        "& .MuiChip-icon": {
          ml: 0.5,
        },
      }}
    />
  )
}

function OrderHistory() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [timeFilter, setTimeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const ordersPerPage = 5

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetchOrdersAPI()
      if (response) {
        const formattedOrders = response.map(order => ({
          id: order._id,
          date: order.createdAt,
          total: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          items: order.items.map(item => ({
            id: item.bookId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingInfo: {
            name: order.shippingInfo.fullName,
            address: `${order.shippingInfo.street}, ${order.shippingInfo.ward}, ${order.shippingInfo.district}`,
            city: order.shippingInfo.city,
            phone: order.shippingInfo.phone,
            email: order.shippingInfo.email
          }
        }))
        setOrders(formattedOrders)
        setFilteredOrders(formattedOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on tab, search term, and filters
    let filtered = [...orders]

    // Filter by tab (status)
    if (tabValue === 1) filtered = filtered.filter((order) => order.status === "pending")
    else if (tabValue === 2)
      filtered = filtered.filter((order) => order.status === "confirmed" || order.status === "shipping")
    else if (tabValue === 3) filtered = filtered.filter((order) => order.status === "delivered")
    else if (tabValue === 4) filtered = filtered.filter((order) => order.status === "cancelled")

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 60)) // 30 + 60 = 90 days
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 3)) // 3 + 3 = 6 months

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date)
        if (timeFilter === "30days") return orderDate >= thirtyDaysAgo
        if (timeFilter === "90days") return orderDate >= ninetyDaysAgo
        if (timeFilter === "6months") return orderDate >= sixMonthsAgo
        return true
      })
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
    setPage(1) // Reset to first page when filters change
  }, [orders, tabValue, searchTerm, timeFilter, statusFilter])


  const handleCancelOrder = (order) => {
    updateOrderStatusAPI(order.id, 'cancelled')
      .then(() => {
        toast.success('Hủy đơn thành công')
        fetchOrders()
      })
      .catch((error) => {
        toast.error('Không thể hủy đơn')
      })
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value)
  }

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleViewOrderDetails = (orderId) => {
    navigate(`/account/order-detail/${orderId}`)
  }

  const handleReorder = (orderId) => {
    // In a real app, this would add all items from the order to the cart
    console.log(`Reordering items from order ${orderId}`)
  }

  const handleDownloadInvoice = (orderId) => {
    // In a real app, this would download the invoice PDF
    console.log(`Downloading invoice for order ${orderId}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Calculate pagination
  const indexOfLastOrder = page * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage)

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(3)
      .fill()
      .map((_, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 3, mb: 2, borderRadius: "8px" }}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={7}>
              <Stack spacing={1}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Stack>
            </Grid>
            <Grid xs={12} sm={5} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
              <Stack spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Skeleton variant="rounded" width={100} height={24} />
                <Skeleton variant="text" width={120} height={20} />
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Skeleton variant="rounded" width={60} height={60} />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
          Lịch sử đơn hàng
        </Typography>

        <Paper sx={{ mb: 4, borderRadius: "8px", overflow: "hidden" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="order history tabs"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              "& .MuiTab-root": {
                py: 2,
                fontWeight: 500,
              },
              "& .Mui-selected": {
                color: "#4caf50 !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4caf50",
              },
            }}
          >
            <Tab label="Tất cả đơn hàng" id="order-tab-0" />
            <Tab label="Chờ xác nhận" id="order-tab-1" />
            <Tab label="Đang giao" id="order-tab-2" />
            <Tab label="Đã giao" id="order-tab-3" />
            {/* <Tab label="Đã hủy" id="order-tab-4" /> */}
          </Tabs>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sách"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Grid container spacing={2}>
                  {/* <Grid xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="time-filter-label">Thời gian</InputLabel>
                      <Select
                        labelId="time-filter-label"
                        value={timeFilter}
                        label="Thời gian"
                        onChange={handleTimeFilterChange}
                        startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />}
                      >
                        <MenuItem value="all">Tất cả thời gian</MenuItem>
                        <MenuItem value="30days">30 ngày gần đây</MenuItem>
                        <MenuItem value="90days">90 ngày gần đây</MenuItem>
                        <MenuItem value="6months">6 tháng gần đây</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        label="Trạng thái"
                        onChange={handleStatusFilterChange}
                        startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />}
                      >
                        <MenuItem value="all">Tất cả trạng thái</MenuItem>
                        <MenuItem value="pending">Chờ xác nhận</MenuItem>
                        <MenuItem value="confirmed">Đang xử lý</MenuItem>
                        <MenuItem value="shipping">Đang giao hàng</MenuItem>
                        <MenuItem value="delivered">Đã giao hàng</MenuItem>
                        <MenuItem value="cancelled">Đã hủy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {loading ? (
          renderSkeletons()
        ) : filteredOrders.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: "8px",
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Box
              // component="img"
              // src="/placeholder.svg?height=120&width=120"
              alt="No orders"
              sx={{ height: 120, width: 120, mb: 2, opacity: 0.7 }}
            />
            <Typography variant="h6" gutterBottom>
              Không tìm thấy đơn hàng nào
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchTerm
                ? "Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm."
                : "Bạn chưa có đơn hàng nào trong mục này."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/home")}
              sx={{
                mt: 2,
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Mua sắm ngay
            </Button>
          </Paper>
        ) : (
          <>
            {currentOrders.map((order) => (
              <Paper
                key={order.id}
                variant="outlined"
                sx={{
                  mb: 3,
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid xs={12} sm={7}>
                      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          Đơn hàng #{order.id}
                        </Typography>
                        <OrderStatus status={order.status} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày đặt hàng: {formatDate(order.date)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phương thức thanh toán: {order.paymentMethod}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={5} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
                      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Typography variant="subtitle1" fontWeight="600" color="primary">
                          {formatPrice(order.total)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} sản phẩm
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {/* Order items preview (show first 2 items) */}
                    {order.items.map((item) => (
                      <Grid xs={12} key={item.id}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: "contain",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: "4px",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight="500">
                              {item.title}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                              <Typography variant="body2">
                                {formatPrice(item.price)} x {item.quantity}
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {formatPrice(item.price * item.quantity)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {/* {item !== order.items[order.items.length - 1] && item !== order.items[1] && (
                          <Divider sx={{ my: 2 }} />
                        )} */}
                      </Grid>
                    ))}

                    {/* Show message if there are more items
                    {order.items.length > 2 && (
                      <Grid xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          + {order.items.length - 2} sản phẩm khác
                        </Typography>
                      </Grid>
                    )} */}

                    {/* Order actions */}
                    <Grid xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewOrderDetails(order.id)}
                          sx={{
                            borderColor: "#4caf50",
                            color: "#4caf50",
                            "&:hover": {
                              borderColor: "#4caf50",
                              backgroundColor: "rgba(76, 175, 80, 0.04)",
                            },
                          }}
                        >
                          Chi tiết
                        </Button>
                        {/* {order.status === "delivered" && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RepeatIcon />}
                            onClick={() => handleReorder(order.id)}
                          >
                            Mua lại
                          </Button>
                        )} */}
                        {/* <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadInvoice(order.id)}
                        >
                          Hóa đơn
                        </Button> */}
                        {order.status === "pending" && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            color="error"
                            onClick={() => handleCancelOrder(order)}
                          >
                            Hủy đơn
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ))}

            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        {/* Help section */}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mt: 4,
            borderRadius: "8px",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <HelpOutlineIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Cần hỗ trợ về đơn hàng?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email support@bookstore.com
              hoặc gọi số hotline 1900 1234.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Container>
  )
}

export default OrderHistory
