import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUser = async () => {
      try {
        // const response = await api.getUser(id);
        // setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditDialog(true);
  };

  const handleDelete = () => {
    setDeleteDialog(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/admin/users')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">
              Chi tiết người dùng
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* User Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.name}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      marginBottom: 16
                    }}
                  />
                  <Typography variant="h6">{user?.name}</Typography>
                  <Typography color="textSecondary">{user?.email}</Typography>
                  <Chip
                    label={user?.status}
                    color={user?.status === 'active' ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Vai trò:</strong> {user?.role}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ngày tham gia:</strong> {new Date(user?.joinDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Địa chỉ:</strong> {user?.address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong> {user?.phone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs Content */}
          <Grid item xs={12} md={8}>
            <Paper>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Đơn hàng" />
                <Tab label="Hoạt động" />
                <Tab label="Cài đặt" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đơn</TableCell>
                        <TableCell>Ngày đặt</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Map through user's orders */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography>Lịch sử hoạt động</Typography>
                {/* Add activity log */}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography>Cài đặt tài khoản</Typography>
                {/* Add account settings */}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên"
              defaultValue={user?.name}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              defaultValue={user?.email}
              sx={{ mt: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Trạng thái"
              defaultValue={user?.status}
              sx={{ mt: 2 }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Hủy</Button>
            <Button variant="contained">Lưu</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa người dùng này?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
            <Button color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}

export default UserDetail;
