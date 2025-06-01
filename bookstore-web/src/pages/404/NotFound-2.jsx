import { Box, Typography, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'
import '@fontsource/roboto-mono'
import { MatrixRainingLetters } from 'react-mdr'
import { keyframes } from '@emotion/react'

// Glitch animation
const glitch = keyframes`
  0% { transform: skew(0.1deg, 0.1deg); }
  10% { transform: skew(-0.1deg, -0.2deg); }
  20% { transform: skew(0.3deg, -0.1deg); }
  30% { transform: skew(-0.3deg, 0.2deg); }
  40% { transform: skew(0.1deg, -0.1deg); }
  100% { transform: skew(0); }
`

// Fade in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

function NotFound() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: '#000',
        overflow: 'hidden',
        fontFamily: '"Roboto Mono", monospace',
        color: 'white'
      }}
    >
      {/* Matrix background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      >
        <MatrixRainingLetters
          key="matrix"
          custom_class="matrix-bg"
          sx={{
            width: '100%',
            height: '100%',
            opacity: 0.15
          }}
        />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 2
        }}
      >
        {/* 404 */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '8rem',
            color: '#00FF00',
            mb: 2,
            animation: `${glitch} 2s infinite, ${fadeIn} 1s ease-out`,
            animationDelay: '0s, 0s',
            animationFillMode: 'forwards',
            textShadow: '0 0 10px #00FF00',
            opacity: 0
          }}
        >
          404
        </Typography>

        {/* Line 1 */}
        <Typography
          variant="h5"
          sx={{
            mb: 1,
            animation: `${fadeIn} 1s ease-out`,
            animationDelay: '0.5s',
            animationFillMode: 'forwards',
            opacity: 0
          }}
        >
          This page does not exist
        </Typography>

        {/* Line 2 */}
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#00FF00',
            animation: `${fadeIn} 1s ease-out`,
            animationDelay: '1s',
            animationFillMode: 'forwards',
            opacity: 0
          }}
        >
          But The Matrix does
        </Typography>

        {/* Button */}
        <Box
          sx={{
            animation: `${fadeIn} 1s ease-out`,
            animationDelay: '2.5s',
            animationFillMode: 'forwards',
            opacity: 0
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{
                color: '#00FF00',
                borderColor: '#00FF00',
                textShadow: '0 0 5px #00FF00',
                boxShadow: '0 0 10px #00FF00',
                '&:hover': {
                  color: '#000',
                  backgroundColor: '#00FF00',
                  borderColor: '#00FF00',
                  boxShadow: '0 0 15px #00FF00'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Go Home
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default NotFound
