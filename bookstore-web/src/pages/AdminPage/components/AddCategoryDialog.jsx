import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createCategoryAPI } from '~/apis/admin'

const AddCategoryDialog = ({ open, onClose, onSuccess }) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  const categoryName = watch('name', '')

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      
      await createCategoryAPI({
        name: data.name
      })
      
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      reset()
      setError('')
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AddIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div">
          Tạo danh mục mới
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              {...register('name', {
                required: 'Tên danh mục là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Tên danh mục phải có ít nhất 3 ký tự'
                },
                maxLength: {
                  value: 100,
                  message: 'Tên danh mục không được quá 100 ký tự'
                }
              })}
              label="Tên danh mục"
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </Box>

          {categoryName && (
            <Box sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Slug sẽ được tạo tự động:</strong>
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'monospace',
                  color: theme.palette.info.main,
                  fontWeight: 'medium'
                }}
              >
                {categoryName.toLowerCase()
                  .replace(/[đĐ]/g, 'd')
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim('-')}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          pb: 3,
          gap: 1
        }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3
            }}
          >
            {loading ? 'Đang tạo...' : 'Tạo danh mục'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddCategoryDialog 