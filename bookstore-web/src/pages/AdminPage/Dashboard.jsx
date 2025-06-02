
import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const StatsCard = styled(Card)(({ bgcolor }) => ({
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${bgcolor}dd 100%)`,
  color: "white",
  height: "120px",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "100px",
    height: "100px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "50%",
    transform: "translate(30px, -30px)",
  },
}))

// Mock data
const revenueData = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 48000000 },
  { month: "T4", revenue: 58000000 },
  { month: "T5", revenue: 62000000 },
  { month: "T6", revenue: 67000000 },
  { month: "T7", revenue: 71000000 },
  { month: "T8", revenue: 69000000 },
  { month: "T9", revenue: 74000000 },
  { month: "T10", revenue: 78000000 },
  { month: "T11", revenue: 82000000 },
  { month: "T12", revenue: 88000000 },
]

const bestSellingBooks = [
  { name: "Lịch Sử 7 (2021)", value: 35, color: "#FF6B9D" },
  { name: "Làm chủ bài thi MOS Excel 2016 Specialist", value: 25, color: "#C44569" },
  { name: "Tin Học 10 (2021)", value: 20, color: "#F8B500" },
  { name: "Thiên Tài Bên Trái, Kẻ Ngụ Bên Phải", value: 15, color: "#6C5CE7" },
  { name: "Khác", value: 5, color: "#A0A0A0" },
]

const COLORS = ["#FF6B9D", "#C44569", "#F8B500", "#6C5CE7", "#A0A0A0"]

function Dashboard() {
  const [timePeriod, setTimePeriod] = useState("all")
  const [stats] = useState({
    products: 20,
    orders: 102,
    revenue: 58896.02,
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const formatRevenue = (value) => {
    return `${(value / 1000000).toFixed(0)}M`
  }

  return (
        <Box>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <StatsCard bgcolor="#27ae60">
              <CardContent>
                <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                  {stats.products}
                </Typography>
                <Typography variant="h6">Sản phẩm</Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard bgcolor="#3498db">
              <CardContent>
                <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                  {stats.orders}
                </Typography>
                <Typography variant="h6">Đơn hàng</Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard bgcolor="#e74c3c">
              <CardContent>
                <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                  {formatCurrency(stats.revenue)}
                </Typography>
                <Typography variant="h6">Doanh thu (triệu)</Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: "500px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  DOANH THU
                </Typography>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Thời gian</InputLabel>
                  <Select
                    value={timePeriod}
                    label="Thời gian"
                    onChange={(e) => setTimePeriod(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="all">Toàn thời gian</MenuItem>
                    <MenuItem value="year">Năm nay</MenuItem>
                    <MenuItem value="month">Tháng này</MenuItem>
                    <MenuItem value="week">Tuần này</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Doanh thu Toàn thời gian
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatRevenue} />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Doanh thu"]} labelStyle={{ color: "#000" }} />
                  <Bar dataKey="revenue" fill="#e74c3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Best Selling Books */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "500px" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                SÁCH BÁN CHẠY
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sản phẩm bán chạy
              </Typography>

              {/* Legend */}
              <Box sx={{ mb: 2 }}>
                {bestSellingBooks.map((book, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: book.color,
                        mr: 1,
                        borderRadius: "2px",
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      {book.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Pie Chart */}
              <ResponsiveContainer width="100%" height="60%">
                <PieChart>
                  <Pie
                    data={bestSellingBooks}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bestSellingBooks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    
  )
}

export default Dashboard
