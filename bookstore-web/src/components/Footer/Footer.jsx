import { Box, Container, Grid, Typography, Link, Stack, Divider, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import InstagramIcon from "@mui/icons-material/Instagram"
import YouTubeIcon from "@mui/icons-material/YouTube"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import SecurityIcon from "@mui/icons-material/Security"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import PaymentIcon from "@mui/icons-material/Payment"

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#2c3e50",
  color: "white",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(2),
}))

const FooterLink = styled(Link)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.8)",
  textDecoration: "none",
  fontSize: "14px",
  lineHeight: "2",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#fff",
    textDecoration: "none",
  },
}))

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.8)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  margin: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: "#1565c0",
    color: "white",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}))

const FeatureBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}))

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <FooterSection>
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AutoStoriesIcon sx={{ fontSize: "32px", color: "#1565c0" }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                  BookStore
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2, lineHeight: 1.6 }}>
                Cửa hàng sách trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp hàng triệu đầu sách chất lượng với giá
                tốt nhất.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <SocialIconButton>
                  <FacebookIcon />
                </SocialIconButton>
                <SocialIconButton>
                  <TwitterIcon />
                </SocialIconButton>
                <SocialIconButton>
                  <InstagramIcon />
                </SocialIconButton>
                <SocialIconButton>
                  <YouTubeIcon />
                </SocialIconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "white" }}>
              Liên kết nhanh
            </Typography>
            <Stack spacing={0.5}>
              <FooterLink href="/">Trang chủ</FooterLink>
              <FooterLink href="/books">Sách</FooterLink>
              <FooterLink href="/categories">Danh mục</FooterLink>
              <FooterLink href="/bestsellers">Sách bán chạy</FooterLink>
              <FooterLink href="/new-releases">Sách mới</FooterLink>
              <FooterLink href="/sale">Khuyến mãi</FooterLink>
              <FooterLink href="/about">Giới thiệu</FooterLink>
              <FooterLink href="/contact">Liên hệ</FooterLink>
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "white" }}>
              Hỗ trợ khách hàng
            </Typography>
            <Stack spacing={0.5}>
              <FooterLink href="/help">Trung tâm trợ giúp</FooterLink>
              <FooterLink href="/shipping">Chính sách giao hàng</FooterLink>
              <FooterLink href="/returns">Đổi trả hàng</FooterLink>
              <FooterLink href="/warranty">Bảo hành</FooterLink>
              <FooterLink href="/payment">Thanh toán</FooterLink>
              <FooterLink href="/privacy">Bảo mật</FooterLink>
              <FooterLink href="/terms">Điều khoản</FooterLink>
              <FooterLink href="/faq">Câu hỏi thường gặp</FooterLink>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "white" }}>
              Thông tin liên hệ
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: "18px", color: "#1565c0", mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                  Ngõ 43 Lý Sơn, Ngọc Thụy, Long Biên
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: "18px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                  1900.633.471
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: "18px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                  support@bookstore.vn
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: "18px", color: "#1565c0", mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                  T2-T7: 8:00 - 22:00
                  <br />
                  CN: 9:00 - 21:00
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Features */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "white" }}>
              Cam kết của chúng tôi
            </Typography>
            <Stack spacing={1}>
              <FeatureBox>
                <SecurityIcon sx={{ fontSize: "20px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
                  Thanh toán an toàn 100%
                </Typography>
              </FeatureBox>
              <FeatureBox>
                <LocalShippingIcon sx={{ fontSize: "20px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
                  Giao hàng nhanh toàn quốc
                </Typography>
              </FeatureBox>
              <FeatureBox>
                <SupportAgentIcon sx={{ fontSize: "20px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
                  Hỗ trợ 24/7
                </Typography>
              </FeatureBox>
              <FeatureBox>
                <PaymentIcon sx={{ fontSize: "20px", color: "#1565c0" }} />
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px" }}>
                  Đa dạng phương thức thanh toán
                </Typography>
              </FeatureBox>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Footer */}
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "13px" }}>
            © {currentYear} BookStore. Tất cả quyền được bảo lưu.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <FooterLink href="/privacy" sx={{ fontSize: "13px" }}>
              Chính sách bảo mật
            </FooterLink>
            <FooterLink href="/terms" sx={{ fontSize: "13px" }}>
              Điều khoản sử dụng
            </FooterLink>
            <FooterLink href="/cookies" sx={{ fontSize: "13px" }}>
              Chính sách Cookie
            </FooterLink>
            <FooterLink href="/sitemap" sx={{ fontSize: "13px" }}>
              Sơ đồ trang web
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterSection>
  )
}

export default Footer
