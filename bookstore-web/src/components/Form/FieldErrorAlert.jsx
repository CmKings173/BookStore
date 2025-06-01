
import Alert from '@mui/material/Alert'

function FieldErrorAlert({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert
      severity="error"
      sx={{
        marginTop: '0.7em',
        color: '#00FFF7',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #00FFF7',
        boxShadow: '0 0 10px #00FFF7',
        '.MuiAlert-icon': {
          color: '#00FFF7'
        },
        '.MuiAlert-message': {
          overflow: 'hidden',
          fontWeight: 500
        }
      }}
    >
      {errors[fieldName]?.message}
    </Alert>
  )
}

export default FieldErrorAlert