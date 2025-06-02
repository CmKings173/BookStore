"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const books = [
  {
    id: 1,
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    price: 120000,
    stock: 50,
    status: "Còn hàng",
  },
  {
    id: 2,
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "Tiểu thuyết",
    price: 95000,
    stock: 30,
    status: "Còn hàng",
  },
  {
    id: 3,
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    category: "Văn học Việt Nam",
    price: 85000,
    stock: 0,
    status: "Hết hàng",
  },
  {
    id: 4,
    title: "Sapiens: Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    category: "Lịch sử",
    price: 180000,
    stock: 25,
    status: "Còn hàng",
  },
]

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData)
    setOpen(false)
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{color: '#242929'}}>
          Danh sách sản phẩm
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Thêm sách mới
        </Button>
      </Box>

      <Box sx={{ mb: 3}}>
        <TextField
          label="Tìm kiếm sách theo tên hoặc tác giả..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: "500px",
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: "6px",
              height: "45px",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "2px solid #fff" },
            },
            "& input": {
              padding: "12px 16px",
              fontSize: "14px",
              color: "#000", // Đảm bảo text luôn màu đen
            },
            "& input::placeholder": {
              color: "#666", // Placeholder màu xám
              opacity: 1,
            },
            "& .MuiInputBase-input": {
              color: "#000 !important", // Force text color to black
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tên sách</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {book.title}
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.price.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>
                  <Chip label={book.status} color={book.status === "Còn hàng" ? "success" : "error"} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm sách mới</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Nhập thông tin sách mới vào form bên dưới.</DialogContentText>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Tên sách"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="author"
              label="Tác giả"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.author}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="category-label">Thể loại</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                label="Thể loại"
                onChange={handleChange}
              >
                <MenuItem value="Kỹ năng sống">Kỹ năng sống</MenuItem>
                <MenuItem value="Tiểu thuyết">Tiểu thuyết</MenuItem>
                <MenuItem value="Văn học Việt Nam">Văn học Việt Nam</MenuItem>
                <MenuItem value="Lịch sử">Lịch sử</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="price"
              label="Giá (VNĐ)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.price}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="stock"
              label="Số lượng"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.stock}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Mô tả"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Thêm sách
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Books
