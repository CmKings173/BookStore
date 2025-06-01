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
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  USERNAME_RULE,
  USERNAME_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserApi } from '~/apis/index'
import { toast } from 'react-toastify'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const [focusField, setFocusField] = useState(null)
  const navigate = useNavigate()
  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserApi({ email, password }),
      { pending: 'Registration is in process...' }
    ).then(user => navigate(`/login?registeredEmail=${user.email}`))
  }

  const tronInputStyle = (fieldName) => ({
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
          elevation={10}
          sx={{
            maxWidth: 420,
            width: '100%',
            p: 4,
            borderRadius: 3,
            backgroundColor: '#0a0a0a',
            boxShadow: '0 0 25px #00FFF7'
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="#00FFF7"
            gutterBottom
          >
            Join The BookStore
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="#00FFF7"
            fontStyle="italic"
          >
            Create your account
          </Typography>

          <form onSubmit={handleSubmit(submitRegister)} noValidate>
            {/* <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              error={!!errors.Username}
              helperText={errors.name?.message}
              {...register('Username', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: USERNAME_RULE,
                  message: USERNAME_RULE_MESSAGE
                }
              } )}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#00FFF7' }} />
                  </InputAdornment>
                )
              }}
              sx={tronInputStyle('name')}
              onFocus={() => setFocusField('name')}
              onBlur={() => setFocusField(null)}
            />
            <FieldErrorAlert errors={errors} fieldName="Username" /> */}
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
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
              sx={tronInputStyle('email')}
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField(null)}
            />
            <FieldErrorAlert errors={errors} fieldName="email" />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
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
              sx={tronInputStyle('password')}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
            />
            <FieldErrorAlert errors={errors} fieldName='password' />

            <TextField
              fullWidth
              label="Password Confirmation"
              type="Password"
              margin="normal"
              variant="outlined"
              error={!!errors['Password_confirmation']}
              {...register('Password_confirmation', {
                validate: (value) => {
                  if (value === watch('password')) return true
                  return 'Password confirmation does not match!'
                }
              } )}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircleRoundedIcon sx={{ color: '#00FFF7' }} />
                  </InputAdornment>
                )
              }}
              sx={tronInputStyle('password')}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
            />
            <FieldErrorAlert errors={errors} fieldName='Password_confirmation' />

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
                }
              }}
            >
              Register
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              mt={3}
              color="#aaa"
            >
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" sx={{ color: '#00FFF7' }}>
                Sign In
              </MuiLink>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Zoom>
  )
}

export default RegisterForm
