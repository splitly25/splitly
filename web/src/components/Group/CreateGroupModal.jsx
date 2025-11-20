import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import { Close, Add, Groups, Search as SearchIcon } from '@mui/icons-material'
import { COLORS } from '~/theme'
import { fetchUsersAPI } from '~/apis'
import PeopleProfileToAdd from '~/components/Bills/PeopleProfileToAdd/PeopleProfileToAdd'

function CreateGroupModal({ open, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [availableMembers, setAvailableMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  })

  // Fetch users on mount
  useEffect(() => {
    if (open) {
      fetchUsers(1, 10, '')
    }
  }, [open])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchUsers(1, 10, searchQuery)
      } else {
        fetchUsers(1, 10, '')
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchUsers = async (page, limit, search) => {
    setIsLoading(true)
    try {
      const response = await fetchUsersAPI(page, limit, search)

      // Filter out guest users
      const filteredUsers = (response.users || [])
        .filter((user) => user.userType !== 'guest')
        .map((user) => ({
          id: user._id,
          name: user.displayName || user.name || user.email?.split('@')[0],
          email: user.email,
          userType: user.userType,
        }))

      setAvailableMembers(filteredUsers)
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalUsers || 0,
        limit: response.pagination?.limit || 10,
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      setAvailableMembers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (isLoadingMore || pagination.currentPage >= pagination.totalPages) return

    setIsLoadingMore(true)
    try {
      const response = await fetchUsersAPI(pagination.currentPage + 1, pagination.limit, searchQuery)

      // Filter out guest users
      const filteredUsers = (response.users || [])
        .filter((user) => user.userType !== 'guest')
        .map((user) => ({
          id: user._id,
          name: user.displayName || user.name || user.email?.split('@')[0],
          email: user.email,
          userType: user.userType,
        }))

      setAvailableMembers((prev) => [...prev, ...filteredUsers])
      setPagination({
        currentPage: response.pagination?.currentPage || pagination.currentPage,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalUsers || 0,
        limit: response.pagination?.limit || 10,
      })
    } catch (error) {
      console.error('Error loading more users:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const toggleMember = (person) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m.id === person.id)
      if (exists) {
        return prev.filter((m) => m.id !== person.id)
      } else {
        return [...prev, { id: person.id, name: person.name, email: person.email }]
      }
    })
  }

  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      // Extract member IDs for the API call
      const memberIds = selectedMembers.map((m) => m.id)
      onCreate(groupName.trim(), description.trim(), memberIds)
      handleClose()
    }
  }

  const handleClose = () => {
    setGroupName('')
    setDescription('')
    setSelectedMembers([])
    setSearchQuery('')
    setAvailableMembers([])
    onClose()
  }

  // Filter out already selected members
  const filteredMembers = availableMembers.filter(
    (member) => !selectedMembers.find((selected) => selected.id === member.id)
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: COLORS.gradientPrimary,
              borderRadius: '12px',
            }}
          >
            <Groups />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Nunito Sans', sans-serif" }}>
              Tạo nhóm mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thêm thành viên và bắt đầu chia sẻ chi phí
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Group Name */}
          <TextField
            label="Tên nhóm"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ví dụ: Nhóm bạn thân, Gia đình, Team công ty..."
            fullWidth
            required
            autoFocus
          />

          {/* Description */}
          <TextField
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả về nhóm (tùy chọn)..."
            fullWidth
            multiline
            rows={2}
          />

          {/* Search Members */}
          <TextField
            label="Tìm kiếm thành viên"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ width: '20px', height: '20px', color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Đã chọn {selectedMembers.length} thành viên:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedMembers.map((member) => (
                  <Chip
                    key={member.id}
                    label={member.name || member.email}
                    size="small"
                    onDelete={() => toggleMember(member)}
                    sx={{
                      background: COLORS.gradientPrimary,
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Available Members List */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Thành viên có sẵn{' '}
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                ({pagination.total} người)
              </Typography>
            </Typography>

            <Box
              sx={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                minHeight: '100px',
              }}
            >
              {isLoading && filteredMembers.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredMembers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {searchQuery ? 'Không tìm thấy thành viên nào' : 'Không có thành viên nào'}
                  </Typography>
                </Box>
              ) : (
                <>
                  {filteredMembers.map((person) => (
                    <PeopleProfileToAdd key={person.id} person={person} handleTogglePerson={toggleMember} />
                  ))}

                  {/* Load More Button */}
                  {pagination.currentPage < pagination.totalPages && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        sx={{
                          textTransform: 'none',
                          fontSize: '14px',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        {isLoadingMore ? (
                          <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Đang tải...
                          </>
                        ) : (
                          `Tải thêm (${pagination.total - availableMembers.length} còn lại)`
                        )}
                      </Button>
                    </Box>
                  )}

                  {/* Show message when all loaded */}
                  {pagination.currentPage >= pagination.totalPages && pagination.totalPages > 1 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                        Đã tải tất cả {pagination.total} thành viên
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!groupName.trim() || selectedMembers.length === 0}
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: COLORS.gradientPrimary,
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
          }}
        >
          Tạo nhóm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateGroupModal
