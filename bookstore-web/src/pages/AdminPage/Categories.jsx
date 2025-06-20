import { useState, useEffect } from "react"
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
  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import CategoryIcon from "@mui/icons-material/Category"
import { getAllCategoriesAPI } from '~/apis/admin'
import AddCategoryDialog from './components/AddCategoryDialog'
import DeleteCategoryDialog from './components/DeleteCategoryDialog'

function Categories() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await getAllCategoriesAPI()
        setCategories(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddSuccess = async () => {
    try {
      setLoading(true)
      const data = await getAllCategoriesAPI()
      setCategories(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSuccess = async () => {
    try {
      setLoading(true)
      const data = await getAllCategoriesAPI()
      setCategories(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Tính toán số lượng danh mục
  const categoryStats = {
    total: categories.length,
    totalSlugs: categories.reduce((sum, category) => sum + category.slug.length, 0)
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f7fa" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="bold" 
          sx={{ 
            color: theme.palette.text.primary,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            paddingLeft: 2,
          }}
        >
          Quản lý danh mục
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và tổ chức các danh mục sách trong hệ thống
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tổng danh mục
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {categoryStats.total}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    color: theme.palette.primary.main 
                  }}
                >
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Danh mục hiển thị
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {filteredCategories.length}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                    color: theme.palette.success.main 
                  }}
                >
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tổng ký tự slug
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.info.main}>
                    {categoryStats.totalSlugs}
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1), 
                    color: theme.palette.info.main 
                  }}
                >
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" component="div">
                Tìm kiếm danh mục
              </Typography>
            </Box>
           
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                label="Tìm kiếm theo ID, tên danh mục hoặc slug..."
                variant="outlined"
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'medium',
                px: 3,
                width:'200px',
                height:'53px'
              }}
            >
              Tạo danh mục
            </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="category table">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên danh mục</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow 
                  key={category._id} 
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(odd)': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                    {category._id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{category.name}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block'
                      }}
                    >
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xóa danh mục">
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteCategory(category)}
                        sx={{ 
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.2),
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CategoryIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.primary, 0.2), mb: 2 }} />
                      <Typography variant="h6" gutterBottom>Không tìm thấy danh mục</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Không có danh mục nào phù hợp với tiêu chí tìm kiếm' : 'Chưa có danh mục nào được tạo'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setIsAddModalOpen(true)}
                          sx={{ mt: 2, borderRadius: '8px', textTransform: 'none' }}
                        >
                          Tạo danh mục đầu tiên
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Category Dialog */}
      <DeleteCategoryDialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedCategory(null)
        }}
        category={selectedCategory}
        onSuccess={handleDeleteSuccess}
      />
    </Box>
  )
}

export default Categories 