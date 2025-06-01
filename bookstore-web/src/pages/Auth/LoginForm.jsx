import { useForm } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Link as MuiLink,
  Zoom
} from '@mui/material'
import Alert from '@mui/material/Alert'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

import {useDispatch} from 'react-redux'
import { toast } from 'react-toastify'
import { loginUserAPI } from '~/redux/user/userSlice'
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const [focusField, setFocusField] = useState(null)

  const submitLogin = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in ...' }
    ).then(res => {
      // console.log(res)
      // Kiểm tra không có lỗi (login thành công ) thì redirect về route /
      if (!res.error) navigate('/')
    }
    )
  }


  const tronFieldStyle = (fieldName) => ({
    input: {
      color: '#00FFF7',
      transition: 'all 0.3s ease'
    },
    label: {
      color: focusField === fieldName ? '#00FFF7' : '#666',
      transition: 'color 0.3s ease'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: focusField === fieldName ? '#00FFF7' : '#444'
      },
      '&:hover fieldset': {
        borderColor: '#00FFF7'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00FFF7',
        boxShadow: '0 0 8px #00FFF7'
      }
    }
  })

  return (
    <Zoom in={true} timeout={1000}>
      <Box
        sx={{
          minHeight: '100vh',
          // background: 'radial-gradient(circle at center, #000 40%, #111)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2
        }}
      >
        <Paper
          elevation={12}
          sx={{
            maxWidth: 420,
            width: '100%',
            p: 4,
            borderRadius: 3,
            backgroundColor: '#0a0a0a',
            boxShadow: '0 0 20px #00FFF7'
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#00FFF7"
            gutterBottom
          >
            Welcome to BookStore
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="#00FFF7"
            fontStyle="italic"
          >
            Login your account!
          </Typography>
          <Box
            // sx={{
            //   marginTop: '1em',
            //   display: 'flex',
            //   justifyContent: 'center',
            //   flexDirection: 'column',
            //   padding: '0 1em'
            // }}
            sx={{
              boxShadow: '0 0 20px #00FFF7'
            }}
          >
            {verifiedEmail && (
              <Alert severity="success" color='#00FFF7' sx={{ backgroundColor: '#0a0a0a', color:'#00FFF7', '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ color:'#00FFF7', fontWeight: 'bold', '&:hover': { color: '#00FFF7' } }}>
                  {verifiedEmail}
                </Typography>
                &nbsp;has been verified.<br />
                Now you can login to enjoy our services! Have a good day!
              </Alert>
            )}

            {registeredEmail && (
              <Alert severity="info" color='#00FFF7' sx={{ backgroundColor: '#0a0a0a', color:'#00FFF7', '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#00FFF7' } }}>
                  { registeredEmail }
                </Typography>
                <br />
                Please check and verify your account before logging in!
              </Alert>
            )}
          </Box>
          <form onSubmit={handleSubmit(submitLogin)} noValidate>
            <Box>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                {...register('email', { required: FIELD_REQUIRED_MESSAGE, pattern: {
                  value:EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                } })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#00FFF7' }} />
                    </InputAdornment>
                  )
                }}
                sx={tronFieldStyle('email')}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
              />
              <FieldErrorAlert errors={errors} fieldName="email" />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                {...register('password', { required: FIELD_REQUIRED_MESSAGE, pattern: {
                  value:PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                } } )}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#00FFF7' }} />
                    </InputAdornment>
                  )
                }}
                sx={tronFieldStyle('password')}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
              />
              <FieldErrorAlert errors={errors} fieldName="password" />
            </Box>

            <Button
              fullWidth
              className='interceptor-loading'
              type="submit"
              variant="outlined"
              sx={{
                mt: 3,
                borderColor: '#00FFF7',
                color: '#00FFF7',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: 1,
                py: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#00FFF7',
                  color: '#000',
                  boxShadow: '0 0 20px #00FFF7'
                },
                // fontSize: '18px'
              }}
            >
              Login
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              mt={3}
              color="#ccc"
            >
              Don&apos;t have an account?{' '}
              <MuiLink component={Link} to="/register" sx={{ color: '#00FFF7' }}>
                Register
              </MuiLink>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Zoom>
  )
}

export default LoginForm
