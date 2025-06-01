import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AdminLayout from '../components/AdminLayout';

function BookForm() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    categoryId: '',
    stockQuantity: '',
    // ... other fields
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <AdminLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {book._id ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên sách"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
              />
            </Grid>
            {/* Add other form fields */}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" type="submit">
              {book._id ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/books')}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Paper>
    </AdminLayout>
  );
}

export default BookForm;
