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
  Chip,
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "15/01/2024",
    orders: 5,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0987654321",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "20/02/2024",
    orders: 3,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0369852147",
    role: "Khách hàng",
    status: "Tạm khóa",
    joinDate: "10/03/2024",
    orders: 1,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0741852963",
    role: "Admin",
    status: "Hoạt động",
    joinDate: "01/01/2024",
    orders: 0,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0258147369",
    role: "Khách hàng",
    status: "Hoạt động",
    joinDate: "25/04/2024",
    orders: 8,
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Hoạt động":
      return "success"
    case "Tạm khóa":
      return "error"
    default:
      return "default"
  }
}

const getRoleColor = (role) => {
  switch (role) {
    case "Admin":
      return "primary"
    case "Khách hàng":
      return "default"
    default:
      return "default"
  }
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{color: '#242929'}}>
          Danh sách người dùng
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}>
          Thêm người dùng
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Tìm kiếm người dùng theo tên hoặc email..."
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
              "&.Mui-focused fieldset": { border: "2px solid black" },
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
            "& .MuiInputLabel-root": {
              color: "#000 !important", // Force text color to black
            },
          }} 
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Đơn hàng</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar>{user.name.charAt(0)}</Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                    variant={user.role === "Khách hàng" ? "outlined" : "filled"}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={user.status} color={getStatusColor(user.status)} size="small" />
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.orders}</TableCell>
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
    </Box>
  )
}

export default Users
