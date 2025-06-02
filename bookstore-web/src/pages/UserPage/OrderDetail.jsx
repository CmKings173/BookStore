"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Skeleton from "@mui/material/Skeleton"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ReceiptIcon from "@mui/icons-material/Receipt"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import InventoryIcon from "@mui/icons-material/Inventory"
import DownloadIcon from "@mui/icons-material/Download"
import RepeatIcon from "@mui/icons-material/Repeat"
import HomeIcon from "@mui/icons-material/Home"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import EmailIcon from "@mui/icons-material/Email"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import SupportIcon from "@mui/icons-material/Support"

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
    case "processing":
      color = "info"
      icon = <InventoryIcon fontSize="small" />
      label = "Đang xử lý"
      break
    case "shipped":
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
      size="medium"
      sx={{
        fontWeight: 500,
        "& .MuiChip-icon": {
          ml: 0.5,
        },
      }}
    />
  )
}

function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [openSupportDialog, setOpenSupportDialog] = useState(false)
  const [supportMessage, setSupportMessage] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Mock order data
  const mockOrder = {
    id: "DH123456",
    date: "2025-05-28",
    total: 648000,
    subtotal: 618000,
    shipping: 30000,
    status: "shipped",
    paymentMethod: "COD",
    items: [
      {
        id: "1",
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 299000,
        quantity: 1,
        image: "https://bizweb.dktcdn.net/thumb/grande/100/180/408/products/clean-code.jpg?v=1649847195810",
      },
      {
        id: "2",
        title: "The Pragmatic Programmer",
        author: "David Thomas",
        price: 349000,
        quantity: 1,
        image: "https://edwardthienhoang.wordpress.com/wp-content/uploads/2021/09/pracmatic-programmer.jpg",
      },
    ],
    shippingAddress: {
      name: "Nguyễn Văn A",
      address: "123 Đường ABC, Phường 1, Quận 1",
      city: "TP. Hồ Chí Minh",
      phone: "0901234567",
      email: "nguyenvana@example.com",
    },
    trackingNumber: "VN123456789",
    estimatedDelivery: "2025-06-02",
    timeline: [
      {
        status: "pending",
        date: "2025-05-28T10:30:00",
        description: "Đơn hàng đã được đặt thành công",
      },
      {
        status: "processing",
        date: "2025-05-28T14:45:00",
        description: "Đơn hàng đã được xác nhận và đang được xử lý",
      },
      {
        status: "shipped",
        date: "2025-05-29T09:15:00",
        description: "Đơn hàng đã được giao cho đơn vị vận chuyển",
      },
    ],
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setOrder(mockOrder)
      setLoading(false)
    }, 1000)
  }, [orderId])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  const formatDateTime = (dateTimeString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    return new Date(dateTimeString).toLocaleString("vi-VN", options)
  }

  const handleGoBack = () => {
    navigate("/account/orders")
  }

  const handleReorder = () => {
    // In a real app, this would add all items from the order to the cart
    setSnackbar({
      open: true,
      message: "Đã thêm sản phẩm vào giỏ hàng",
      severity: "success",
    })
  }

  const handleDownloadInvoice = () => {
    // In a real app, this would download the invoice PDF
    setSnackbar({
      open: true,
      message: "Đang tải hóa đơn...",
      severity: "info",
    })
  }

  const handleContinueShopping = () => {
    navigate("/bookstore")
  }

  const handleCancelOrder = () => {
    setOpenCancelDialog(true)
  }

  const handleCancelConfirm = () => {
    // In a real app, this would send the cancellation request to the server
    setSnackbar({
      open: true,
      message: "Đã gửi yêu cầu hủy đơn hàng",
      severity: "success",
    })
    setOpenCancelDialog(false)
    setCancelReason("")
  }

  const handleSupport = () => {
    setOpenSupportDialog(true)
  }

  const handleSupportSubmit = () => {
    // In a real app, this would send the support request to the server
    setSnackbar({
      open: true,
      message: "Đã gửi yêu cầu hỗ trợ",
      severity: "success",
    })
    setOpenSupportDialog(false)
    setSupportMessage("")
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getOrderStatusSteps = () => {
    const steps = [
      { label: "Đặt hàng", completed: true },
      { label: "Xác nhận", completed: order?.status !== "pending" && order?.status !== "cancelled" },
      { label: "Đang giao", completed: order?.status === "shipped" || order?.status === "delivered" },
      { label: "Đã giao", completed: order?.status === "delivered" },
    ]

    let activeStep = 0
    if (order?.status === "processing") activeStep = 1
    else if (order?.status === "shipped") activeStep = 2
    else if (order?.status === "delivered") activeStep = 3

    return { steps, activeStep }
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={200} height={40} />
      </Box>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "8px" }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="70%" height={24} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="70%" height={24} />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "8px" }}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Paper>
    </Box>
  )

  if (loading) {
    return (
      <Container disableGutters maxWidth={false}>
        <AppBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {renderSkeleton()}
        </Container>
        <Footer />
      </Container>
    )
  }

  if (!order) {
    return (
      <Container disableGutters maxWidth={false}>
        <AppBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Không tìm thấy đơn hàng
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </Typography>
            <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
              Quay lại
            </Button>
          </Box>
        </Container>
        <Footer />
      </Container>
    )
  }

  const { steps, activeStep } = getOrderStatusSteps()

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mr: 2 }}>
            Quay lại
          </Button>
          <Typography variant="h4" component="h1" fontWeight="600">
            Chi tiết đơn hàng
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            {/* Order status */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: "8px",
                bgcolor: "background.paper",
                "& .MuiDivider-root": {
                  borderColor: "divider"
                }
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    Đơn hàng #{order.id}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Đặt ngày {formatDate(order.date)}
                  </Typography>
                </Box>
                <OrderStatus status={order.status} />
              </Box>

              {order.status !== "cancelled" && (
                <Box sx={{ mb: 4 }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((step, index) => (
                      <Step key={step.label} completed={step.completed}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              color: step.completed ? "success.main" : undefined,
                            },
                          }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="600" gutterBottom>
                Thông tin vận chuyển
              </Typography>

              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Địa chỉ giao hàng
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {order.shippingAddress.name}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocalPhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2">{order.shippingAddress.phone}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="body2">{order.shippingAddress.email}</Typography>
                  </Box>
                </Grid>

                <Grid xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin vận chuyển
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1" fontWeight="500">
                      Giao hàng tiêu chuẩn
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Mã vận đơn:</strong> {order.trackingNumber}
                  </Typography>
                  {order.status === "shipped" && (
                    <Typography variant="body1">
                      <strong>Dự kiến giao hàng:</strong> {formatDate(order.estimatedDelivery)}
                    </Typography>
                  )}
                  {order.status === "delivered" && order.deliveredDate && (
                    <Typography variant="body1">
                      <strong>Ngày giao hàng:</strong> {formatDate(order.deliveredDate)}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="600" gutterBottom>
                Lịch sử đơn hàng
              </Typography>

              <Timeline position="right" sx={{ p: 0, m: 0 }}>
                {order.timeline.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                      {formatDateTime(event.date)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          event.status === "pending"
                            ? "warning"
                            : event.status === "processing"
                              ? "info"
                              : event.status === "shipped"
                                ? "primary"
                                : event.status === "delivered"
                                  ? "success"
                                  : "error"
                        }
                      >
                        {event.status === "pending" ? (
                          <ShoppingCartIcon fontSize="small" />
                        ) : event.status === "processing" ? (
                          <InventoryIcon fontSize="small" />
                        ) : event.status === "shipped" ? (
                          <LocalShippingIcon fontSize="small" />
                        ) : event.status === "delivered" ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <CancelIcon fontSize="small" />
                        )}
                      </TimelineDot>
                      {index < order.timeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1" fontWeight="500">
                        {event.status === "pending"
                          ? "Đặt hàng thành công"
                          : event.status === "processing"
                            ? "Đang xử lý đơn hàng"
                            : event.status === "shipped"
                              ? "Đang giao hàng"
                              : event.status === "delivered"
                                ? "Đã giao hàng"
                                : "Đã hủy đơn hàng"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>

            {/* Order items */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: "8px",
                bgcolor: "background.paper",
                "& .MuiDivider-root": {
                  borderColor: "divider"
                }
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Sản phẩm đã đặt
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                            <Box>
                              <Typography variant="body1" fontWeight="500">
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.author}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatPrice(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Box sx={{ width: { xs: "100%", sm: "50%", md: "40%" } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">Tạm tính</Typography>
                    <Typography variant="body1">{formatPrice(order.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">Phí vận chuyển</Typography>
                    <Typography variant="body1">{formatPrice(order.shipping)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Tổng cộng
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600" color="primary">
                      {formatPrice(order.total)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Phương thức thanh toán: {order.paymentMethod}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Action buttons */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={handleContinueShopping}
                sx={{
                  borderColor: "success.main",
                  color: "success.main",
                  "&:hover": {
                    borderColor: "success.dark",
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                  },
                }}
              >
                Tiếp tục mua sắm
              </Button>
              {order.status === "delivered" && (
                <Button 
                  variant="outlined" 
                  startIcon={<RepeatIcon />} 
                  onClick={handleReorder}
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  Mua lại
                </Button>
              )}
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleDownloadInvoice}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Tải hóa đơn
              </Button>
              {order.status === "shipped" && (
                <Button
                  variant="contained"
                  startIcon={<LocalShippingIcon />}
                  sx={{
                    backgroundColor: "success.main",
                    "&:hover": {
                      backgroundColor: "success.dark",
                    },
                  }}
                >
                  Theo dõi đơn hàng
                </Button>
              )}
              {order.status === "pending" && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<CancelIcon />}
                  onClick={handleCancelOrder}
                  sx={{
                    borderColor: "error.main",
                    color: "error.main",
                    "&:hover": {
                      borderColor: "error.dark",
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            {/* Order summary */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: "8px",
                position: "sticky",
                top: "20px",
                bgcolor: "background.paper",
                "& .MuiDivider-root": {
                  borderColor: "divider"
                }
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Tóm tắt đơn hàng
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {order.id}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formatDate(order.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    sx={{
                      color:
                        order.status === "delivered"
                          ? "success.main"
                          : order.status === "cancelled"
                            ? "error.main"
                            : "primary.main",
                    }}
                  >
                    {order.status === "pending"
                      ? "Chờ xác nhận"
                      : order.status === "processing"
                        ? "Đang xử lý"
                        : order.status === "shipped"
                          ? "Đang giao hàng"
                          : order.status === "delivered"
                            ? "Đã giao hàng"
                            : "Đã hủy"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phương thức thanh toán
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {order.paymentMethod}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tạm tính
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formatPrice(order.subtotal)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phí vận chuyển
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {formatPrice(order.shipping)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    Tổng cộng
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600" color="primary">
                    {formatPrice(order.total)}
                  </Typography>
                </Box>

                {/* Shipping Information */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Thông tin giao hàng
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body2">
                      {order.trackingNumber ? `Mã vận đơn: ${order.trackingNumber}` : "Chưa có mã vận đơn"}
                    </Typography>
                  </Box>
                  {order.status === "shipped" && order.estimatedDelivery && (
                    <Typography variant="body2" color="text.secondary">
                      Dự kiến giao hàng: {formatDate(order.estimatedDelivery)}
                    </Typography>
                  )}
                  {order.status === "delivered" && order.deliveredDate && (
                    <Typography variant="body2" color="text.secondary">
                      Đã giao hàng: {formatDate(order.deliveredDate)}
                    </Typography>
                  )}
                </Box>

                {/* Contact Support */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Cần hỗ trợ?
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SupportIcon />}
                    onClick={handleSupport}
                    sx={{
                      mt: 1,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        backgroundColor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    Liên hệ hỗ trợ
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />

      {/* Cancel Order Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy đơn hàng..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Đóng</Button>
          <Button 
            onClick={handleCancelConfirm} 
            variant="contained" 
            color="error"
            disabled={!cancelReason.trim()}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={openSupportDialog} onClose={() => setOpenSupportDialog(false)}>
        <DialogTitle>Liên hệ hỗ trợ</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Vui lòng mô tả vấn đề bạn đang gặp phải với đơn hàng này.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Nhập nội dung cần hỗ trợ..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSupportDialog(false)}>Đóng</Button>
          <Button 
            onClick={handleSupportSubmit} 
            variant="contained" 
            color="primary"
            disabled={!supportMessage.trim()}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default OrderDetail
