import { useState, useEffect } from "react"
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
  Pagination,
  PaginationItem,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import InventoryIcon from "@mui/icons-material/Inventory"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import FilterListIcon from "@mui/icons-material/FilterList"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { fetchBooksAPI, fetchCategoriesAPI, searchBooksAPI } from '~/apis/index'
import { deleteBookAPI } from '~/apis/admin/index'
import AddBookDialog from './components/AddBookDialog'
import DeleteBookDialog from './components/DeleteBookDialog'
import { toast } from 'react-toastify'
import UpdateBookDialog from './components/UpdateBookDialog'
import {DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE} from '~/utils/constants'


// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
  "& .MuiTable-root": {
    "& .MuiTableHead-root": {
      "& .MuiTableRow-root": {
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        "& .MuiTableCell-root": {
          fontWeight: "bold",
          color: "#2c3e50",
          borderBottom: "none",
          padding: "20px 16px",
        },
      },
    },
    "& .MuiTableBody-root": {
      "& .MuiTableRow-root": {
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: theme.palette.mode === "dark" 
            ? "rgba(255, 255, 255, 0.05)" 
            : "rgba(102, 126, 234, 0.04)",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          "& .MuiTableCell-root": {
            color: theme.palette.mode === "dark" 
              ? "#90caf9" 
              : "#667eea",
          },
        },
        "& .MuiTableCell-root": {
          borderBottom: "1px solid #f0f0f0",
          padding: "16px",
          transition: "color 0.3s ease",
        },
      },
    },
  },
}))

const SearchBox = styled(Box)(({ theme }) => ({
  background: "white",
  borderRadius: "12px",
  padding: "8px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  border: "1px solid #e8e8e8",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  },
}))

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: color === "edit" ? "#e3f2fd" : "#ffebee",
    transform: "scale(1.1)",
  },
}))

function Books() {
  
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [open, setOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    subtitle: "",
    description: "",
    price: "",
    categoryId:"",
    stock: "",
    publisher: "",
    publishYear: "",
    pages: "",
    image:"",
    format: "",
    dimensions:"",
    weight:"",
    inStock: ""
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  // Thêm debounce cho search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 700) // Đợi 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Cập nhật URL khi debouncedSearchTerm thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const newSearch = new URLSearchParams(location.search)
        if (debouncedSearchTerm) {
          newSearch.set('search', debouncedSearchTerm)
        } else {
          newSearch.delete('search')
        }
        newSearch.set('page', '1') // Reset về trang 1 khi search
        
        // Sử dụng API tìm kiếm nếu có từ khóa
        const apiUrl = `?${newSearch.toString()}`
        // console.log('Searching with URL:', apiUrl)
        
        let result
        if (debouncedSearchTerm) {
          result = await searchBooksAPI(apiUrl)
          // console.log('Search result:', result)
        } else {
          result = await fetchBooksAPI(apiUrl)
          // console.log('Fetch result:', result)
        }
        
        if (result && result.books) {
          setBooks(result.books)
          setTotalBooks(result.totalBooks)
          setError(null)
        } else {
          console.log('Invalid response format:', result)
          setBooks([])
          setTotalBooks(0)
          setError('Không thể tải dữ liệu sách')
        }
        
        navigate(`/admin/books${apiUrl}`)
      } catch (error) {
        // console.error('Lỗi khi tải dữ liệu:', error)
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
        setBooks([])
        setTotalBooks(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debouncedSearchTerm])

  // Thêm lại useEffect cho pagination và category filter
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const query = new URLSearchParams(location.search)
        const pageFromUrl = parseInt(query.get('page')) || DEFAULT_PAGE
        setPage(pageFromUrl)

        // Thiết lập category filter từ URL
        const categoryIdFromUrl = query.get('categoryId')
        if (categoryIdFromUrl) {
          setCategoryFilter(categoryIdFromUrl)
        } else {
          setCategoryFilter("")
        }

        // Lấy sách với tham số tìm kiếm hiện tại
        const currentSearch = query.get('search') || ''
        setSearchTerm(currentSearch)
        
        const searchParams = new URLSearchParams(location.search)
        const apiUrl = `?${searchParams.toString()}`
        // console.log('Fetching books with URL:', apiUrl)
        
        const booksRes = await fetchBooksAPI(apiUrl)
        // console.log('Books response:', booksRes)
        
        if (booksRes && booksRes.books) {
          setBooks(booksRes.books)
          setTotalBooks(booksRes.totalBooks)
          setError(null)
        } else {
          console.log('Invalid response format:', booksRes)
          setBooks([])
          setTotalBooks(0)
          setError('Không thể tải dữ liệu sách')
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err)
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
        setBooks([])
        setTotalBooks(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [location.search])

  // Tách riêng việc fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await fetchCategoriesAPI()
        if (categoriesRes && categoriesRes.data) {
          setCategories(categoriesRes.data)
        } else if (categoriesRes && Array.isArray(categoriesRes)) {
          setCategories(categoriesRes)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Không thể tải danh mục sách. Vui lòng thử lại sau.')
      }
    }

    fetchCategories()
  }, []) // Chỉ chạy một lần khi component mount

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      title: "",
      author: "",
      subtitle: "",
      description: "",
      price: "",
      categoryId:"",
      stock: "",
      publisher: "",
      publishYear: "",
      pages: "",
      image:"",
      format: "",
      dimensions:"",
      weight:"",
      inStock: ""
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDeleteClick = (book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteBookAPI(bookToDelete._id)
      toast.success('Xóa sách thành công!')
      setDeleteDialogOpen(false)
      setBookToDelete(null)
      // Fetch lại danh sách sách
      fetchBooksAPI(location.search).then(updateStateData)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa sách!')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setBookToDelete(null)
  }

  const handleUpdateClick = (book) => {
    setSelectedBook(book)
    setOpenUpdateDialog(true)
  }

  const handleUpdateClose = (success) => {
    setOpenUpdateDialog(false)
    if (success) {
      fetchBooksAPI(location.search).then(updateStateData)
    }
    setSelectedBook(null)
  }

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value
    setCategoryFilter(newCategory)
    
    const newSearch = new URLSearchParams(location.search)
    if (newCategory) {
      newSearch.set('categoryId', newCategory)
    } else {
      newSearch.delete('categoryId')
    }
    newSearch.set('page', '1')
    navigate(`/admin/books?${newSearch.toString()}`)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const updateStateData = (res) => {
    if (res && res.books) {
      // Nếu có dữ liệu hợp lệ
      setBooks(res.books) // Cập nhật danh sách sách
      setTotalBooks(res.totalBooks) // Cập nhật tổng số sách
      setError(null) // Xóa lỗi nếu có
    } else {
      // Nếu không có dữ liệu hoặc dữ liệu không hợp lệ
      setBooks([]) // Reset danh sách sách
      setTotalBooks(0) // Reset tổng số sách
      setError('Không thể tải dữ liệu sách') // Set lỗi
    }
  }

  const afterCreateNewOrUpdate = () => {
    fetchBooksAPI(location.search).then(updateStateData)
  }

  const inStockBooks = books?.filter((book) => book.inStock === true).length || 0

  // Tính tổng giá trị kho
  const totalValue = books?.reduce((sum, book) => {
    return sum + (book.price * book.stock) // Giá * Số lượng
  }, 0) || 0

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Thử lại
        </Button>
      </Box>
    )
  }

  if (!books || books.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Không có dữ liệu sách</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#1a202c",
            mb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📚 Quản lý sách
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý toàn bộ kho sách của cửa hàng
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Zoom in timeout={300}>
            <StyledCard>
              <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 56, height: 56 }}>
                  <MenuBookIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {totalBooks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tổng số sách
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Zoom in timeout={400}>
            <StyledCard sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 56, height: 56 }}>
                  <InventoryIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {inStockBooks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Còn hàng
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Zoom in timeout={500}>
            <StyledCard sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2, width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {(totalValue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Giá trị kho
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>
      </Grid>

      {/* Controls */}
      <Fade in timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "600", color: "#2d3748" }}>
              Danh sách sản phẩm ({books.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "600",
                px: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Thêm sách mới
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <SearchBox sx={{ flex: 1, minWidth: "300px" }}>
              <TextField
                placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "none",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                    "& .MuiInputBase-input": {
                      color: theme => theme.palette.mode === 'dark' ? '#fff' : '#2d3748',
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af',
                      opacity: 1,
                    },
                  },
                  "& .Mui-focused": {
                    "& .MuiInputBase-input": {
                      color: theme => theme.palette.mode === 'dark' ? '#fff' : '#2d3748',
                    },
                  },
                }}
              />
            </SearchBox>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FilterListIcon fontSize="small" />
                  Lọc theo thể loại
                </Box>
              </InputLabel>
              <Select
                value={categoryFilter}
                label="Lọc theo thể loại"
                onChange={handleCategoryChange}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Fade>

      {/* Table */}
      <Fade in timeout={800}>
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Sách</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books?.map((book, index) => (
                <Fade in timeout={300 + index * 100} key={book.id}>
                  <TableRow >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={book.image} variant="rounded" sx={{ width: 45, height: 60, bgcolor: "#f0f0f0" }}>
                          📖
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: "600", color: theme => theme.palette.mode === 'dark'? '#fff':"#2d3748" }}>
                            {book.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {book._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: theme => theme.palette.mode === 'dark'? '#fff':"#2d3748" }}>
                        {book.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={book.category.name}
                        size="small"
                        sx={{
                          backgroundColor: "#e6fffa",
                          color: "#065f46",
                          fontWeight: "500",
                          borderRadius: "8px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "500", color: theme => theme.palette.mode === 'dark'? '#fff':"#2d3748" }}>
                        {book.price.toLocaleString("vi-VN")}₫
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "600",
                          color: book.stock > 10 ? "#059669" : book.stock > 0 ? "#d97706" : "#dc2626",
                        }}
                      >
                        {book.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={book.inStock === true ? "Còn hàng" : "Hết hàng"}
                        color={book.inStock === true ? "success" : "error"}
                        size="small"
                        sx={{ borderRadius: "8px", fontWeight: "500" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Tooltip title="Chỉnh sửa" arrow>
                          <ActionButton color="edit" size="small" onClick={() => handleUpdateClick(book)}>
                            <EditIcon fontSize="small" sx={{ color: "#3b82f6" }} />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="Xóa sách" arrow>
                          <ActionButton 
                            color="delete" 
                            size="small"
                            onClick={() => handleDeleteClick(book)}
                          >
                            <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                          </ActionButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Fade>

      {/* Pagination */}
      {totalBooks > 0 && (
        <Box sx={{ mt: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Pagination
            size="large"
            color="primary"
            showFirstButton
            showLastButton
            count={Math.ceil(totalBooks / DEFAULT_ITEMS_PER_PAGE)}
            page={page}
            renderItem={(item) => {
              const newSearch = new URLSearchParams(location.search)
              
              // Cập nhật page
              if (item.page === DEFAULT_PAGE) {
                newSearch.delete('page')
              } else {
                newSearch.set('page', item.page)
              }

              // Giữ lại category nếu có
              const currentCategory = newSearch.get('categoryId')
              if (currentCategory) {
                newSearch.set('categoryId', currentCategory)
              }

              return (
                <PaginationItem
                  component={Link}
                  to={`/admin/books${newSearch.toString() ? `?${newSearch.toString()}` : ''}`}
                  {...item}
                />
              )
            }}
          />
        </Box>
      )}

      {/* Dialog */}
      <AddBookDialog
        open={open}
        onClose={handleClose}
        formData={formData}
        handleChange={handleChange}
        afterCreateNewOrUpdate={afterCreateNewOrUpdate}
      />

      <DeleteBookDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        book={bookToDelete}
        onConfirm={handleDeleteConfirm}
      />

      <UpdateBookDialog
        open={openUpdateDialog}
        onClose={handleUpdateClose}
        bookData={selectedBook}
        afterCreateNewOrUpdate={afterCreateNewOrUpdate}
      />
    </Box>
  )
}

export default Books
