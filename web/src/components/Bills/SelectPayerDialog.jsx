import { useState } from 'react'
import { Dialog, Box, Typography, TextField, Button, Avatar, IconButton, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import { mockPeople } from '~/apis/mock-data'
import SearchIcon from '@mui/icons-material/Search'
import EmailIcon from '@mui/icons-material/Email'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F3F3F5',
    fontSize: '14px',
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '0.8px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.divider,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
  },
}))

const SelectPayerDialog = ({ open, onClose, onSelect, availablePeople = [] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [emailInput, setEmailInput] = useState('')

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleSelectPerson = (person) => {
    onSelect(person)
    handleCancel()
  }

  const handleAddByEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      const newPerson = {
        id: `email-${Date.now()}`,
        name: emailInput.split('@')[0],
        email: emailInput.trim(),
        isFromEmail: true,
      }
      onSelect(newPerson)
      handleCancel()
    }
  }

  const handleCancel = () => {
    setSearchQuery('')
    setEmailInput('')
    onClose()
  }

  // Use imported mock data if no available people provided
  const peopleList = availablePeople.length > 0 ? availablePeople : mockPeople

  // Filter people based on search query
  const filteredPeople = peopleList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog
      sx={(theme) => ({
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          overflow: 'hidden',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '95vw',
            margin: '8px',
            borderRadius: '12px',
          },
        },
      })}
      open={open}
      onClose={handleCancel}
    >
      <Box
        sx={(theme) => ({
          padding: '24px',
          backgroundColor: theme.palette.background.default,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
            <Typography sx={(theme) => ({ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary })}>
              Chọn người ứng tiền
            </Typography>
          </Box>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon sx={{ width: '20px', height: '20px' }} />
          </IconButton>
        </Box>

        {/* Add by Email Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'text.primary',
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <EmailIcon sx={{ width: '16px', height: '16px' }} />
            Chọn bằng email
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <StyledInput
              fullWidth
              placeholder="Nhập địa chỉ email..."
              variant="outlined"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddByEmail()
                }
              }}
            />
            <Button
              sx={(theme) => ({
                backgroundColor: theme.palette.background.default,
                border: `0.8px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 400,
                padding: '8px 16px',
                color: theme.palette.text.primary,
                height: '36px',
                minWidth: '60px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F3F3F5',
                  border: `0.8px solid ${theme.palette.divider}`,
                },
              })}
              onClick={handleAddByEmail}
            >
              Thêm
            </Button>
          </Box>
        </Box>

        {/* Search Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'text.primary',
              mb: 1.5,
            }}
          >
            Tìm kiếm
          </Typography>
          <StyledInput
            fullWidth
            placeholder="Tìm kiếm người..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Available People List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '400px',
            borderTop: (theme) => `0.8px solid ${theme.palette.divider}`,
            pt: 2,
          }}
        >
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  },
                })}
                key={person.id}
                onClick={() => handleSelectPerson(person)}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: '16px',
                    fontWeight: 400,
                    color: theme.palette.primary.contrastText,
                  })}
                >
                  {getInitials(person.name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 500 }}>
                    {person.name}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
                    {person.email}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>Không tìm thấy người nào</Typography>
            </Box>
          )}
        </Box>

        {/* Cancel Button */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleCancel}
            sx={{
              borderRadius: '16px',
              textTransform: 'none',
              fontSize: '14px',
              color: 'text.primary',
              minHeight: '36px',
              px: 3,
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SelectPayerDialog
