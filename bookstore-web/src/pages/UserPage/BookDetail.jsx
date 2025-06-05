import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Unstable_Grid2"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Rating from "@mui/material/Rating"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Footer from "~/components/Footer/Footer"

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import CachedIcon from "@mui/icons-material/Cached"

// import  { mockBooks, mockCategories } from '~/apis/mockData'
import {fetchBooksDetailAPI} from '~/apis/client'
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`book-tabpanel-${index}`}
      aria-labelledby={`book-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function BookDetail() {
  const { id } = useParams()
  console.log('id: ',id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [tabValue, setTabValue] = useState(0)
  const [book, setBook] = useState(null)

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) {
        setLoading(false)
        setBook(null)
        return
      }
      setLoading(true)

      try {
        const bookData = await fetchBooksDetailAPI(id)
        console.log('bookData:', bookData)
        setBook(bookData)
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error)
        setBook(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ"
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  if (loading) {
    return <PageLoadingSpinner caption="Đang tải thông tin sách..." />
  }

  if (!book) {
    return (
      <Container disableGutters maxWidth={false}>
        <AppBar />
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Không tìm thấy sách
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
            Quay lại
          </Button>
        </Box>
        <Footer />
      </Container>
    )
  }

  // const discountPercent = book.originalPrice > book.price ? Math.round((1 - book.price / book.originalPrice) * 100) : 0

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link underline="hover" color="inherit" href="/home">
            Cửa hàng sách
          </Link>
          {/* <Link underline="hover" color="inherit" href={`/bookstore?category=${book.category}`}>
            {book.category}
          </Link> */}
          <Typography color="text.primary">{book.title}</Typography>
        </Breadcrumbs>

        {/* Back button */}
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 3 }}>
          Quay lại
        </Button>

        {/* Main product section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Product image */}
          <Grid xs={12} md={5}>
            <Paper
              elevation={1}
              sx={{
                p: 4,
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: (theme) => theme.palette.background.default,
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/*  */}
              <Box
                component="img"
                src={book.image}
                alt={book.title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Paper>

            {/* Additional product images (thumbnails) */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid #4caf50",
                  borderRadius: "4px",
                }}
              >
                <Box
                  component="img"
                  src={book.image}
                  alt={book.title}
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </Paper>
              {/* <Paper
                elevation={1}
                sx={{
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "4px",
                  opacity: 0.7,
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/placeholder.svg?height=70&width=70"
                  alt="Back cover"
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </Paper> */}
              {/* <Paper
                elevation={1}
                sx={{
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "4px",
                  opacity: 0.7,
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src="/placeholder.svg?height=70&width=70"
                  alt="Table of contents"
                  sx={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </Paper> */}
            </Box>
          </Grid>

          {/* Product info */}
          <Grid xs={12} md={7}>
            <Box>
            {/* Title */}
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600" sx={{ mb: 1 }}>
                {book.title}
              </Typography>
              {/* Category chip */}
              <Chip
                label={book.categoryName}
                size="small"
                sx={{
                  mb: 2,
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: 500,
                }}
              />
            
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {book.subtitle}
              </Typography>

              {/* Rating
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating value={4.5} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1, color: "#f57c00", fontWeight: "500" }}>
                  4.5
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (125 đánh giá)
                </Typography>
              </Box> */}

              <Divider sx={{ my: 2 }} />

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 1 }}>
                  <Typography variant="h4" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                    {formatPrice(book.price)}
                  </Typography>
                </Box>
              </Box>

              {/* Author */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Tác giả:</strong>{" "}
                  <Link href="#" underline="hover" sx={{ color: "#1976d2", fontWeight: "500" }}>
                    {book.author}
                  </Link>
                </Typography>
              </Box>

              {/* Publisher */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Nhà xuất bản:</strong>{" "}
                  <span>
                    {book.publisher} - {book.publishYear}
                  </span>
                </Typography>
              </Box>

              {/* Format */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Định dạng:</strong> {book.format}, {book.pages} trang
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Quantity selector */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Typography variant="body1" sx={{ mr: 3, fontWeight: "500" }}>
                  Số lượng:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{
                      minWidth: "40px",
                      height: "40px",
                      borderRadius: "4px 0 0 4px",
                      color: "#555",
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <TextField
                    value={quantity}
                    inputProps={{
                      readOnly: true,
                      style: { textAlign: "center", fontWeight: "500" },
                    }}
                    sx={{
                      width: "60px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { border: "none" },
                      },
                      "& .MuiOutlinedInput-input": { py: 1 },
                    }}
                  />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= book?.stock}
                    sx={{
                      minWidth: "40px",
                      height: "40px",
                      borderRadius: "0 4px 4px 0",
                      color: "#555",
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Box>

                {/* Stock status */}
                <Box sx={{ ml: 3 }}>
                  {book.inStock ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "#4caf50", fontWeight: "500", display: "flex", alignItems: "center" }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#4caf50",
                          display: "inline-block",
                          mr: 1,
                        }}
                      ></Box>
                      Còn hàng ({book.stock} sản phẩm)
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#f44336", fontWeight: "500", display: "flex", alignItems: "center" }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#f44336",
                          display: "inline-block",
                          mr: 1,
                        }}
                      ></Box>
                      Hết hàng
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Action buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  disabled={!book.inStock}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    borderRadius: "4px",
                    fontWeight: "500",
                    "&:hover": {
                      borderColor: "#4caf50",
                      backgroundColor: "rgba(76, 175, 80, 0.04)",
                    },
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!book.inStock}
                  sx={{
                    py: 1.5,
                    px: 4,
                    backgroundColor: "#4caf50",
                    borderRadius: "4px",
                    fontWeight: "500",
                    boxShadow: "0 4px 6px rgba(76, 175, 80, 0.2)",
                    "&:hover": {
                      backgroundColor: "#45a049",
                      boxShadow: "0 6px 10px rgba(76, 175, 80, 0.3)",
                    },
                  }}
                >
                  Mua ngay
                </Button>
               
              </Stack>

              {/* Shipping info */}
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: "8px",
                  backgroundColor: (theme) => theme.palette.background.default,
                }}
              >
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Giao hàng miễn phí</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Bảo hành chính hãng</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} sm={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CachedIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">Đổi trả trong 30 ngày</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs for additional information */}
        <Box sx={{ mb: 6 }}>
          <Paper sx={{ width: "100%", borderRadius: "8px", overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="book details tabs"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  py: 2,
                  fontWeight: 500,
                },
                "& .Mui-selected": {
                  color: "#4caf50 !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#4caf50",
                },
              }}
            >
              <Tab label="Mô tả chi tiết" id="book-tab-0" />
              <Tab label="Thông số kỹ thuật" id="book-tab-1" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                {book.description}
              </Typography>

            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableBody>
                    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: (theme) => theme.palette.action.hover } }}>
                      <TableCell sx={{ fontWeight: "500", width: "30%" }}>Tác giả</TableCell>
                      <TableCell>{book.author}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "500" }}>Nhà xuất bản</TableCell>
                      <TableCell>{book.publisher}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: (theme) => theme.palette.action.hover } }}>
                      <TableCell sx={{ fontWeight: "500" }}>Năm xuất bản</TableCell>
                      <TableCell>{book.publishYear}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "500" }}>Số trang</TableCell>
                      <TableCell>{book.pages}</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: (theme) => theme.palette.action.hover } }}>
                      <TableCell sx={{ fontWeight: "500" }}>Kích thước</TableCell>
                      <TableCell>{book.dimensions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "500" }}>Trọng lượng</TableCell>
                      <TableCell>{book.weight}g</TableCell>
                    </TableRow>
                    <TableRow sx={{ "&:nth-of-type(odd)": { backgroundColor: (theme) => theme.palette.action.hover } }}>
                      <TableCell sx={{ fontWeight: "500" }} >Định dạng</TableCell>
                      <TableCell>{book.format}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </Paper>
        </Box>

        {/* Recommended books section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
            Sách liên quan
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid xs={12} sm={6} md={3} key={item}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderRadius: "8px",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: (theme) => theme.palette.background.default,
                      p: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src="/placeholder.svg?height=180&width=120"
                      alt="Related book"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      sx={{
                        fontWeight: "600",
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item === 1
                        ? "The Pragmatic Programmer"
                        : item === 2
                          ? "Design Patterns"
                          : item === 3
                            ? "Refactoring"
                            : "Code Complete"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item === 1
                        ? "David Thomas"
                        : item === 2
                          ? "Gang of Four"
                          : item === 3
                            ? "Martin Fowler"
                            : "Steve McConnell"}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#4caf50", fontWeight: "bold", mb: 1 }}>
                      {formatPrice(item * 100000)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: "#4caf50",
                        color: "#4caf50",
                        "&:hover": {
                          borderColor: "#4caf50",
                          backgroundColor: "rgba(76, 175, 80, 0.04)",
                        },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Container>
  )
}

export default BookDetail
