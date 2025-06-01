import { Grid, Paper, Typography } from '@mui/material';
import AdminLayout from './components/AdminLayout';
import {
  TotalSales,
  TotalOrders,
  TotalUsers,
  TotalBooks,
  SalesChart,
  RecentOrders,
  TopSellingBooks
} from './components/dashboard';

function Dashboard() {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <TotalSales />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalOrders />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalUsers />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalBooks />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <SalesChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentOrders />
        </Grid>

        {/* Tables */}
        <Grid item xs={12}>
          <TopSellingBooks />
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

export default Dashboard;
