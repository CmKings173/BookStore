
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

import Footer from "~/components/Footer/Footer"

import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from "~/utils/constants"
import { mockBooks, mockCategories } from "~/apis/mockData"

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

function BookStore() {
  // Danh sách sách hiển thị trên trang
  const [books, setBooks] = useState(null)

  // Danh sách danh mục sách
  const [categories, setCategories] = useState([])

  // Danh mục được chọn
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Tổng số lượng sách
  const [totalBooks, setTotalBooks] = useState(null)

  // Xử lý phân trang từ url
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = Number.parseInt(query.get("page") || "1", 10)
  const navigate = useNavigate()

  const updateStateData = (res) => {
    setBooks(res.books || [])
    setTotalBooks(res.totalBooks || 0)
  }

  useEffect(() => {
    // Mock API call - thay thế bằng API thực tế
    setTimeout(() => {
      const filteredBooks =
        selectedCategory === "all" ? mockBooks : mockBooks.filter((book) => book.category === selectedCategory)

      setBooks(filteredBooks)
      setTotalBooks(filteredBooks.length)
      setCategories(mockCategories)
    }, 500)
  }, [location.search, selectedCategory])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {selectedCategory === "all" ? "Tất cả sách" : categories.find((c) => c.id === selectedCategory)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tìm thấy {totalBooks} cuốn sách
              </Typography>
            </Box>

            {books?.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Không tìm thấy sách nào trong danh mục này
                </Typography>
              </Box>
            )}

            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={book._id}>
                  <Box
                    sx={{
                      width: "100%", // Đảm bảo container có width 100%
                      height: "100%",
                    }}
                  >
                    <Card
                      sx={{
                        width: "100%", // Card chiếm 100% width của container
                        height: 480,
                        maxWidth: "100%", // Không cho phép vượt quá
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      {/* Ảnh sách - chiều cao cố định */}
                      <CardMedia
                        component="img"
                        height="180"
                        image={book.image}
                        alt={book.title}
                        sx={{
                          objectFit: "cover",
                          flexShrink: 0,
                          width: "100%", // Đảm bảo ảnh chiếm 100% width
                        }}
                      />

                      {/* Nội dung card */}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "calc(100% - 180px - 60px)",
                          overflow: "hidden",
                          width: "100%", // Đảm bảo content chiếm 100% width
                          boxSizing: "border-box", // Bao gồm padding trong width
                        }}
                      >
                        {/* Tiêu đề sách - 2 dòng cố định */}
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: "bold",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            height: "2.4em",
                            lineHeight: "1.2em",
                            mb: 1,
                            wordBreak: "break-word", // Ngắt từ nếu quá dài
                          }}
                        >
                          {book.title}
                        </Typography>

                        {/* Tác giả - 1 dòng cố định */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            height: "1.2em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mb: 1,
                            width: "100%",
                          }}
                        >
                          {book.author}
                        </Typography>

                        {/* Rating - chiều cao cố định */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1, height: "20px", width: "100%" }}>
                          <Rating value={book.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1, fontSize: "0.75rem" }}>
                            ({book.reviewCount})
                          </Typography>
                        </Box>

                        {/* Mô tả - 2 dòng cố định */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            height: "2.4em",
                            lineHeight: "1.2em",
                            mb: 2,
                            fontSize: "0.8rem",
                            wordBreak: "break-word",
                            width: "100%",
                          }}
                        >
                          {book.subtitle && book.subtitle.length > 80
                            ? `${book.subtitle.substring(0, 80)}...`
                            : book.subtitle || "Mô tả sách sẽ được cập nhật"}
                        </Typography>

                        {/* Spacer để đẩy phần giá xuống dưới */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Phần giá - cố định ở cuối */}
                        <Box sx={{ width: "100%" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, minHeight: "24px" }}>
                            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ fontSize: "1rem" }}>
                              {formatPrice(book.price)}
                            </Typography>
                            {book.originalPrice > book.price && (
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.secondary",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {formatPrice(book.originalPrice)}
                              </Typography>
                            )}
                          </Box>

                          {/* Chip trạng thái */}
                          <Box sx={{ minHeight: "24px" }}>
                            {!book.inStock && <Chip label="Hết hàng" color="error" size="small" />}
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Actions - chiều cao cố định */}
                      <CardActions
                        sx={{
                          p: 2,
                          pt: 0,
                          display: "flex",
                          gap: 1,
                          flexShrink: 0,
                          height: "60px",
                          alignItems: "center",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/detail/${book._id}`)}
                          sx={{
                            flex: 1,
                            height: "36px",
                            fontSize: "0.7rem",
                            whiteSpace: "nowrap",
                            minWidth: 0, // Cho phép button co lại
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
                            height: "36px",
                            fontSize: "0.7rem",
                            whiteSpace: "nowrap",
                            minWidth: 0, // Cho phép button co lại
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

            {/* Pagination */}
            {totalBooks > DEFAULT_ITEMS_PER_PAGE && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  size="large"
                  color="primary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBooks / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/bookstore${item.page === DEFAULT_PAGE ? "" : `?page=${item.page}`}`}
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
