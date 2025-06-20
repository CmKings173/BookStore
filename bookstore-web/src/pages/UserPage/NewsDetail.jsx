"use client"

import { useParams, Link } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Avatar,
  Chip,
  Divider,
  Paper,
  IconButton,
  Rating,
  LinearProgress,
  Tooltip,
  Grid,
  Fab,
  Breadcrumbs,
} from "@mui/material"
import {
  ArrowBack,
  Share,
  BookmarkBorder,
  ThumbUp,
  Comment,
  Visibility,
  AccessTime,
  Print,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Verified,
  Schedule,
  LocalFireDepartment,
  KeyboardArrowUp,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useState, useEffect } from "react"

// Enhanced mock data for news detail
const enhancedNewsData = {
  1: {
    id: 1,
    title: "Công nghệ AI mới nhất trong năm 2024: Cuộc cách mạng trí tuệ nhân tạo",
    summary:
      "Khám phá những tiến bộ đột phá trong lĩnh vực trí tuệ nhân tạo và ứng dụng thực tế trong cuộc sống hàng ngày.",
    image: "/placeholder.svg?height=400&width=800",
    createdAt: "15/12/2024",
    updatedAt: "16/12/2024",
    readTime: "8 phút đọc",
    category: "Công nghệ",
    views: "12.5k",
    likes: 1234,
    dislikes: 23,
    comments: 234,
    shares: 456,
    bookmarks: 789,
    rating: 4.8,
    author: {
      name: "Nguyễn Văn An",
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
      title: "Senior AI Engineer tại Google",
      bio: "Chuyên gia AI với hơn 10 năm kinh nghiệm trong lĩnh vực Machine Learning và Deep Learning.",
      followers: "15.2k",
      articles: 127,
    },
    tags: ["AI", "Machine Learning", "Technology", "Innovation", "Future Tech"],
    difficulty: "Trung bình",
    language: "Tiếng Việt",
    trending: true,
    featured: true,
    content: `
# Giới thiệu về AI 2024

Trí tuệ nhân tạo (AI) đang trải qua một cuộc cách mạng chưa từng có trong năm 2024. Với sự phát triển vượt bậc của các mô hình ngôn ngữ lớn (LLM) và công nghệ học sâu, AI đã trở thành một phần không thể thiếu trong cuộc sống hàng ngày của chúng ta.

## Những tiến bộ đột phá

### 1. Mô hình ngôn ngữ thế hệ mới
Các mô hình như GPT-4, Claude, và Gemini đã đạt được những cải tiến đáng kể về khả năng hiểu và tạo sinh nội dung. Chúng không chỉ có thể xử lý văn bản mà còn có thể:

- Phân tích hình ảnh và video
- Tạo ra code chất lượng cao
- Giải quyết các bài toán phức tạp
- Hỗ trợ sáng tạo nội dung

### 2. AI trong y tế
Ứng dụng AI trong y tế đã mang lại những thành tựu đáng kinh ngạc:

- Chẩn đoán bệnh chính xác hơn con người
- Phát triển thuốc nhanh chóng
- Phẫu thuật robot với độ chính xác cao
- Theo dõi sức khỏe cá nhân hóa

### 3. Tự động hóa và robotics
Sự kết hợp giữa AI và robotics đã tạo ra những robot thông minh có khả năng:

- Làm việc trong môi trường phức tạp
- Tương tác tự nhiên với con người
- Học hỏi và thích ứng với tình huống mới
- Thực hiện các tác vụ tinh vi

## Tác động đến xã hội

AI không chỉ thay đổi cách chúng ta làm việc mà còn ảnh hưởng sâu sắc đến:

- **Giáo dục**: Học tập cá nhân hóa và thích ứng
- **Giao thông**: Xe tự lái và quản lý giao thông thông minh
- **Môi trường**: Giám sát và bảo vệ môi trường
- **Kinh tế**: Tạo ra những ngành nghề và cơ hội mới

## Thách thức và cơ hội

Mặc dù mang lại nhiều lợi ích, AI cũng đặt ra những thách thức:

### Thách thức:
- Vấn đề đạo đức và quyền riêng tư
- Thay thế lao động con người
- Bias và công bằng trong AI
- An ninh mạng và bảo mật

### Cơ hội:
- Tăng năng suất và hiệu quả
- Giải quyết các vấn đề toàn cầu
- Cải thiện chất lượng cuộc sống
- Khám phá những khả năng mới

## Kết luận

Năm 2024 đánh dấu một bước ngoặt quan trọng trong lịch sử phát triển AI. Chúng ta đang chứng kiến sự chuyển đổi từ AI hẹp (Narrow AI) sang AI tổng quát (AGI). Điều này mở ra những khả năng vô hạn nhưng cũng đòi hỏi chúng ta phải chuẩn bị kỹ lưỡng cho tương lai.

Để thành công trong kỷ nguyên AI, chúng ta cần:
- Học hỏi và thích ứng liên tục
- Phát triển kỹ năng bổ trợ cho AI
- Tham gia vào cuộc thảo luận về đạo đức AI
- Chuẩn bị cho những thay đổi trong công việc và xã hội

AI không phải là mối đe dọa mà là công cụ mạnh mẽ giúp chúng ta xây dựng một tương lai tốt đẹp hơn.
    `,
    relatedArticles: [
      { id: 2, title: "Xu hướng thiết kế web hiện đại 2024", image: "/placeholder.svg?height=100&width=150" },
      { id: 3, title: "Phát triển ứng dụng mobile với React Native", image: "/placeholder.svg?height=100&width=150" },
    ],
  },
}

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)",
  borderRadius: 24,
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23000000" fillOpacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}))

const ContentCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  border: "1px solid rgba(0,0,0,0.05)",
  overflow: "hidden",
  "& .content-body": {
    "& h1": {
      fontSize: "2rem",
      fontWeight: 700,
      color: theme.palette.primary.main,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(4),
    },
    "& h2": {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(3),
    },
    "& h3": {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1.5),
      marginTop: theme.spacing(2),
    },
    "& p": {
      lineHeight: 1.8,
      marginBottom: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    "& ul, & ol": {
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(2),
      "& li": {
        marginBottom: theme.spacing(0.5),
        lineHeight: 1.6,
      },
    },
    "& strong": {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
  },
}))

const StickyActionBar = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 24,
  right: 24,
  padding: theme.spacing(2),
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255,255,255,0.9)",
  zIndex: 1000,
}))

const NewsDetail = () => {
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Get news data (in real app, this would be an API call)
  const news = enhancedNewsData[id]

  // Handle scroll for reading progress and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setReadingProgress(scrollPercent)
      setShowScrollTop(scrollTop > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  if (!news) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ backgroundColor: "#fafbfc" }}>
        <AppBar />
        <Container maxWidth="md" sx={{ flex: 1, py: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 6,
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h4" color="error" mb={3} fontWeight={700}>
              Không tìm thấy tin tức
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/news"
              sx={{
                borderRadius: 4,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Quay lại danh sách tin tức
            </Button>
          </Paper>
        </Container>
        <Footer />
      </Box>
    )
  }

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ backgroundColor: "#fafbfc" }}>
      <AppBar />

      {/* Reading Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={readingProgress}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: 4,
          backgroundColor: "rgba(0,0,0,0.1)",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #2196F3, #21CBF3)",
          },
        }}
      />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="text.secondary">Trang chủ</Typography>
          </Link>
          <Link to="/news" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="text.secondary">Tin tức</Typography>
          </Link>
          <Typography color="primary" fontWeight={600}>
            {news.category}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          component={Link}
          to="/news"
          startIcon={<ArrowBack />}
          sx={{
            mb: 4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.08)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
              transform: "translateX(-4px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Quay lại danh sách
        </Button>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Hero Section */}
            <HeroSection>
              <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
                {news.trending && (
                  <Chip
                    icon={<LocalFireDepartment />}
                    label="TRENDING"
                    color="error"
                    sx={{ fontWeight: 600, animation: "pulse 2s infinite" }}
                  />
                )}
                {news.featured && <Chip label="FEATURED" color="primary" sx={{ fontWeight: 600 }} />}
                <Chip label={news.category} variant="outlined" />
                <Chip
                  label={news.difficulty}
                  color={news.difficulty === "Dễ" ? "success" : news.difficulty === "Trung bình" ? "warning" : "error"}
                />
              </Stack>

              <Typography variant="h3" fontWeight={800} mb={3} sx={{ lineHeight: 1.2 }}>
                {news.title}
              </Typography>

              <Typography variant="h6" color="text.secondary" mb={4} sx={{ lineHeight: 1.6 }}>
                {news.summary}
              </Typography>

              {/* Meta Information */}
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src={news.author.avatar} sx={{ width: 56, height: 56 }} />
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {news.author.name}
                        </Typography>
                        {news.author.verified && <Verified sx={{ fontSize: 18, color: "#1976d2" }} />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {news.author.title}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {news.createdAt}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {news.readTime}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Visibility sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {news.views}
                        </Typography>
                      </Stack>
                      <Rating value={news.rating} precision={0.1} size="small" readOnly />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </HeroSection>

            {/* Article Image */}
            <Card sx={{ borderRadius: 4, mb: 4, overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={news.image}
                alt={news.title}
                sx={{ width: "100%", height: 400, objectFit: "cover" }}
              />
            </Card>

            {/* Article Content */}
            <ContentCard>
              <CardContent sx={{ p: 4 }}>
                <Box
                  className="content-body"
                  sx={{ fontSize: "1.1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: news.content
                      .split("\n")
                      .map((line) => {
                        if (line.startsWith("# ")) return `<h1>${line.substring(2)}</h1>`
                        if (line.startsWith("## ")) return `<h2>${line.substring(3)}</h2>`
                        if (line.startsWith("### ")) return `<h3>${line.substring(4)}</h3>`
                        if (line.startsWith("- ")) return `<li>${line.substring(2)}</li>`
                        if (line.includes("**") && line.includes(":**"))
                          return `<p><strong>${line.replace(/\*\*(.*?):\*\*/g, "$1:")}</strong></p>`
                        if (line.trim() === "") return "<br>"
                        return `<p>${line}</p>`
                      })
                      .join(""),
                  }}
                />

                {/* Tags */}
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {news.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      sx={{ borderRadius: 3, "&:hover": { backgroundColor: "primary.light", color: "white" } }}
                    />
                  ))}
                </Stack>

                {/* Social Actions */}
                <Divider sx={{ my: 4 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant={liked ? "contained" : "outlined"}
                      startIcon={<ThumbUp />}
                      onClick={handleLike}
                      sx={{ borderRadius: 3, textTransform: "none" }}
                    >
                      {news.likes + (liked ? 1 : 0)}
                    </Button>
                    <Button variant="outlined" startIcon={<Comment />} sx={{ borderRadius: 3, textTransform: "none" }}>
                      {news.comments}
                    </Button>
                    <Button variant="outlined" startIcon={<Share />} sx={{ borderRadius: 3, textTransform: "none" }}>
                      {news.shares}
                    </Button>
                  </Stack>
                  <Button
                    variant={bookmarked ? "contained" : "outlined"}
                    startIcon={<BookmarkBorder />}
                    onClick={handleBookmark}
                    sx={{ borderRadius: 3, textTransform: "none" }}
                  >
                    {bookmarked ? "Đã lưu" : "Lưu"}
                  </Button>
                </Stack>
              </CardContent>
            </ContentCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={4}>
              {/* Author Card */}
              <Card sx={{ borderRadius: 4, p: 3 }}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar src={news.author.avatar} sx={{ width: 80, height: 80 }} />
                  <Box textAlign="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                      <Typography variant="h6" fontWeight={600}>
                        {news.author.name}
                      </Typography>
                      {news.author.verified && <Verified sx={{ fontSize: 20, color: "#1976d2" }} />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {news.author.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      {news.author.bio}
                    </Typography>
                    <Stack direction="row" justifyContent="center" spacing={3} mb={3}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight={600}>
                          {news.author.followers}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Followers
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight={600}>
                          {news.author.articles}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Bài viết
                        </Typography>
                      </Box>
                    </Stack>
                    <Button variant="contained" fullWidth sx={{ borderRadius: 3, textTransform: "none" }}>
                      Theo dõi
                    </Button>
                  </Box>
                </Stack>
              </Card>

              {/* Share Card */}
              <Card sx={{ borderRadius: 4, p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Chia sẻ bài viết
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Tooltip title="Facebook">
                    <IconButton sx={{ backgroundColor: "#1877f2", color: "white", "&:hover": { opacity: 0.8 } }}>
                      <Facebook />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Twitter">
                    <IconButton sx={{ backgroundColor: "#1da1f2", color: "white", "&:hover": { opacity: 0.8 } }}>
                      <Twitter />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="LinkedIn">
                    <IconButton sx={{ backgroundColor: "#0077b5", color: "white", "&:hover": { opacity: 0.8 } }}>
                      <LinkedIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="WhatsApp">
                    <IconButton sx={{ backgroundColor: "#25d366", color: "white", "&:hover": { opacity: 0.8 } }}>
                      <WhatsApp />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Card>

              {/* Related Articles */}
              <Card sx={{ borderRadius: 4, p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Bài viết liên quan
                </Typography>
                <Stack spacing={2}>
                  {news.relatedArticles.map((article) => (
                    <Card
                      key={article.id}
                      component={Link}
                      to={`/news/${article.id}`}
                      sx={{
                        display: "flex",
                        p: 2,
                        borderRadius: 3,
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={article.image}
                        alt={article.title}
                        sx={{ width: 80, height: 60, borderRadius: 2, objectFit: "cover" }}
                      />
                      <CardContent sx={{ flex: 1, p: "8px 16px !important" }}>
                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                          {article.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Sticky Action Bar */}
      <StickyActionBar>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Thích">
            <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
              <ThumbUp />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lưu">
            <IconButton onClick={handleBookmark} color={bookmarked ? "primary" : "default"}>
              <BookmarkBorder />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chia sẻ">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
          <Tooltip title="In">
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>
        </Stack>
      </StickyActionBar>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      <Footer />
    </Box>
  )
}

export default NewsDetail
 