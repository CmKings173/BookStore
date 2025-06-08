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
import Pagination from "@mui/material/Pagination"
// import PaginationItem from "@mui/material/PaginationItem"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { styled } from "@mui/material/styles"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE} from '~/utils/constants'
import Footer from "~/components/Footer/Footer"
import { fetchBooksAPI, fetchCategoriesAPI, searchBooksAPI } from '~/apis/index'
import CircularProgress from "@mui/material/CircularProgress"


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
  },
}))

function HomePage() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [totalBooks, setTotalBooks] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = Number.parseInt(query.get("page") || "1", 10)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategoriesAPI()
      .then(res => {
        if (res && res.data) {
          setCategories(res.data)
        } else if (res && Array.isArray(res)) {
          setCategories(res)
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err)
      })
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const query = new URLSearchParams(location.search)
        const categorySlug = query.get('category')
        const searchQuery = query.get('search')
        
        let categoryId = "all"
        if (categorySlug) {
          const category = categories.find(c => 
            c.slug === categorySlug || 
            c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
          )
          if (category) {
            categoryId = category._id
          }
        }
        
        setSelectedCategory(categoryId)
        
        let url = `?page=${page}&itemsPerPage=${DEFAULT_ITEMS_PER_PAGE}`
        if (categoryId !== "all") {
          url += `&categoryId=${categoryId}`
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`
        }
        
        // Sử dụng searchBooksAPI nếu có search term, ngược lại dùng fetchBooksAPI
        const res = searchQuery 
          ? await searchBooksAPI(url)
          : await fetchBooksAPI(url)
        
        setBooks(res.books || [])
        setTotalBooks(res.totalBooks || 0)
      } catch (err) {
        console.error('Error fetching books:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [page, location.search, categories])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    const category = categories.find(c => c._id === categoryId)
    const categorySlug = categoryId === "all" ? "" : category?.slug || category?.name.toLowerCase().replace(/\s+/g, '-')
    
    let newUrl = `/home`
    if (categoryId !== "all" || searchQuery) {
      newUrl += '?'
      if (categoryId !== "all") {
        newUrl += `page=${DEFAULT_PAGE}&category=${categorySlug}`
      }
      if (searchQuery) {
        newUrl += `${categoryId !== "all" ? '&' : ''}search=${searchQuery}`
      }
    }
    
    navigate(newUrl)
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
              {/* Mục tất cả sách */}
              <SidebarItem
                key="all"
                className={selectedCategory === "all" ? "active" : ""}
                onClick={() => handleCategoryChange("all")}
              >
                <CategoryIcon fontSize="small" />
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <Typography variant="body2">Tất cả sách</Typography>
                </Box>
              </SidebarItem>
              {/* {console.log('Rendering categories:', categories)} */}
              {categories.map((category) => (
                <SidebarItem
                  key={category._id}
                  className={selectedCategory === category._id ? "active" : ""}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  <CategoryIcon fontSize="small" />
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Typography variant="body2">{category.name}</Typography>
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
           
          {/* Main Content - Danh sách book*/}
          <Grid xs={12} sm={9}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {searchQuery 
                  ? `Kết quả tìm kiếm cho "${searchQuery}"`
                  : selectedCategory === "all" 
                    ? "Tất cả sách" 
                    : categories.find((c) => c._id === selectedCategory)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tìm thấy {totalBooks} cuốn sách
              </Typography>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : books.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {searchQuery 
                    ? `Không tìm thấy sách nào với từ khóa "${searchQuery}"`
                    : "Không tìm thấy sách nào trong danh mục này"}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {books.map((book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={book._id}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          maxWidth: "220px",
                          height: 360,
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={book.image}
                          alt={book.title}
                          sx={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                            background: "#f5f5f5",
                          }}
                        />
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            width: "100%",
                            boxSizing: "border-box",
                            minHeight: "80px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: "bold",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              height: "2.4em",
                              lineHeight: "1.2em",
                              mb: 0.25,
                              wordBreak: "break-word",
                            }}
                          >
                            {book.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              height: "1.2em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mb: 1.25,
                              fontSize: "0.8rem",
                            }}
                          >
                            {book.author}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              height: "1.2em",
                              lineHeight: "1.2em",
                              mb: 0.5,
                              fontSize: "0.75rem",
                              wordBreak: "break-word",
                              width: "100%",
                            }}
                          >
                            {book.subtitle && book.subtitle.length > 60
                              ? `${book.subtitle.substring(0, 60)}...`
                              : book.subtitle || "Mô tả sách sẽ được cập nhật"}
                          </Typography>

                          <Box sx={{ flexGrow: 0.5 }} />

                          <Box sx={{ width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mb: 0, minHeight: "24px" }}>
                              <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                                {formatPrice(book.price)}
                              </Typography>
                              {book.originalPrice > book.price && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "text.secondary",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {formatPrice(book.originalPrice)}
                                </Typography>
                              )}
                            </Box>

                            {/* <Box sx={{ minHeight: "16px" }}>
                              {!book.inStock && <Chip label="Hết hàng" color="error" size="0.5rem" />}
                            </Box> */}
                          </Box>
                        </CardContent>

                        <CardActions
                          sx={{
                            p: 1,
                            pt: 0,
                            display: "flex",
                            gap: 0.5,
                            flexShrink: 0,
                            height: "48px",
                            alignItems: "center",
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: "auto",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate(`/book-detail/${book._id}`)}
                            sx={{
                              flex: 1,
                              height: "32px",
                              fontSize: "0.65rem",
                              whiteSpace: "nowrap",
                              minWidth: 0,
                            }}
                          >
                            Xem chi tiết
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            disabled={!book.inStock}
                            sx={{
                              flex: 1,
                              height: "32px",
                              fontSize: "0.65rem",
                              whiteSpace: "nowrap",
                              minWidth: 0,
                            }}
                          >
                            {book.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                          </Button>
                        </CardActions>
                      </Card>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalBooks > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(totalBooks / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  onChange={(e, value) => {
                    const categoryName = selectedCategory === "all" ? "" : 
                      categories.find(c => c._id === selectedCategory)?.name
                    
                    let newUrl = `/home`
                    if (value !== 1 || categoryName || searchQuery) {
                      newUrl += '?'
                      if (value !== 1) {
                        newUrl += `page=${value}`
                      }
                      if (categoryName) {
                        newUrl += `${value !== 1 ? '&' : ''}category=${categoryName}`
                      }
                      if (searchQuery) {
                        newUrl += `${value !== 1 || categoryName ? '&' : ''}search=${searchQuery}`
                      }
                    }
                    navigate(newUrl)
                  }}
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

export default HomePage
