import { Box, CircularProgress, Typography, styled } from '@mui/material'

const SpinnerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  height: '100vh',
  width: '100vw'
}))

function PageLoadingSpinner({ caption }) {
  return (
    <SpinnerWrapper>
      <CircularProgress />
      <Typography variant="h5">{caption}</Typography>
    </SpinnerWrapper>
  )
}

export default PageLoadingSpinner
