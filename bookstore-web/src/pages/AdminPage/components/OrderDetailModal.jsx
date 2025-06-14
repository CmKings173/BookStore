import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import { fetchOrderDetailAPI } from '~/apis';

const OrderDetailModal = ({ open, onClose, orderId }) => {
  const theme = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const data = await fetchOrderDetailAPI(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOrderDetails();
    }
  }, [orderId, open]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipping":
        return "primary";
      case "confirmed":
        return "info";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Typography color="error">Error: {error}</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Chi tiết đơn hàng #{order._id}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.grey[500],
            '&:hover': {
              color: theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Order Status */}
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Trạng thái đơn hàng
                </Typography>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin khách hàng
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {order.shippingInfo && (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tên:</strong> {order.shippingInfo.fullName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Số điện thoại:</strong> {order.shippingInfo.phone || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {order.shippingInfo.email || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {[
                      order.shippingInfo.street,
                      order.shippingInfo.ward,
                      order.shippingInfo.city
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Shipping Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Thông tin vận chuyển
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {/* <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Phương thức vận chuyển:</strong> {order.shippingMethod}
              </Typography> */}
              <Typography variant="body2" >
                <strong>Phí vận chuyển:</strong> {order.shipping.toLocaleString('vi-VN')}₫
              </Typography>
              <Typography variant="body2">
                <strong>Ghi chú:</strong> {order.shippingInfo?.note || 'Không có'}
              </Typography>
              <Typography variant="body2">
                <strong>Thanh toán:</strong> {order.isPaid == true ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Typography>
            </Paper>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaymentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Chi tiết sản phẩm
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.title}
                              sx={{ width: 50, height: 70, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                            />
                            <Typography variant="body2">{item.title}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString('vi-VN')}₫
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: '300px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tạm tính:</Typography>
                    <Typography variant="body2">{order.subtotal.toLocaleString('vi-VN')}₫</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Phí vận chuyển:</Typography>
                    <Typography variant="body2">{order.shipping.toLocaleString('vi-VN')}₫</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Tổng cộng:</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {order.totalAmount.toLocaleString('vi-VN')}₫
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal; 