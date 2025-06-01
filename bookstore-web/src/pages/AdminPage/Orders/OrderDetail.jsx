import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

const orderStatuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
];

const steps = ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Hoàn thành'];

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [status, setStatus] = useState('');

  // Fetch order details
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchOrder = async () => {
      try {
        // const response = await api.getOrder(id);
        // setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    // TODO: Implement status update
    console.log('Updating status to:', newStatus);
    setEditDialog(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">
            Chi tiết đơn hàng #{id}
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditDialog(true)}
          >
            Cập nhật trạng thái
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Order Status */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trạng thái đơn hàng
              </Typography>
              <Stepper activeStep={1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          {/* Order Information */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Giá</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Tổng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map through order items */}
                    <TableRow>
                      <TableCell>Book Title</TableCell>
                      <TableCell align="right">$20.00</TableCell>
                      <TableCell align="right">2</TableCell>
                      <TableCell align="right">$40.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="subtitle1">
                  Tổng cộng: $40.00
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin khách hàng
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography>John Doe</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography>
                    123 Street Name<br />
                    City, State 12345
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ mr: 1 }} />
                  <Typography>Credit Card (****1234)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShippingIcon sx={{ mr: 1 }} />
                  <Typography>Standard Shipping</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Status Update Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ mt: 2 }}
            >
              {orderStatuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Hủy</Button>
            <Button onClick={() => handleStatusChange(status)} variant="contained">
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default OrderDetail;
