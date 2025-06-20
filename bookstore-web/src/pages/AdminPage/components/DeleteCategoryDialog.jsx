import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import { deleteCategoryAPI } from '~/apis/admin'

const DeleteCategoryDialog = ({ open, onClose, category, onSuccess }) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!category) return

    try {
      setLoading(true)
      setError('')
      
      await deleteCategoryAPI(category._id)
      
      onSuccess()
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError('')
      onClose()
    }
  }

  if (!category) return null

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
        <DeleteIcon sx={{ color: theme.palette.error.main }} />
        <Typography variant="h6" component="div">
          Xóa danh mục
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 2,
          p: 2,
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
        }}>
          <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
          <Typography variant="body1" color="warning.main" fontWeight="medium">
            Cảnh báo: Hành động này không thể hoàn tác!
          </Typography>
        </Box>

        <Typography variant="body1" gutterBottom>
          Bạn có chắc chắn muốn xóa danh mục này không?
        </Typography>

        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Thông tin danh mục sẽ bị xóa:
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              <strong>Tên:</strong> {category.name}
            </Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace',
              color: theme.palette.info.main,
              mt: 0.5
            }}>
              <strong>Slug:</strong> {category.slug}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Ngày tạo:</strong> {new Date(category.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Lưu ý:</strong> Việc xóa danh mục có thể ảnh hưởng đến các sách đang thuộc danh mục này.
        </Typography>
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
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'medium',
            px: 3
          }}
        >
          {loading ? 'Đang xóa...' : 'Xóa danh mục'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryDialog 