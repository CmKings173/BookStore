import { useLocation, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Auth() {
  // location.pathname return true/false in this case
  const location = useLocation()
  // console.log('🚀 ~ Auth ~ location:', location)

  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  //login rồi mà truy cập vào login page => đá về trang board
  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to='/' replace={true} />
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      // backgroundColor: '#222222',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh',
      background: 'url(src/assets/login-background/login.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
    }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth