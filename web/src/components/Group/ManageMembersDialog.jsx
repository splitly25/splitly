import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from '@mui/material'
import { Close, Search, People } from '@mui/icons-material'
import { COLORS } from '~/theme'
import { getInitials } from '~/utils/formatters'

function ManageMembersDialog({ open, onClose, groupName, currentMembers = [], onSave }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [members, setMembers] = useState([])
  const [removedMembers, setRemovedMembers] = useState([])

  useEffect(() => {
    if (open) {
      setMembers(currentMembers)
      setRemovedMembers([])
      setSearchQuery('')
    }
  }, [open, currentMembers])

  const handleRemoveMember = (memberId) => {
    setRemovedMembers((prev) => [...prev, memberId])
  }

  const handleUndoRemove = (memberId) => {
    setRemovedMembers((prev) => prev.filter((id) => id !== memberId))
  }

  const handleSave = () => {
    // Filter out removed members
    const updatedMembers = members.filter((member) => !removedMembers.includes(member._id))
    onSave(updatedMembers.map((m) => m._id))
  }

  const filteredMembers = members.filter(
    (member) =>
      (member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !removedMembers.includes(member._id)
  )

  const getRemovedMember = (memberId) => {
    return members.find((m) => m._id === memberId)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            maxHeight: '80vh',
          },
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: COLORS.gradientPrimary,
                borderRadius: '12px',
              }}
            >
              <People />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Nunito Sans', sans-serif" }}>
                Quản lý thành viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thêm hoặc xóa thành viên khỏi nhóm "{groupName}"
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm thành viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Current Members */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Thành viên hiện tại ({filteredMembers.length})
        </Typography>

        <List sx={{ mb: 2 }}>
          {filteredMembers.map((member) => (
            <ListItem
              key={member._id}
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              secondaryAction={
                <Chip
                  label="Đã chọn"
                  size="small"
                  onDelete={() => handleRemoveMember(member._id)}
                  sx={{
                    background: COLORS.gradientPrimary,
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                      },
                    },
                  }}
                />
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background: COLORS.gradientPrimary,
                  }}
                >
                  {getInitials(member.name || member.email)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {member.name || 'Unknown'}
                  </Typography>
                }
                secondary={member.email}
              />
            </ListItem>
          ))}
        </List>

        {/* Removed Members - Can be undone */}
        {removedMembers.length > 0 && (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              Sẽ xóa thành viên ({removedMembers.length})
            </Typography>

            <List>
              {removedMembers.map((memberId) => {
                const member = getRemovedMember(memberId)
                if (!member) return null
                return (
                  <ListItem
                    key={memberId}
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: '12px',
                      mb: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      opacity: 0.7,
                    }}
                    secondaryAction={
                      <Chip
                        label="Đã chọn"
                        size="small"
                        onDelete={() => handleUndoRemove(memberId)}
                        color="error"
                        variant="outlined"
                        sx={{
                          '& .MuiChip-deleteIcon': {
                            color: 'error.main',
                          },
                        }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: COLORS.gradientPrimary,
                        }}
                      >
                        {getInitials(member.name || member.email)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {member.name || 'Unknown'}
                        </Typography>
                      }
                      secondary={member.email}
                    />
                  </ListItem>
                )
              })}
            </List>
          </>
        )}

        {/* Add More Members Section */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            borderRadius: '12px',
            border: (theme) => `1px dashed ${theme.palette.primary.main}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
            Thêm số thành viên ?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tính năng này sẽ được cập nhật sau
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: '12px' }}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={removedMembers.length === 0}
          sx={{
            background: COLORS.gradientPrimary,
            borderRadius: '12px',
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ManageMembersDialog
