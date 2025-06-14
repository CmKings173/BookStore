import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import ModeSelect from "~/components/ModeSelect/ModeSelect"
import SvgIcon from "@mui/material/SvgIcon"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Badge from "@mui/material/Badge"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import Tooltip from "@mui/material/Tooltip"
import Profiles from "./Menus/Profiles"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import { Link } from "react-router-dom"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { useNavigate } from 'react-router-dom'
// import { fetchTotalItemsAPI } from '~/apis/client'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {fetchTotalItemsAPI } from "~/redux/cart/cartSlice"

function AppBar() {
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const [ item, setItem ] = useState(0)
  const currentUser = useSelector(selectCurrentUser)
  const totalItems = useSelector(state => state.cart.totalItems)

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchTotalItemsAPI())
    }
  }, [currentUser])

  // Thêm hàm xử lý tìm kiếm
  const handleSearch = () => {
    if (searchValue.trim()) {
      // Chuyển hướng đến trang home với search term
      navigate(`/home?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  // Thêm hàm xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center", // Sửa lỗi typo
        justifyContent: "space-around",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0"),
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left Section - Logo */}
      <Box sx={{ display: "flex", alignItems: "center", minWidth: "200px", ml: 2 }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SvgIcon component={AutoStoriesIcon} fontSize="large" sx={{ color: "white" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
              BookStore
            </Typography>
          </Box>
        </Link>
      </Box>

       <Box
        sx={{
          flex: 1,
          maxWidth: "350px",
          mx: 3,
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
                <SearchIcon sx={{ color: "#1565c0", cursor: "pointer" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: "500px",
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
              color: "#000", // Đảm bảo text luôn màu đen
            },
            "& input::placeholder": {
              color: "#666", // Placeholder màu xám
              opacity: 1,
            },
            "& .MuiInputBase-input": {
              color: "#000 !important", // Force text color to black
            },
          }}
        />
      </Box>

      {/* Right Section - Action Items */}
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
              bgcolor: "rgba(255,255,255,0.1)"
            },
            
          }}
        >
          <LocalPhoneIcon sx={{ color: "white", fontSize: "24px" }} />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: 1.2
              }}
            >
              Gọi mua hàng
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                lineHeight: 1.2
              }}
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
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: 1.2,
              }}
            >
              Chính sách
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                lineHeight: 1.2
              }}
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
            }
          }}
        >
          <StorefrontIcon sx={{ color: "white", fontSize: "24px" }} />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: 1.2,
              }}
            >
              Hệ Thống
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                lineHeight: 1.2,
              }}
            >
              Cửa Hàng
            </Typography>
          </Box>
        </Box>

        {/* Dark/Light Mode Toggle */}
        <ModeSelect />

        {/* Notifications */}
        <Tooltip title="Thông báo">
          <Badge color="warning" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon sx={{ color: "white", fontSize: "24px" }} />
          </Badge>
        </Tooltip>

        {/* Cart */}
        <Link to="/cart">
       
          <Tooltip title="Giỏ hàng">
            <Badge color="warning"  badgeContent={currentUser ? totalItems : 0}  sx={{ cursor: "pointer" }} showZero>
              <ShoppingCartIcon sx={{ color: "white", fontSize: "24px" }} />
            </Badge>
          </Tooltip>
        </Link>
        

        {/* Account Settings */}
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
