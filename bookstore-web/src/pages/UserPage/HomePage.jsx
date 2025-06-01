import { useState, useEffect } from "react"
import AppBar from "~/components/AppBar/AppBar"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Unstable_Grid2"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import CategoryIcon from "@mui/icons-material/Category"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import StarIcon from "@mui/icons-material/Star"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Rating from "@mui/material/Rating"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { styled } from "@mui/material/styles"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VisibilityIcon from "@mui/icons-material/Visibility"

import Footer from '~/components/Footer/Footer'

import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from "~/utils/constants"
import {mockBooks, mockCategories} from '~/apis/mockData'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: "12px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
  },
  "&.active": {
    color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4",
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
  }
}))

function BookStore() {
  // Danh sách sách hiển thị trên trang
  const [books, setBooks] = useState(null)

  // Danh sách danh mục sách
  const [categories, setCategories] = useState([])

  // Danh mục được chọn
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Tổng số lượng sách
  const [totalBooks, setTotalBooks] = useState(null)

  // Xử lý phân trang từ url
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  // const page = Number.parseInt(query.get('page') || '1', 10)
  const navigate = useNavigate()
  const updateStateData = (res) => {
    setBooks(res.books || [])
    setTotalBooks(res.totalBooks || 0)
  }

  useEffect(() => {
    // Mock API call - thay thế bằng API thực tế
    setTimeout(() => {
      const filteredBooks =
        selectedCategory === 'all' ? mockBooks : mockBooks.filter((book) => book.category === selectedCategory)

      setBooks(filteredBooks)
      setTotalBooks(filteredBooks.length)
      setCategories(mockCategories)
    }, 500)
  }, [location.search, selectedCategory])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  if (!books) {
    return <PageLoadingSpinner caption="Đang tải sách..." />
  }


  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar - Danh mục sách */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
              📚 Danh mục sách
            </Typography>

            <Stack direction="column" spacing={1}>
              {categories.map((category) => (
                <SidebarItem
                  key={category.id}
                  className={selectedCategory === category.id ? "active" : ""}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <CategoryIcon fontSize="small" />
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Typography variant="body2">{category.name}</Typography>
                    <Chip
                      label={category.count}
                      size="small"
                      color={selectedCategory === category.id ? "primary" : "default"}
                    />
                  </Box>
                </SidebarItem>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Bộ lọc bổ sung */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
              🔍 Bộ lọc
            </Typography>

            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <StarIcon fontSize="small" />
                Sách bán chạy
              </SidebarItem>
              <SidebarItem>
                <LocalOfferIcon fontSize="small" />
                Sách giảm giá
              </SidebarItem>
              <SidebarItem>
                <MenuBookIcon fontSize="small" />
                Sách mới
              </SidebarItem>
            </Stack>
          </Grid>

          {/* Main Content - Danh sách sách */}
          <Grid xs={12} sm={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {selectedCategory === 'all' ? 'Tất cả sách' : categories.find((c) => c.id === selectedCategory)?.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tìm thấy {totalBooks} cuốn sách
              </Typography>
            </Box>

            {books?.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='h6' color='text.secondary'>
                  Không tìm thấy sách nào trong danh mục này
                </Typography>
              </Box>
            )}

            <Grid container spacing={3}>

              {books.map((book) => (
                
                <Grid xs={12} sm={6} md={4} lg={3} key={book._id}>
                  <Stack direction="row" spacing={1}>
                    <Card
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardMedia
                        component='img'
                        height='200'
                        image={book.image}
                        alt={book.title}
                        sx={{ objectFit: 'cover' }}
                      />

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          gutterBottom
                          variant='h6'
                          component='div'
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {book.title}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' gutterBottom>
                          {book.author}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={book.rating} precision={0.1} size='small' readOnly />
                          <Typography variant='body2' sx={{ ml: 1 }}>
                            ({book.reviewCount})
                          </Typography>
                        </Box>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {book.subtitle}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant='h6' color='primary' fontWeight='bold'>
                            {formatPrice(book.price)}
                          </Typography>
                          {book.originalPrice > book.price && (
                            <Typography
                              variant='body2'
                              sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary'
                              }}
                            >
                              {formatPrice(book.originalPrice)}
                            </Typography>
                          )}
                        </Box>

                        {!book.inStock && <Chip label='Hết hàng' color='error' size='small' sx={{ mb: 1 }} />}
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                        <Button
                          size='small'
                          variant='outlined'
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/detail/${book._id}`)}
                          sx={{
                            flex: 1,
                            minHeight: '36px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap'
                          }}
                          
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          size='small'
                          variant='contained'
                          startIcon={<ShoppingCartIcon />}
                          disabled={!book.inStock}
                          sx={{
                            flex: 1,
                            minHeight: '36px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {book.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </Button>
                      </CardActions>
                    </Card>
                    </Stack>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalBooks > DEFAULT_ITEMS_PER_PAGE && (
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Pagination
                  size='large'
                  color='primary'
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBooks / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/bookstore${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Container>
  )
}

export default BookStore
