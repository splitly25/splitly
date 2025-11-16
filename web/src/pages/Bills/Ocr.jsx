import { Box, Typography, Button, Container, Paper, IconButton, CircularProgress, Alert, Snackbar } from '@mui/material'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Layout from '~/components/Layout/Layout'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import colors from 'tailwindcss/colors'

import { sendOcrBillAPI } from '~/apis'
import { parseAssistantBillData } from '~/utils/assistantHelpers'
import { useChatbot } from '~/context/ChatbotContext'
import { addNotificationMessage } from '~/utils/notificationHelpers'

const Ocr = () => {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const fileInputRef = useRef(null)
  const hoverGradient = 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)'

  const {
    setNumberOfNotifications,
    setNewMessage,
  } = useChatbot()

  // Using hardcoded user ID - should come from authentication context
  // const currentUserId = '69097a08cfc3fcbcfb0f5b72'

  const validateFile = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, JPEG)')
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('Kích thước file không được vượt quá 10MB')
    }

    return true
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        validateFile(file)
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedFile(reader.result)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        setAnalysis('') // Clear previous analysis
        setError(null)
      } catch (err) {
        setError(err.message)
        setShowSnackbar(true)
      }
    }
  }



  const handleUploadImage = async () => {
    if (!imageFile) {
      setError('Vui lòng chọn một ảnh trước')
      setShowSnackbar(true)
      return
    }

    setIsUploading(true)
    setNewMessage('TingTing đang xử lý ảnh của bạn, chờ tí nhá...')
    setError(null)

    try {
      // Convert image to base64
      const reader = new FileReader()
      const imageData = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Không thể đọc file ảnh'))
        reader.readAsDataURL(imageFile)
      })

      // Call OCR API
      const result = await sendOcrBillAPI(imageData, currentUser._id)

      if (result && result.response) {
        const rawContent = result.response.result.message.content
        setAnalysis(rawContent)
        console.log('OCR Result:', result.response)

        const billData = parseAssistantBillData(currentUser._id, rawContent)

        setNewMessage('')
        addNotificationMessage('TingTing đã hoàn thành việc xử lý ảnh hóa đơn của bạn. Hãy kiểm tra kết quả nhé!')
        // Navigate to bill creation page with parsed data
        navigate('/create', {
          state: {
            chatbotWindowOpen: true,
            billFormData: billData,
          }
        })
      } else {
        throw new Error('Không nhận được kết quả từ server')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.')
      setShowSnackbar(true)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      try {
        validateFile(file)
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedFile(reader.result)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        setAnalysis('')
        setError(null)
      } catch (err) {
        setError(err.message)
        setShowSnackbar(true)
      }
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setImageFile(null)
    setImagePreview(null)
    setAnalysis('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCloseSnackbar = () => {
    setShowSnackbar(false)
  }

  return (
    <Layout>
      <Box className="main-container">
        {/* Header */}
        <Box sx={{ borderBottom: '1px solid #E5E7EB', pb: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: colors.purple[50],
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0A0A0A',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Quét hóa đơn (OCR)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.gray[600],
                  mt: 0.5,
                }}
              >
                Tải lên ảnh hóa đơn để tự động nhận diện thông tin
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        {/* Process Steps */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Step 1: Upload */}
          <Paper
            elevation={0}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
              minWidth: '200px',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: colors.blue[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UploadFileIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray[900] }}>
                Tải ảnh lên
              </Typography>
              <Typography variant="caption" sx={{ color: colors.gray[600] }}>
                JPG, PNG hoặc PDF
              </Typography>
            </Box>
          </Paper>

          {/* Step 2: AI Recognition */}
          <Paper
            elevation={0}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
              minWidth: '200px',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: colors.purple[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray[900] }}>
                AI nhận diện
              </Typography>
              <Typography variant="caption" sx={{ color: colors.gray[600] }}>
                Tự động trích xuất
              </Typography>
            </Box>
          </Paper>

          {/* Step 3: Create Invoice */}
          <Paper
            elevation={0}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
              minWidth: '200px',
              p: 3,
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: colors.green[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: colors.gray[900] }}>
                Tạo hóa đơn
              </Typography>
              <Typography variant="caption" sx={{ color: colors.gray[600] }}>
                Hoàn tất nhanh chóng
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Upload Area or Image Preview */}
        {!imagePreview ? (
          // Upload Area - Show when no image selected
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 6,
              border: `2px dashed ${isDragging ? colors.purple[500] : '#E5E7EB'}`,
              borderRadius: '16px',
              backgroundColor: isDragging ? colors.purple[50] : '#FAFAFA',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              mb: 4,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.pink[300]} 0%, ${colors.purple[400]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadFileIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: colors.gray[900],
                mb: 1,
              }}
            >
              Kéo thả ảnh hóa đơn vào đây
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: colors.gray[600],
                mb: 3,
              }}
            >
              hoặc chọn file từ thiết bị của bạn
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<ImageIcon />}
                onClick={handleChooseFile}
                sx={{
                  background: hoverGradient,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: hoverGradient,
                  },
                }}
              >
                Chọn ảnh
              </Button>

              <Button
                variant="outlined"
                startIcon={<CameraAltIcon />}
                sx={{
                  borderColor: colors.gray[300],
                  color: colors.gray[700],
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: colors.gray[400],
                    backgroundColor: colors.gray[50],
                  },
                }}
              >
                Chụp ảnh
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: colors.gray[500],
                display: 'block',
                mt: 3,
              }}
            >
              Hỗ trợ: JPG, PNG, JPEG • Tối đa 10MB
            </Typography>
          </Paper>
        ) : (
          // Image Preview Section - Replaces upload area when image is selected
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              mb: 4,
            }}
          >
            {/* Hidden file input for re-upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${colors.pink[300]} 0%, ${colors.purple[400]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: hoverGradient }}>
                  Ảnh đã chọn
                </Typography>
              </Box>
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  color: colors.gray[600],
                  '&:hover': {
                    backgroundColor: colors.red[50],
                    color: colors.red[600],
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Image Preview */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                height: 400,
                margin: '0 auto',
                mb: 3,
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${colors.gray[200]}`,
                backgroundColor: colors.gray[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={handleChooseFile}
                disabled={isUploading}
                sx={{
                  borderColor: colors.gray[300],
                  color: colors.gray[700],
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: colors.gray[400],
                    backgroundColor: colors.gray[50],
                  },
                }}
              >
                Chọn ảnh khác
              </Button>

              <Button
                variant="contained"
                onClick={handleUploadImage}
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                sx={{
                  background: hoverGradient,
                  color: 'white',
                  px: 6,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${colors.pink[500]} 0%, ${colors.purple[600]} 100%)`,
                  },
                  '&:disabled': {
                    backgroundColor: colors.gray[400],
                  },
                }}
              >
                {isUploading ? 'Đang xử lý...' : 'Quét hóa đơn'}
              </Button>
            </Box>

            {/* Tips Section */}
            {!analysis && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  backgroundColor: colors.blue[50],
                  borderRadius: '12px',
                  border: `1px solid ${colors.blue[200]}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: colors.blue[900],
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AutoAwesomeIcon fontSize="small" /> Mẹo để quét chính xác:
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2.5 }}>
                  <Typography component="li" variant="body2" sx={{ color: colors.blue[800], mb: 0.5 }}>
                    • Đảm bảo ảnh rõ nét, không bị mờ
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ color: colors.blue[800], mb: 0.5 }}>
                    • Chụp toàn bộ hóa đơn, không bị cắt
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ color: colors.blue[800], mb: 0.5 }}>
                    • Ảnh sáng tốt, tránh phần quang
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ color: colors.blue[800] }}>
                    • Hóa đơn nằm phẳng, không nhăn
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Analysis Results */}
            {analysis && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: colors.green[50],
                  borderRadius: '12px',
                  border: `1px solid ${colors.green[200]}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.green[900],
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon /> Kết quả nhận diện
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    color: colors.gray[800],
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                  }}
                >
                  {analysis}
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Layout>
  )
}

export default Ocr
