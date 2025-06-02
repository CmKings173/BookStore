import { Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Divider, Chip } from "@mui/material"
import { styled } from "@mui/material/styles"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}))

const StatCard = ({ title, value, icon, trend, trendValue }) => (
  <Item elevation={3}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: "bold", my: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {trend === "up" ? (
            <TrendingUpIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
          ) : (
            <TrendingDownIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
          )}
          <Typography variant="caption" color={trend === "up" ? "success.main" : "error.main"}>
            {trendValue}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ color: "text.secondary" }}>{icon}</Box>
    </Box>
  </Item>
)

const topBooks = [
  { title: "Đắc Nhân Tâm", author: "Dale Carnegie", sold: 125, revenue: 15000000 },
  { title: "Nhà Giả Kim", author: "Paulo Coelho", sold: 98, revenue: 9310000 },
  { title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", author: "Nguyễn Nhật Ánh", sold: 87, revenue: 7395000 },
  { title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", sold: 65, revenue: 11700000 },
  { title: "Atomic Habits", author: "James Clear", sold: 54, revenue: 8100000 },
]

const monthlyStats = [
  { month: "Tháng 1", revenue: 45000000, orders: 320, books: 1250 },
  { month: "Tháng 2", revenue: 52000000, orders: 380, books: 1450 },
  { month: "Tháng 3", revenue: 48000000, orders: 350, books: 1320 },
  { month: "Tháng 4", revenue: 58000000, orders: 420, books: 1680 },
  { month: "Tháng 5", revenue: 62000000, orders: 450, books: 1820 },
  { month: "Tháng 6", revenue: 67000000, orders: 480, books: 1950 },
]

const Analytics = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Báo cáo thống kê
        </Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="time-period-label">Chọn khoảng thời gian</InputLabel>
          <Select labelId="time-period-label" id="time-period" defaultValue="6months" label="Chọn khoảng thời gian">
            <MenuItem value="1month">1 tháng</MenuItem>
            <MenuItem value="3months">3 tháng</MenuItem>
            <MenuItem value="6months">6 tháng</MenuItem>
            <MenuItem value="1year">1 năm</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng doanh thu"
            value="₫332,000,000"
            icon={<AttachMoneyIcon />}
            trend="up"
            trendValue="+12.5% so với kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng đơn hàng"
            value="2,400"
            icon={<ShoppingCartIcon />}
            trend="up"
            trendValue="+8.2% so với kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sách đã bán"
            value="9,470"
            icon={<MenuBookIcon />}
            trend="up"
            trendValue="+15.3% so với kỳ trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách hàng mới"
            value="573"
            icon={<PeopleIcon />}
            trend="down"
            trendValue="-2.1% so với kỳ trước"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Item elevation={3}>
            <Typography variant="h6" gutterBottom>
              Top 5 sách bán chạy nhất
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {topBooks.map((book, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight="medium">
                      {book.sold} cuốn
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.revenue.toLocaleString("vi-VN")}₫
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Item>
        </Grid>

        <Grid item xs={12} md={6}>
          <Item elevation={3}>
            <Typography variant="h6" gutterBottom>
              Thống kê theo tháng
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {monthlyStats.slice(-3).map((stat, index) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {stat.month}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.orders} đơn hàng • {stat.books} cuốn sách
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight="medium">
                      {stat.revenue.toLocaleString("vi-VN")}₫
                    </Typography>
                    <Chip
                      label={index === 2 ? "+8.1%" : index === 1 ? "+6.9%" : "+4.2%"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
