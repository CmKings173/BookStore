import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Divider
} from "@mui/material"
import { useEffect, useState } from "react"
import { updateBookAPI } from '~/apis/admin/index'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useCategories } from '~/contexts/CategoryContext'

const UpdateBookDialog = ({ open, onClose, bookData, afterCreateNewOrUpdate }) => {
  const [loading, setLoading] = useState(false)
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm()
  const { categories, loading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (open && bookData) {
      // console.log('Book Data:', bookData); // Debug log
      reset({
        title: bookData.title || '',
        subtitle: bookData.subtitle || '',
        author: bookData.author || '',
        categoryId: bookData.categoryId || '',
        publisher: bookData.publisher || '',
        publishYear: bookData.publishYear || '',
        pages: bookData.pages || '',
        format: bookData.format || '',
        dimensions: bookData.dimensions || '',
        price: bookData.price || '',
        stock: bookData.stock || '',
        inStock: bookData.inStock ?? true,
        description: bookData.description || '',
        weight: bookData.weight || '',
        image: bookData.image || ''
      })
    }
  }, [open, bookData, reset])

  const handleCloseDialog = () => {
    onClose(false)
    reset()
  }

  const submitUpdateBook = async (data) => {
    try {
      setLoading(true)
      // console.log('Data to update:', data) // Debug log 
      const response = await updateBookAPI(bookData._id, data)
      if (response) {
        toast.success('Cập nhật sách thành công')
        afterCreateNewOrUpdate()
        handleCloseDialog()
        onClose(true)
      }
    } catch (error) {
      console.error('Update error:', error) // Debug log
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sách!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.25rem",
        }}
      >
        📚 Cập nhật sách
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText sx={{ mb: 3, color: "#6b7280" }}>
          Cập nhật thông tin chi tiết của cuốn sách vào form bên dưới.
        </DialogContentText>
        <Box component="form" onSubmit={handleSubmit(submitUpdateBook)} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("title", { required: "Vui lòng nhập tên sách" })}
                  label="Tên sách"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("subtitle")}
                  label="Phụ đề"
                  type="text"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("author", { required: "Vui lòng nhập tác giả" })}
                  label="Tác giả"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.author}
                  helperText={errors.author?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel>Thể loại</InputLabel>
                  <Select
                    {...register("categoryId", { required: "Vui lòng chọn thể loại" })}
                    label="Thể loại"
                    sx={{
                      borderRadius: "12px",
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography color="error" variant="caption">
                      {errors.categoryId.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Thông tin xuất bản */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
              Thông tin xuất bản
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("publisher", { required: "Vui lòng nhập nhà xuất bản" })}
                  label="Nhà xuất bản"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.publisher}
                  helperText={errors.publisher?.message}
                  defaultValue={bookData?.publisher || ''}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("publishYear", { 
                    required: "Vui lòng nhập năm xuất bản",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Năm xuất bản phải có 4 chữ số"
                    }
                  })}
                  label="Năm xuất bản"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.publishYear}
                  helperText={errors.publishYear?.message}
                  defaultValue={bookData?.publishYear || ''}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("pages", { 
                    required: "Vui lòng nhập số trang",
                    min: {
                      value: 1,
                      message: "Số trang phải lớn hơn 0"
                    }
                  })}
                  label="Số trang"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.pages}
                  helperText={errors.pages?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("format")}
                  label="Định dạng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("dimensions")}
                  label="Kích thước"
                  type="text"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Thông tin bán hàng */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
              Thông tin bán hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("price", { 
                    required: "Vui lòng nhập giá",
                    min: {
                      value: 0,
                      message: "Giá không được âm"
                    }
                  })}
                  label="Giá (VNĐ)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  {...register("stock", { 
                    required: "Vui lòng nhập số lượng",
                    min: {
                      value: 0,
                      message: "Số lượng không được âm"
                    }
                  })}
                  label="Số lượng"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    {...register("inStock")}
                    label="Trạng thái"
                    defaultValue={true}
                    sx={{
                      borderRadius: "12px",
                    }}
                  >
                    <MenuItem value={true}>Còn hàng</MenuItem>
                    <MenuItem value={false}>Hết hàng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Thông tin bổ sung */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
              Thông tin bổ sung
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("description")}
                  label="Mô tả"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("weight", { 
                    min: {
                      value: 0,
                      message: "Khối lượng không được âm"
                    }
                  })}
                  label="Khối lượng (g)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("image")}
                  label="URL hình ảnh"
                  type="text"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleCloseDialog}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1,
            color: "#6b7280",
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(submitUpdateBook)}
          className='.interceptor-loading'
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 3,
            py: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
            },
          }}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật sách'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateBookDialog