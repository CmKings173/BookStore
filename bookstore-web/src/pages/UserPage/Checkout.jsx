
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
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import InputLabel from "@mui/material/InputLabel"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import CloseIcon from "@mui/icons-material/Close"
import CreditCardIcon from "@mui/icons-material/CreditCard"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import SecurityIcon from "@mui/icons-material/Security"

const steps = ["Giỏ hàng", "Thông tin giao hàng", "Phương thức thanh toán", "Xác nhận đơn hàng"]

function CheckoutPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertSeverity, setAlertSeverity] = useState("error")

  // Mock cart items
  const cartItems = [
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      price: 299000,
      originalPrice: 350000,
      quantity: 1,
      image: "https://bizweb.dktcdn.net/thumb/grande/100/180/408/products/clean-code.jpg?v=1649847195810",
    },
    {
      id: "2",
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      price: 350000,
      originalPrice: 400000,
      quantity: 2,
      image: "https://edwardthienhoang.wordpress.com/wp-content/uploads/2021/09/pracmatic-programmer.jpg",
    },
  ]

  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
  const shipping = subtotal >= 500000 ? 0 : 30000
  const total = subtotal + shipping

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate shipping information
      const { fullName, email, phone, address, city } = shippingInfo
      if (!fullName || !email || !phone || !address || !city) {
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
      // Place order
      setAlertMessage("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.")
      setAlertSeverity("success")
      setAlertOpen(true)
      setTimeout(() => {
        navigate("/order-success")
      }, 2000)
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

    if (sameAsBilling) {
      setBillingInfo((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSameAsBillingChange = (e) => {
    setSameAsBilling(e.target.checked)
    if (e.target.checked) {
      setBillingInfo(shippingInfo)
    }
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const handleRemoveItem = (itemId) => {
    // In a real app, this would remove the item from the cart
    console.log(`Remove item ${itemId}`)
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    // In a real app, this would update the item quantity
    if (newQuantity < 1) return
    console.log(`Update item ${itemId} quantity to ${newQuantity}`)
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
        {cartItems.map((item, index) => (
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
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{ minWidth: "40px", height: "36px", borderRadius: 0 }}
                  >
                    -
                  </Button>
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
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    sx={{ minWidth: "40px", height: "36px", borderRadius: 0 }}
                  >
                    +
                  </Button>
                </Box>
              </Grid>
              <Grid xs={12} sm={2} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Typography variant="subtitle1" fontWeight="500">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.id)} sx={{ mt: 1 }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
            {index < cartItems.length - 1 && <Divider />}
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleContinueShopping}
          sx={{
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
              label="Địa chỉ"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
            />
          </Grid>
          <Grid xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <Select name="city" value={shippingInfo.city} label="Tỉnh/Thành phố" onChange={handleShippingInfoChange}>
                <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                <MenuItem value="Hải Phòng">Hải Phòng</MenuItem>
                <MenuItem value="Cần Thơ">Cần Thơ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Quận/Huyện</InputLabel>
              <Select
                name="district"
                value={shippingInfo.district}
                label="Quận/Huyện"
                onChange={handleShippingInfoChange}
              >
                <MenuItem value="Quận 1">Quận 1</MenuItem>
                <MenuItem value="Quận 2">Quận 2</MenuItem>
                <MenuItem value="Quận 3">Quận 3</MenuItem>
                <MenuItem value="Quận 4">Quận 4</MenuItem>
                <MenuItem value="Quận 5">Quận 5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Phường/Xã</InputLabel>
              <Select name="ward" value={shippingInfo.ward} label="Phường/Xã" onChange={handleShippingInfoChange}>
                <MenuItem value="Phường 1">Phường 1</MenuItem>
                <MenuItem value="Phường 2">Phường 2</MenuItem>
                <MenuItem value="Phường 3">Phường 3</MenuItem>
                <MenuItem value="Phường 4">Phường 4</MenuItem>
                <MenuItem value="Phường 5">Phường 5</MenuItem>
              </Select>
            </FormControl>
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
                borderColor: paymentMethod === "cod" ? "#4caf50" : "divider",
                backgroundColor: paymentMethod === "cod" ? "rgba(76, 175, 80, 0.04)" : "transparent",
              }}
            >
              <FormControlLabel
                value="cod"
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
              {paymentMethod === "cod" && (
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
                borderColor: paymentMethod === "banking" ? "#4caf50" : "divider",
                backgroundColor: paymentMethod === "banking" ? "rgba(76, 175, 80, 0.04)" : "transparent",
              }}
            >
              <FormControlLabel
                value="banking"
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
              {paymentMethod === "banking" && (
                <Box sx={{ ml: 4, mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                    Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của
                    bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: "4px" }}>
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

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "8px",
                borderColor: paymentMethod === "momo" ? "#4caf50" : "divider",
                backgroundColor: paymentMethod === "momo" ? "rgba(76, 175, 80, 0.04)" : "transparent",
              }}
            >
              <FormControlLabel
                value="momo"
                control={<Radio color="primary" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src="/placeholder.svg?height=24&width=24"
                      alt="MoMo"
                      sx={{ mr: 1, width: 24, height: 24 }}
                    />
                    <Typography variant="body1" fontWeight="500">
                      Thanh toán qua Ví MoMo
                    </Typography>
                  </Box>
                }
              />
              {paymentMethod === "momo" && (
                <Typography variant="body2" sx={{ ml: 4, mt: 1, color: "text.secondary" }}>
                  Bạn sẽ được chuyển đến trang thanh toán MoMo để hoàn tất giao dịch.
                </Typography>
              )}
            </Paper>
          </RadioGroup>
        </FormControl>
      </Paper>

      <Typography variant="h6" fontWeight="600" gutterBottom>
        Địa chỉ thanh toán
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
        <FormControlLabel
          control={<Checkbox checked={sameAsBilling} onChange={handleSameAsBillingChange} color="primary" />}
          label="Địa chỉ thanh toán giống với địa chỉ giao hàng"
        />

        {!sameAsBilling && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={billingInfo.fullName}
                onChange={handleBillingInfoChange}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={billingInfo.email}
                onChange={handleBillingInfoChange}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={billingInfo.phone}
                onChange={handleBillingInfoChange}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                required
                fullWidth
                label="Địa chỉ"
                name="address"
                value={billingInfo.address}
                onChange={handleBillingInfoChange}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select name="city" value={billingInfo.city} label="Tỉnh/Thành phố" onChange={handleBillingInfoChange}>
                  <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                  <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                  <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
                  <MenuItem value="Hải Phòng">Hải Phòng</MenuItem>
                  <MenuItem value="Cần Thơ">Cần Thơ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select
                  name="district"
                  value={billingInfo.district}
                  label="Quận/Huyện"
                  onChange={handleBillingInfoChange}
                >
                  <MenuItem value="Quận 1">Quận 1</MenuItem>
                  <MenuItem value="Quận 2">Quận 2</MenuItem>
                  <MenuItem value="Quận 3">Quận 3</MenuItem>
                  <MenuItem value="Quận 4">Quận 4</MenuItem>
                  <MenuItem value="Quận 5">Quận 5</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Phường/Xã</InputLabel>
                <Select name="ward" value={billingInfo.ward} label="Phường/Xã" onChange={handleBillingInfoChange}>
                  <MenuItem value="Phường 1">Phường 1</MenuItem>
                  <MenuItem value="Phường 2">Phường 2</MenuItem>
                  <MenuItem value="Phường 3">Phường 3</MenuItem>
                  <MenuItem value="Phường 4">Phường 4</MenuItem>
                  <MenuItem value="Phường 5">Phường 5</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
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

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Thông tin giao hàng
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="500">
                {shippingInfo.fullName}
              </Typography>
              <Typography variant="body2">
                {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}
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
                {paymentMethod === "credit" && "Thanh toán bằng thẻ tín dụng/ghi nợ"}
                {paymentMethod === "banking" && "Chuyển khoản ngân hàng"}
                {paymentMethod === "momo" && "Thanh toán qua Ví MoMo"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Sản phẩm đã đặt
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ display: "flex", mb: 2 }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    mr: 2,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="500">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.author}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                    <Typography variant="body2">
                      {formatPrice(item.price)} x {item.quantity}
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "8px",
              position: "sticky",
              top: "20px",
            }}
          >
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Tóm tắt đơn hàng
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">Tạm tính</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </Box>

            {discount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1" color="error">
                  Giảm giá
                </Typography>
                <Typography variant="body1" color="error">
                  -{formatPrice(discount)}
                </Typography>
              </Box>
            )}

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
                {formatPrice(total)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
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
                {cartItems.map((item) => (
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

              {discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="error">
                    Giảm giá
                  </Typography>
                  <Typography variant="body2" color="error">
                    -{formatPrice(discount)}
                  </Typography>
                </Box>
              )}

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
                  {formatPrice(total)}
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

              {activeStep === 0 && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Mã giảm giá"
                    placeholder="Nhập mã giảm giá"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <Button
                          variant="text"
                          sx={{
                            color: "#4caf50",
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "#45a049",
                            },
                          }}
                        >
                          Áp dụng
                        </Button>
                      ),
                    }}
                  />
                </Box>
              )}
            </Paper>

            {/* Secure payment info
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                bgcolor: "#f9f9f9",
              }}
            >
              <Typography variant="subtitle2" gutterBottom fontWeight="500">
                Chúng tôi chấp nhận
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Visa" size="small" />
                <Chip label="MasterCard" size="small" />
                <Chip label="JCB" size="small" />
                <Chip label="MoMo" size="small" />
              </Stack>
            </Box> */}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Container>
  )
}

export default CheckoutPage
