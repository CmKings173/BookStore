"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Badge,
  Tooltip,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material"
import {
  NotificationsNone as NotificationsNoneIcon,
  Search as SearchIcon,
  AutoStories as AutoStoriesIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalPhone as LocalPhoneIcon,
  VerifiedUser as VerifiedUserIcon,
  Storefront as StorefrontIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ModeSelect from "../ModeSelect/ModeSelect"
import Profiles from "./Menus/Profiles"
import { selectCurrentUser } from "~/redux/user/userSlice"
import { fetchTotalItemsAPI } from "~/redux/cart/cartSlice"

function AppBar() {
  const [searchValue, setSearchValue] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useTheme()

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser)
  const totalItems = useSelector(state => state.cart.totalItems)

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTotalItemsAPI())
    }
  }, [currentUser, dispatch])

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchValue.trim())}`)
      setSearchExpanded(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded)
  }

  const handleMobileMenuClick = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  // Mobile Menu Component
  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          bgcolor: theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ color: "white" }}>
          Menu
        </Typography>
        <IconButton onClick={toggleMobileMenu} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      <List>
        {/* Search in mobile menu */}
        <ListItem>
          <TextField
            placeholder="Bạn cần tìm gì..."
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#1565c0", cursor: "pointer" }} onClick={handleSearch} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: "6px",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </ListItem>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />

        {/* Phone */}
        <ListItem 
          component="button"
          onClick={() => window.open('tel:1900633471')}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon>
            <LocalPhoneIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Gọi mua hàng"
            secondary="1900.633.471"
            sx={{
              "& .MuiListItemText-primary": { color: "white", fontWeight: 600 },
              "& .MuiListItemText-secondary": { color: "white", fontWeight: "bold" },
            }}
          />
        </ListItem>

        {/* Warranty */}
        <ListItem 
          component="button"
          onClick={() => handleMobileMenuClick('/warranty')}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon>
            <VerifiedUserIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Chính sách"
            secondary="Bảo Hành"
            sx={{
              "& .MuiListItemText-primary": { color: "white", fontWeight: 600 },
              "& .MuiListItemText-secondary": { color: "white", fontWeight: "bold" },
            }}
          />
        </ListItem>

        {/* Store */}
        <ListItem 
          component="button"
          onClick={() => handleMobileMenuClick('/stores')}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon>
            <StorefrontIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Hệ Thống"
            secondary="Cửa Hàng"
            sx={{
              "& .MuiListItemText-primary": { color: "white", fontWeight: 600 },
              "& .MuiListItemText-secondary": { color: "white", fontWeight: "bold" },
            }}
          />
        </ListItem>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />

        {/* Actions */}
        <ListItem 
          component="button"
          onClick={() => handleMobileMenuClick('/cart')}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon>
            <Badge color="warning" badgeContent={currentUser ? totalItems : 0} showZero>
              <ShoppingCartIcon sx={{ color: "white" }} />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Giỏ hàng" sx={{ "& .MuiListItemText-primary": { color: "white" } }} />
        </ListItem>

        <ListItem 
          component="button"
          onClick={() => handleMobileMenuClick('/notifications')}
          sx={{
            textAlign: 'left',
            width: '100%',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon>
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Thông báo" sx={{ "& .MuiListItemText-primary": { color: "white" } }} />
        </ListItem>
      </List>
    </Drawer>
  )

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trello?.appBarHeight || "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 1, sm: 2 },
          paddingX: { xs: 1, sm: 2 },
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0"),
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo Section - Always visible */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: { xs: "auto", sm: "200px" },
            flexShrink: 0,
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
              <AutoStoriesIcon
                sx={{
                  color: "white",
                  fontSize: { xs: "28px", sm: "32px", md: "36px" },
                }}
              />
              <Typography
                variant={isMobile ? "h6" : "h4"}
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  display: { xs: searchExpanded ? "none" : "block", sm: "block" },
                }}
              >
                {isMobile ? "BS" : "BookStore"}
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* Desktop/Tablet Search Bar */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              maxWidth: "400px",
              mx: { sm: 2, md: 3 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="Bạn cần tìm gì..."
              type="text"
              size="medium"
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "#1565c0", cursor: "pointer" }} onClick={handleSearch} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: "6px",
                  height: "45px",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "2px solid #fff" },
                },
                "& input": {
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#000",
                },
                "& input::placeholder": {
                  color: "#666",
                  opacity: 1,
                },
              }}
            />
          </Box>
        )}

        {/* Mobile Search Bar - Expandable */}
        {isMobile && searchExpanded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0"),
              display: "flex",
              alignItems: "center",
              px: 2,
              zIndex: 10,
            }}
          >
            <TextField
              placeholder="Bạn cần tìm gì..."
              type="text"
              size="small"
              fullWidth
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "#1565c0", cursor: "pointer" }} onClick={handleSearch} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mr: 1,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: "6px",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <IconButton onClick={toggleSearch} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Desktop Actions */}
        {isDesktop && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              minWidth: "600px",
              justifyContent: "flex-end",
            }}
          >
            {/* Phone Number */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <LocalPhoneIcon sx={{ color: "white", fontSize: "24px" }} />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "600", lineHeight: 1.2 }}
                >
                  Gọi mua hàng
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "bold", lineHeight: 1.2 }}
                >
                  1900.633.471
                </Typography>
              </Box>
            </Box>

            {/* Privacy Policy */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <VerifiedUserIcon sx={{ color: "white", fontSize: "24px" }} />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "600", lineHeight: 1.2 }}
                >
                  Chính sách
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "bold", lineHeight: 1.2 }}
                >
                  Bảo Hành
                </Typography>
              </Box>
            </Box>

            {/* Store System */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "6px",
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <StorefrontIcon sx={{ color: "white", fontSize: "24px" }} />
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "600", lineHeight: 1.2 }}
                >
                  Hệ Thống
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontSize: "15px", fontWeight: "bold", lineHeight: 1.2 }}
                >
                  Cửa Hàng
                </Typography>
              </Box>
            </Box>

            <ModeSelect />

            <Tooltip title="Thông báo">
              <Badge color="warning" sx={{ cursor: "pointer" }}>
                <NotificationsNoneIcon sx={{ color: "white", fontSize: "24px" }} />
              </Badge>
            </Tooltip>

            <Link to="/cart">
              <Tooltip title="Giỏ hàng">
                <Badge color="warning" badgeContent={currentUser ? totalItems : 0} sx={{ cursor: "pointer" }} showZero>
                  <ShoppingCartIcon sx={{ color: "white", fontSize: "24px" }} />
                </Badge>
              </Tooltip>
            </Link>

            <Profiles />
          </Box>
        )}

        {/* Tablet Actions - Simplified */}
        {isTablet && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ModeSelect />

            <Tooltip title="Thông báo">
              <Badge color="warning" sx={{ cursor: "pointer" }}>
                <NotificationsNoneIcon sx={{ color: "white", fontSize: "22px" }} />
              </Badge>
            </Tooltip>

            <Link to="/cart">
              <Tooltip title="Giỏ hàng">
                <Badge color="warning" badgeContent={currentUser ? totalItems : 0} sx={{ cursor: "pointer" }} showZero>
                  <ShoppingCartIcon sx={{ color: "white", fontSize: "22px" }} />
                </Badge>
              </Tooltip>
            </Link>

            <Profiles />
          </Box>
        )}

        {/* Mobile Actions */}
        {isMobile && !searchExpanded && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={toggleSearch} sx={{ color: "white" }}>
              <SearchIcon />
            </IconButton>

            <Link to="/cart">
              <Badge color="warning" badgeContent={currentUser ? totalItems : 0} showZero>
                <ShoppingCartIcon sx={{ color: "white", fontSize: "22px" }} />
              </Badge>
            </Link>

            <IconButton onClick={toggleMobileMenu} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  )
}

export default AppBar
