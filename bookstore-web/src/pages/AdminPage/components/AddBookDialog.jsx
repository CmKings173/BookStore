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
  Divider,
} from "@mui/material"
import { useEffect, useState } from "react"
import { fetchCategoriesAPI } from "~/apis/index"

const AddBookDialog = ({ open, onClose, formData, handleChange, handleSubmit }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategoriesAPI()
        console.log('Categories response:', response)
        if (Array.isArray(response)) {
          setCategories(response)
        } else {
          console.error('Invalid categories data:', response)
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        📚 Thêm sách mới
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText sx={{ mb: 3, color: "#6b7280" }}>
          Nhập thông tin chi tiết của cuốn sách mới vào form bên dưới.
        </DialogContentText>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Thông tin cơ bản */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  name="title"
                  label="Tên sách"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="subtitle"
                  label="Phụ đề"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.subtitle}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="author"
                  label="Tác giả"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.author}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Thể loại</InputLabel>
                  <Select
                    name="categoryId"
                    value={formData.categoryId || ""}
                    label="Thể loại"
                    onChange={handleChange}
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
                  name="publisher"
                  label="Nhà xuất bản"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.publisher}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="publishYear"
                  label="Năm xuất bản"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.publishYear}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="pages"
                  label="Số trang"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.pages}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="format"
                  label="Định dạng"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.format}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="dimensions"
                  label="Kích thước"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.dimensions}
                  onChange={handleChange}
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
                  name="price"
                  label="Giá (VNĐ)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.price}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="stock"
                  label="Số lượng"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.stock}
                  onChange={handleChange}
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
                    name="inStock"
                    value={formData.inStock || ""}
                    label="Trạng thái"
                    onChange={handleChange}
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
                  name="description"
                  label="Mô tả"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="weight"
                  label="Khối lượng (g)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.weight}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="image"
                  label="URL hình ảnh"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.image}
                  onChange={handleChange}
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
          onClick={onClose}
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
          onClick={handleSubmit}
          variant="contained"
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
          Thêm sách
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddBookDialog