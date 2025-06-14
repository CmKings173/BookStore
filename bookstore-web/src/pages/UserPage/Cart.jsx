import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  Alert,
  Paper,
  Stack,
  Tooltip,
  Badge,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Security as SecurityIcon,
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import { fetchCartAPI, updateQuantity, removeFromCartAPI, toggleSelectItem, toggleSelectAll } from '~/redux/cart/cartSlice'
import { toast } from 'react-toastify'


const CartContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
  minHeight: "calc(100vh - 200px)",
}))

const CartItemCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
}))

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "4px",
  width: "32px",
  height: "32px",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderColor: theme.palette.primary.main,
  },
}))

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  position: "sticky",
  top: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f8f9fa",
  border: `1px solid ${theme.palette.divider}`,
}))

const SecurityBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.success.light,
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
}))

const SelectAllHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
}))

function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: cartItems = [], selectedItems: selectedItemsArray = [], loading, error } = useSelector(state => state.cart)
  const selectedItems = new Set(Array.isArray(selectedItemsArray) ? selectedItemsArray : [])

  useEffect(() => {
    dispatch(fetchCartAPI())
  }, [dispatch])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ bookId: id, quantity: newQuantity }))
  }

  const handleRemoveItem = async (bookId) => {
    try {
      await dispatch(removeFromCartAPI(bookId)).unwrap()
      await dispatch(fetchCartAPI())
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error) {
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng')
    }
  }
  const handleToggleSelectItem = (id) => {
    dispatch(toggleSelectItem(id))
  }

  const handleToggleSelectAll = () => {
    dispatch(toggleSelectAll())
  }

  // Calculations - chỉ tính cho sản phẩm được chọn
  const selectedCartItems = cartItems.filter((item) => selectedItems.has(item.id))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = selectedCartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const shippingFee = subtotal > 500000 ? 0 : 30000
  const total = subtotal + shippingFee

  // Check select all state
  const inStockItems = cartItems.filter((item) => item.inStock)
  const allInStockSelected = inStockItems.length > 0 && inStockItems.every((item) => selectedItems.has(item.id))
  const someInStockSelected = inStockItems.some((item) => selectedItems.has(item.id))

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography>Đang tải giỏ hàng...</Typography>
        </Box>
        <Footer />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Alert severity="error">{error}</Alert>
        </Box>
        <Footer />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar />

      <Box sx={{ flex: 1 }}>
        <CartContainer maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCartIcon fontSize="large" color="primary" />
              Giỏ hàng của bạn
              <Badge badgeContent={cartItems.length} color="primary" sx={{ ml: 1 }} />
            </Typography>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/home")}
              sx={{ minWidth: "150px" }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>

          {cartItems.length === 0 ? (
            // Empty Cart
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Giỏ hàng của bạn đang trống
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Hãy khám phá các cuốn sách tuyệt vời và thêm chúng vào giỏ hàng!
              </Typography>
              <Button variant="contained" size="large" onClick={() => navigate("/home")}>
                Khám phá sách ngay
              </Button>
            </Paper>
          ) : (
            // Cart with items
            <Grid container spacing={3}>
              {/* Cart Items */}
              <Grid item xs={12} md={8}>
                {/* Select All Header */}
                <SelectAllHeader>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allInStockSelected}
                        indeterminate={someInStockSelected && !allInStockSelected}
                        onChange={handleToggleSelectAll}
                        disabled={inStockItems.length === 0}
                      />
                    }
                    label={
                      <Typography variant="subtitle1" fontWeight="bold">
                        Chọn tất cả ({selectedItems.size}/{inStockItems.length} sản phẩm)
                      </Typography>
                    }
                  />

                  {selectedItems.size > 0 && (
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Đã chọn: {formatPrice(subtotal)}
                    </Typography>
                  )}
                </SelectAllHeader>

                {/* Out of stock alert */}
                {cartItems.some((item) => !item.inStock) && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Một số sản phẩm trong giỏ hàng hiện đang hết hàng. Vui lòng xóa hoặc thay thế để tiếp tục.
                  </Alert>
                )}

                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      sx={{
                        opacity: selectedItems.has(item.id) ? 1 : 0.7,
                        border: selectedItems.has(item.id) ? 2 : 1,
                        borderColor: selectedItems.has(item.id) ? "primary.main" : "divider",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Checkbox */}
                          <Grid item xs={12} sm={1}>
                            <Checkbox
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleToggleSelectItem(item.id)}
                              disabled={!item.inStock}
                              color="primary"
                            />
                          </Grid>

                          {/* Book Image */}
                          <Grid item xs={12} sm={3} md={2}>
                            <CardMedia
                              component="img"
                              image={item.image}
                              alt={item.title}
                              sx={{
                                width: "100%",
                                height: 120,
                                objectFit: "cover",
                                borderRadius: 1,
                                opacity: item.inStock ? 1 : 0.5,
                              }}
                            />
                          </Grid>

                          {/* Book Info */}
                          <Grid item xs={12} sm={5} md={5}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                mb: 0.5,
                                opacity: item.inStock ? 1 : 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Tác giả: {item.author}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Nhà xuất bản: {item.publisher} ({item.publishYear})
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Số trang: {item.pages}
                            </Typography>

                            {!item.inStock && <Chip label="Hết hàng" color="error" size="small" />}

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {formatPrice(item.price)}
                              </Typography>
                              {item.originalPrice > item.price && (
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: "line-through", color: "text.secondary" }}
                                >
                                  {formatPrice(item.originalPrice)}
                                </Typography>
                              )}
                            </Box>
                          </Grid>

                          {/* Quantity & Actions */}
                          <Grid item xs={12} sm={3} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                              {/* Quantity Controls */}
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <QuantityButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={!item.inStock || item.quantity <= 1}
                                >
                                  <RemoveIcon fontSize="small" />
                                </QuantityButton>
                                <TextField
                                  size="small"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                  disabled={!item.inStock}
                                  sx={{
                                    width: "60px",
                                    "& input": { textAlign: "center", padding: "8px" },
                                  }}
                                  inputProps={{ min: 1, max: item.maxQuantity }}
                                />
                                <QuantityButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={!item.inStock || item.quantity >= item.maxQuantity}
                                >
                                  <AddIcon fontSize="small" />
                                </QuantityButton>
                              </Box>

                              {/* Stock info */}
                              {item.inStock && (
                                <Typography variant="caption" color="text.secondary">
                                  Còn {item.maxQuantity} sản phẩm
                                </Typography>
                              )}

                              {/* Subtotal */}
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                {formatPrice(item.price * item.quantity)}
                              </Typography>

                              {/* Action Buttons */}
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Tooltip title="Xóa khỏi giỏ hàng">
                                  <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.bookId)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CartItemCard>
                  ))}
                </Stack>
              </Grid>

              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <SummaryCard>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Tóm tắt đơn hàng
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Selected items info */}
                  {selectedItems.size > 0 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Đã chọn {selectedItems.size} sản phẩm để thanh toán
                    </Alert>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Price Breakdown */}
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Tạm tính ({selectedItems.size} sản phẩm):</Typography>
                      <Typography>{formatPrice(subtotal)}</Typography>
                    </Box>

                    {savings > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", color: "success.main" }}>
                        <Typography>Tiết kiệm:</Typography>
                        <Typography>-{formatPrice(savings)}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>Phí vận chuyển:</Typography>
                      <Typography color={shippingFee === 0 ? "success.main" : "inherit"}>
                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                      </Typography>
                    </Box>

                    {/* {promoDiscount > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", color: "success.main" }}>
                        <Typography>Giảm giá:</Typography>
                        <Typography>-{formatPrice(promoDiscount)}</Typography>
                      </Box>
                    )} */}

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="h6" fontWeight="bold">
                        Tổng cộng:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatPrice(total)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Free shipping notice */}
                  {subtotal > 0 && subtotal < 500000 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển!
                    </Alert>
                  )}

                  {/* Security Badge */}
                  <SecurityBadge>
                    <SecurityIcon color="success" />
                    <Typography variant="body2" color="#fff">
                      Thanh toán an toàn & bảo mật
                    </Typography>
                  </SecurityBadge>

                  {/* Checkout Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    disabled={selectedItems.size === 0}
                    sx={{ mt: 3, py: 1.5 }}
                    onClick={() => navigate("/checkout")}
                  >
                    {selectedItems.size === 0
                      ? "Chọn sản phẩm để thanh toán"
                      : `Thanh toán (${selectedItems.size} sản phẩm)`}
                  </Button>

                  {/* Additional Info */}
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <ShippingIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Giao hàng trong 1-3 ngày làm việc
                    </Typography>
                  </Box>
                </SummaryCard>
              </Grid>
            </Grid>
          )}
        </CartContainer>
      </Box>

      <Footer />
    </Box>
  )
}

export default Cart
