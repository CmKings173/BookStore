import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateOrderStatusAPI } from '~/apis';

const OrderUpdateModal = ({ open, onClose, order, onUpdateSuccess }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateOrderStatusAPI(order._id, status)
      onUpdateSuccess?.()
      onClose();
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đang xử lý'
      case 'shipping':
        return 'Đang giao hàng'
      case 'delivered':
        return 'Đã giao hàng'
      // case 'cancelled':
      //   return 'Đã hủy'
      default:
        return status
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Cập nhật trạng thái đơn hàng
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
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Mã đơn hàng: {order?._id}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="status-select-label">Trạng thái hiện tại</InputLabel>
              <Select
                labelId="status-select-label"
                value={order?.status || ''}
                label="Trạng thái hiện tại"
                disabled
              >
                <MenuItem value={order?.status}>
                  {getStatusLabel(order?.status)}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="new-status-select-label">Cập nhật trạng thái</InputLabel>
              <Select
                labelId="new-status-select-label"
                value={status}
                label="Cập nhật trạng thái"
                onChange={handleStatusChange}
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đang xử lý</MenuItem>
                <MenuItem value="shipping">Đang giao hàng</MenuItem>
                <MenuItem value="delivered">Đã giao hàng</MenuItem>
               {/* <MenuItem value="cancelled">Đã hủy</MenuItem>  */}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(theme.palette.text.secondary, 0.1),
            }
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !status}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            minWidth: '100px'
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderUpdateModal; 