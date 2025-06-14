import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Unstable_Grid2"
import Paper from "@mui/material/Paper"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControl from "@mui/material/FormControl"
import Divider from "@mui/material/Divider"
// import MenuItem from "@mui/material/MenuItem"
// import Select from "@mui/material/Select"
// import InputLabel from "@mui/material/InputLabel"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
// import Chip from "@mui/material/Chip"
// import Stack from "@mui/material/Stack"

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import CloseIcon from "@mui/icons-material/Close"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import SecurityIcon from "@mui/icons-material/Security" 
import { createNewOrderAPI } from '~/apis/client'
import { useSelector,  } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'


const steps = ["Giỏ hàng", "Thông tin giao hàng", "Phương thức thanh toán", "Xác nhận đơn hàng"]

function CheckoutPage() {
  const navigate = useNavigate()
  // const currentUser = useSelector(selectCurrentUser)
  const { items: cartItems = [], selectedItems: selectedItemsArray = [] } = useSelector(state => state.cart)
  const selectedItems = new Set(Array.isArray(selectedItemsArray) ? selectedItemsArray : [])
  const [activeStep, setActiveStep] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
    note: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState("error")

  // Calculate order summary using selected items
  const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id))
  const subtotal = selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal >= 500000 ? 0 : 30000
  const totalAmount = subtotal + shipping


  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate shipping information
      const { fullName, email, phone, street, city, ward, district } = shippingInfo
      if (!fullName || !email ||!phone || !street || !city || !ward || !district) {
        setAlertMessage("Vui lòng điền đầy đủ thông tin giao hàng")
        setAlertSeverity("error")
        setAlertOpen(true)
        return  
      }
    }

    if (activeStep === 2) {
      // Validate payment method
      if (!paymentMethod) {
        setAlertMessage("Vui lòng chọn phương thức thanh toán")
        setAlertSeverity("error")
        setAlertOpen(true)
        return
      }
    }

    if (activeStep === steps.length - 1) {
      // Prepare order data
      const orderData = {
        items: selectedCartItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        totalAmount,
        shippingInfo: {
          ...shippingInfo
        },
        paymentMethod
      }
      
      console.log('Order Data:', orderData)
      
      // Call API to create order
      const createOrder = () => {
          createNewOrderAPI(orderData).then(() => {
            setAlertMessage("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.")
            setAlertSeverity("success")
            setAlertOpen(true)
            
            setTimeout(() => {
              navigate("/order-success")
            }, 2000)
          })
          .catch((error) => {
            setAlertMessage("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.")
            setAlertSeverity("error")
            setAlertOpen(true)
          })
      }
          
      createOrder()
      return
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setAlertOpen(false)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    setAlertOpen(false)
  }

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  
  const handleContinueShopping = () => {
    navigate("/cart")
  }

  // Render different steps
  const renderCartItems = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Giỏ hàng của bạn
      </Typography>

      <Paper variant="outlined" sx={{ mb: 3, borderRadius: "8px", overflow: "hidden" }}>
        {selectedCartItems.map((item, index) => (
          <Box key={item.id}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid xs={12} sm={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: "100%",
                    maxWidth: "80px",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="500">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.author}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1" color="primary" fontWeight="500">
                    {formatPrice(item.price)}
                  </Typography>
                  {item.originalPrice > item.price && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      {formatPrice(item.originalPrice)}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 1 }}>
                  <TextField
                    value={item.quantity}
                    inputProps={{
                      readOnly: true,
                      style: { textAlign: "center", padding: "5px 0" },
                    }}
                    sx={{
                      width: "40px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid xs={12} sm={2} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {index < selectedCartItems.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          sx={{
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": {
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.04)",
            },
          }}
        >
          Quay lại giỏ hàng
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )

  const renderShippingInfo = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Thông tin giao hàng
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              required
              fullWidth
              label="Họ và tên"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              required
              fullWidth
              label="Đường"
              name="street"
              value={shippingInfo.street}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Tỉnh/Thành phố"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Quận/Huyện"
              name="district"
              value={shippingInfo.district}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Phường/Xã"
              name="ward"
              value={shippingInfo.ward}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Ghi chú đơn hàng"
              name="note"
              multiline
              rows={3}
              value={shippingInfo.note}
              onChange={handleShippingInfoChange}
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": {
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.04)",
            },
          }}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )

  const renderPaymentMethod = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Phương thức thanh toán
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
        <FormControl component="fieldset">
          <RadioGroup name="payment-method" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                borderColor: paymentMethod === "COD" ? "#4caf50" : "divider",
                backgroundColor: paymentMethod === "COD" ? "rgba(76, 175, 80, 0.04)" : "transparent",
              }}
            >
              <FormControlLabel
                value="COD"
                control={<Radio color="primary" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocalShippingIcon sx={{ mr: 1, color: "#4caf50" }} />
                    <Typography variant="body1" fontWeight="500">
                      Thanh toán khi nhận hàng (COD)
                    </Typography>
                  </Box>
                }
              />
              {paymentMethod === "COD" && (
                <Typography variant="body2" sx={{ ml: 4, mt: 1, color: "text.secondary" }}>
                  Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng.
                </Typography>
              )}
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "8px",
                borderColor: paymentMethod === "BANKING" ? "#4caf50" : "divider",
                backgroundColor: paymentMethod === "BANKING" ? "rgba(76, 175, 80, 0.04)" : "transparent",
              }}
            >
              <FormControlLabel
                value="BANKING"
                control={<Radio color="primary" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccountBalanceIcon sx={{ mr: 1, color: "#4caf50" }} />
                    <Typography variant="body1" fontWeight="500">
                      Chuyển khoản ngân hàng
                    </Typography>
                  </Box>
                }
              />
              {paymentMethod === "BANKING" && (
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của
                    bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: theme => theme.palette.background.paper, borderRadius: "4px" }}>
                    <Typography variant="body2">
                      <strong>Ngân hàng:</strong> Vietinbank
                    </Typography>
                    <Typography variant="body2">
                      <strong>Số tài khoản:</strong> 101872201465
                    </Typography>
                    <Typography variant="body2">
                      <strong>Chủ tài khoản:</strong> CHU HONG MINH
                    </Typography>
                    <Typography variant="body2">
                      <strong>Nội dung:</strong> [Mã đơn hàng] - [Họ tên người mua]
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Paper>
          </RadioGroup>
        </FormControl>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderColor: "#4caf50",
            color: "#4caf50",
            "&:hover": {
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.04)",
            },
          }}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  )

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Xác nhận đơn hàng
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={12} md={10}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Thông tin giao hàng
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="500">
                {shippingInfo.fullName}
              </Typography>
              <Typography variant="body2">
                {shippingInfo.street}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
              </Typography>
              <Typography variant="body2">
                Email: {shippingInfo.email} | SĐT: {shippingInfo.phone}
              </Typography>
              {shippingInfo.note && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                  Ghi chú: {shippingInfo.note}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Phương thức thanh toán
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                {paymentMethod === "cod" && "Thanh toán khi nhận hàng (COD)"}
                {paymentMethod === "banking" && "Chuyển khoản ngân hàng"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Thanh toán
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">Tạm tính</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">Phí vận chuyển</Typography>
              <Typography variant="body1">{shipping > 0 ? formatPrice(shipping) : "Miễn phí"}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Tổng cộng
              </Typography>
              <Typography variant="h6" fontWeight="600" color="primary">
                {formatPrice(totalAmount)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              className="interceptor-loading"
              onClick={handleNext}
              sx={{
                py: 1.5,
                backgroundColor: "#4caf50",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Đặt hàng
            </Button>

            <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SecurityIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Thông tin của bạn được bảo mật an toàn
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderCartItems()
      case 1:
        return renderShippingInfo()
      case 2:
        return renderPaymentMethod()
      case 3:
        return renderOrderReview()
      default:
        return "Unknown step"
    }
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600" gutterBottom align="center">
          Thanh toán
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: activeStep >= index ? "#4caf50" : undefined,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Collapse in={alertOpen}>
          <Alert
            severity={alertSeverity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false)
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 3 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>

        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            {getStepContent(activeStep)}
          </Grid>

          <Grid xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: "8px",
                position: "sticky",
                top: "20px",
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Tóm tắt đơn hàng
              </Typography>

              <Box sx={{ mb: 2 }}>
                {selectedCartItems.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: "50px",
                        height: "50px",
                        objectFit: "contain",
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="500" noWrap>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        SL: {item.quantity}
                      </Typography>
                      <Typography variant="body2" fontWeight="500">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Tạm tính</Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Phí vận chuyển</Typography>
                <Typography variant="body2">{shipping > 0 ? formatPrice(shipping) : "Miễn phí"}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Tổng cộng
                </Typography>
                <Typography variant="subtitle1" fontWeight="600" color="primary">
                  {formatPrice(totalAmount)}
                </Typography>
              </Box>

              {shipping === 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1,
                    bgcolor: "#e8f5e9",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocalShippingIcon sx={{ color: "#4caf50", mr: 1 }} fontSize="small" />
                  <Typography variant="caption" color="#2e7d32">
                    Bạn được miễn phí vận chuyển cho đơn hàng trên 500.000đ
                  </Typography>
                </Box>
              )}


            </Paper>

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Container>
  )
}

export default CheckoutPage