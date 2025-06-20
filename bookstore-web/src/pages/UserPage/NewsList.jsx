import { Link } from "react-router-dom"
import AppBar from "~/components/AppBar/AppBar"
import Footer from "~/components/Footer/Footer"
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid,
  Button,
  Stack,
  Chip,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Fade,
  Rating,
  Tooltip,
} from "@mui/material"
import {
  AccessTime,
  Visibility,
  ArrowForward,
  BookmarkBorder,
  Share,
  TrendingUp,
  ThumbUp,
  Schedule,
  LocalFireDepartment,
  Verified,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"

// Simplified mock data
const newsList = [
  {
    id: 1,
    title: "Công nghệ AI mới nhất trong năm 2024",
    summary: "Khám phá những tiến bộ đột phá trong lĩnh vực trí tuệ nhân tạo và ứng dụng thực tế trong cuộc sống hàng ngày.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format",
    createdAt: "15/12/2024",
    readTime: "8 phút",
    category: "Công nghệ",
    views: "12.5k",
    likes: "1.2k",
    comments: "234",
    rating: 4.8,
    author: {
      name: "Nguyễn Văn An",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      verified: true,
    },
    tags: ["AI", "Machine Learning", "Technology"],
    trending: true,
  },
  {
    id: 2,
    title: "Xu hướng thiết kế web hiện đại 2024",
    summary: "Tìm hiểu về những xu hướng thiết kế web mới nhất và cách áp dụng chúng vào dự án của bạn.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop&auto=format",
    createdAt: "14/12/2024",
    readTime: "12 phút",
    category: "Thiết kế",
    views: "8.7k",
    likes: "856",
    comments: "123",
    rating: 4.6,
    author: {
      name: "Trần Thị Bình",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      verified: true,
    },
    tags: ["Design", "UX/UI", "Web Design"],
    trending: false,
  },
  {
    id: 3,
    title: "Phát triển ứng dụng mobile với React Native",
    summary: "Hướng dẫn chi tiết về cách xây dựng ứng dụng mobile đa nền tảng với React Native.",
    image: "https://tooploox.com/wp-content/uploads/2017/05/react-native.png",
    createdAt: "13/12/2024",
    readTime: "15 phút",
    category: "Lập trình",
    views: "15.2k",
    likes: "2.1k",
    comments: "345",
    rating: 4.9,
    author: {
      name: "Lê Minh Cường",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      verified: true,
    },
    tags: ["React Native", "Mobile", "JavaScript"],
    trending: true,
  },
]

// Simplified styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}))

const NewsList = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ backgroundColor: "#f5f5f5" }}>
      <AppBar />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Simple Header */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
              📰 Tin tức Công nghệ
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Cập nhật những thông tin mới nhất về công nghệ
            </Typography>
          </Box>
        </Fade>

        {/* Simple Filter */}
        <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Tất cả" variant="filled" color="primary" />
              <Chip label="Công nghệ" variant="outlined" />
              <Chip label="Thiết kế" variant="outlined" />
              <Chip label="Lập trình" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" startIcon={<Schedule />}>
                Mới nhất
              </Button>
              <Button variant="outlined" size="small" startIcon={<TrendingUp />}>
                Phổ biến
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* News Grid */}
        <Grid container spacing={3}>
          {newsList.map((news, index) => (
            <Grid item xs={12} md={6} lg={4} key={news.id}>
              <Fade in timeout={600 + index * 200}>
                <StyledCard>
                  <CardActionArea component={Link} to={`/news/${news.id}`}>
                    <CardMedia
                      component="img"
                      image={news.image}
                      alt={news.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                    
                    <CardContent sx={{ p: 3 }}>
                      {/* Category & Trending */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip 
                          label={news.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        {news.trending && (
                          <Chip 
                            label="Trending" 
                            size="small" 
                            color="error" 
                            icon={<LocalFireDepartment />}
                          />
                        )}
                      </Stack>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.3,
                        }}
                      >
                        {news.title}
                      </Typography>

                      {/* Summary */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        mb={2}
                        sx={{ 
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {news.summary}
                      </Typography>

                      {/* Author */}
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Avatar src={news.author.avatar} sx={{ width: 32, height: 32 }} />
                        <Box flex={1}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography variant="body2" fontWeight="medium">
                              {news.author.name}
                            </Typography>
                            {news.author.verified && <Verified sx={{ fontSize: 16, color: "primary.main" }} />}
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {news.createdAt}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Meta Info */}
                      <Grid container spacing={2} mb={2}>
                        <Grid item xs={4}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTime sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{news.readTime}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Visibility sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{news.views}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <ThumbUp sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{news.likes}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>

                      {/* Rating */}
                      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <Rating value={news.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          ({news.rating})
                        </Typography>
                      </Stack>

                      {/* Tags */}
                      <Stack direction="row" spacing={0.5} mb={2} flexWrap="wrap">
                        {news.tags.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ))}
                        {news.tags.length > 2 && (
                          <Chip
                            label={`+${news.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      {/* Actions */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForward />}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Đọc ngay
                        </Button>

                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Lưu bài viết">
                            <IconButton size="small">
                              <BookmarkBorder fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chia sẻ">
                            <IconButton size="small">
                              <Share fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Simple Load More */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Tải thêm bài viết
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default NewsList
