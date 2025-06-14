import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Unstable_Grid2"
import CardMedia from "@mui/material/CardMedia"

// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import HomeIcon from "@mui/icons-material/Home"

import { fetchNewOrderAPI } from '~/apis/client'

function OrderSuccessPage() {
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)

    // Lấy thông tin đơn hàng mới nhất
    const fetchLatestOrder = async () => {
      try {
        setLoading(true)
        const response = await fetchNewOrderAPI()
        if (response) {
          setOrderData(response)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestOrder()
  }, [])

  // Nếu đang loading hoặc chưa có dữ liệu
  if (loading || !orderData) {
    return (
      <Container disableGutters maxWidth={false}>
        <AppBar />
        <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
          <Typography>Đang tải thông tin đơn hàng...</Typography>
        </Container>
        <Footer />
      </Container>
    )
  }

  const orderNumber ="DH"+ orderData._id
  const orderDate = new Date(orderData.createdAt).toLocaleDateString("vi-VN")

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const handleContinueShopping = () => {
    navigate("/home")
  }

  const handleViewOrders = () => {
    navigate("/account/orders")
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 4,
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
          </Typography>
          <Typography variant="subtitle1" fontWeight="500">
            Mã đơn hàng: <strong>{orderNumber}</strong>
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "8px" }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Thông tin đơn hàng
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid xs={12} sm={6} md={5  }>
              <Typography variant="body2" color="text.secondary">
                Mã đơn hàng
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {orderNumber}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Ngày đặt hàng
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {orderDate}
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Phương thức thanh toán
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {orderData.paymentMethod}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Sản phẩm đã đặt
          </Typography>

          {orderData.items.map((item) => (
            <Box key={item.bookId} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    mr: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      width: "100%",
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight="500">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SL:{item.quantity}x
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" fontWeight="500">
                {formatPrice(item.price * item.quantity)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Tạm tính</Typography>
            <Typography variant="body1">{formatPrice(orderData.subtotal)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">Phí vận chuyển</Typography>
            <Typography variant="body1">{formatPrice(orderData.shipping)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600">
              Tổng cộng
            </Typography>
            <Typography variant="subtitle1" fontWeight="600" color="primary">
              {formatPrice(orderData.totalAmount)}
            </Typography>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: "8px" }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Thông tin giao hàng
          </Typography>

          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Người nhận
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {orderData.shippingInfo.fullName}
              </Typography>
              <Typography variant="body1">
                {orderData.shippingInfo.street}, {orderData.shippingInfo.ward}, {orderData.shippingInfo.district}, {orderData.shippingInfo.city}
              </Typography>
              <Typography variant="body1" gutterBottom>
                SĐT: {orderData.shippingInfo.phone}
              </Typography>
              <Typography variant="body1">Email: {orderData.shippingInfo.email}</Typography>
            </Grid>
            <Grid xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Trạng thái đơn hàng
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#4caf50",
                    mr: 1,
                  }}
                />
                <Typography variant="body1" fontWeight="500">
                  {orderData.status === 'pending' ? ' Chờ xác nhận' : orderData.status}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Dự kiến giao hàng: 3-5 ngày làm việc
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleContinueShopping}
            sx={{
              py: 1.5,
              px: 3,
              borderColor: "#4caf50",
              color: "#4caf50",
              "&:hover": {
                borderColor: "#4caf50",
                backgroundColor: "rgba(76, 175, 80, 0.04)",
              },
            }}
          >
            Tiếp tục mua sắm
          </Button>
          <Button
            variant="contained"
            startIcon={<ShoppingBagIcon />}
            onClick={handleViewOrders}
            sx={{
              py: 1.5,
              px: 3,
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Xem đơn hàng của tôi
          </Button>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 3,
            bgcolor: "#f9f9f9",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
            Cần hỗ trợ?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua email support@bookstore.com
            hoặc gọi số hotline 1900 1234.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Container>
  )
}

export default OrderSuccessPage
