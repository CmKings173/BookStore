"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import VisibilityIcon from "@mui/icons-material/Visibility"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"

const orders = [
  {
    id: "#3102",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    date: "23/06/2024",
    total: 320000,
    status: "Đã giao",
    items: 2,
  },
  {
    id: "#3101",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    date: "22/06/2024",
    total: 150000,
    status: "Đang giao",
    items: 1,
  },
  {
    id: "#3100",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    date: "21/06/2024",
    total: 480000,
    status: "Đang xử lý",
    items: 3,
  },
  {
    id: "#3099",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    date: "20/06/2024",
    total: 95000,
    status: "Đã hủy",
    items: 1,
  },
  {
    id: "#3098",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    date: "19/06/2024",
    total: 275000,
    status: "Đã giao",
    items: 2,
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Đã giao":
      return "success"
    case "Đang giao":
      return "primary"
    case "Đang xử lý":
      return "warning"
    case "Đã hủy":
      return "error"
    default:
      return "default"
  }
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: '#242929' }}>
          Danh sách đơn hàng
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Tìm kiếm đơn hàng theo mã hoặc tên khách hàng..."
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
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Lọc theo trạng thái"
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Đã giao">Đã giao</MenuItem>
            <MenuItem value="Đang giao">Đang giao</MenuItem>
            <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Số sản phẩm</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items} cuốn</TableCell>
                <TableCell>{order.total.toLocaleString("vi-VN")}₫</TableCell>
                <TableCell>
                  <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <LocalShippingIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Orders
