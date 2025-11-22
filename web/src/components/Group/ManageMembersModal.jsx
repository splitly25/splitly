import { useState, useEffect, useMemo } from 'react'
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
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import { Close, Search as SearchIcon, Groups, PersonRemove } from '@mui/icons-material'
import { COLORS } from '~/theme'
import { fetchUsersAPI } from '~/apis'
import { getInitials } from '~/utils/formatters'
import PeopleProfileToAdd from '~/components/Bills/PeopleProfileToAdd/PeopleProfileToAdd'
import { useConfirm } from 'material-ui-confirm'

function ManageMembersModal({ open, onClose, group, onUpdateMembers, creatorId }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [membersToAdd, setMembersToAdd] = useState([])
  const [membersToRemove, setMembersToRemove] = useState([])

  const [availableUsers, setAvailableUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  })

  const confirmRemoveMember = useConfirm()

  // Current members from group
  const currentMembers = useMemo(() => {
    return (group?.members || []).map((member) => ({
      id: member._id,
      name: member.displayName || member.name || member.email?.split('@')[0],
      email: member.email,
    }))
  }, [group?.members])

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

      setAvailableUsers(filteredUsers)
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalUsers || 0,
        limit: response.pagination?.limit || 10,
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      setAvailableUsers([])
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

      setAvailableUsers((prev) => [...prev, ...filteredUsers])
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

  const toggleAddMember = (person) => {
    setMembersToAdd((prev) => {
      const exists = prev.find((m) => m.id === person.id)
      if (exists) {
        return prev.filter((m) => m.id !== person.id)
      } else {
        return [...prev, { id: person.id, name: person.name, email: person.email }]
      }
    })
  }

  const handleRemoveMember = async (member) => {
    // Don't allow removing the creator
    if (member.id === creatorId) {
      return
    }

    const { confirmed } = await confirmRemoveMember({
      title: 'Xác nhận xóa thành viên',
      description: `Bạn có chắc chắn muốn xóa ${member.name} khỏi nhóm?`,
      confirmationText: 'Xóa',
      cancellationText: 'Hủy',
    })

    if (confirmed) {
      setMembersToRemove((prev) => [...prev, member])
    }
  }

  const undoRemoveMember = (member) => {
    setMembersToRemove((prev) => prev.filter((m) => m.id !== member.id))
  }

  const handleSave = () => {
    // Calculate final member list
    const currentMemberIds = currentMembers.map((m) => m.id)
    const removedIds = membersToRemove.map((m) => m.id)
    const addedIds = membersToAdd.map((m) => m.id)

    // Final members = current - removed + added
    const finalMemberIds = currentMemberIds.filter((id) => !removedIds.includes(id)).concat(addedIds)

    onUpdateMembers(group._id, finalMemberIds)
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setMembersToAdd([])
    setMembersToRemove([])
    setAvailableUsers([])
    onClose()
  }

  // Get IDs of current members and members to add for filtering
  const currentMemberIds = useMemo(() => new Set(currentMembers.map((m) => m.id)), [currentMembers])
  const membersToAddIds = useMemo(() => new Set(membersToAdd.map((m) => m.id)), [membersToAdd])
  const membersToRemoveIds = useMemo(() => new Set(membersToRemove.map((m) => m.id)), [membersToRemove])

  // Filter available users - exclude current members and already selected to add
  const filteredAvailableUsers = availableUsers.filter(
    (user) => !currentMemberIds.has(user.id) && !membersToAddIds.has(user.id)
  )

  // Display members = current members - removed members
  const displayMembers = currentMembers.filter((m) => !membersToRemoveIds.has(m.id))

  const hasChanges = membersToAdd.length > 0 || membersToRemove.length > 0

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
              Quản lý thành viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group?.groupName} • {displayMembers.length + membersToAdd.length} thành viên
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, minHeight: '400px' }}>
          {/* Left Panel - Current Members */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Thành viên hiện tại ({displayMembers.length})
            </Typography>

            <Box
              sx={{
                flex: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
                {displayMembers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                      Không có thành viên nào
                    </Typography>
                  </Box>
                ) : (
                  displayMembers.map((member) => {
                    const isCreator = member.id === creatorId
                    return (
                      <Box
                        key={member.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                          '&:last-child': { borderBottom: 'none' },
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            background: COLORS.gradientPrimary,
                            fontSize: '14px',
                          }}
                        >
                          {getInitials(member.name)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.name} {isCreator && '(Chủ nhóm)'}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: 'text.secondary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.email}
                          </Typography>
                        </Box>
                        {!isCreator && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMember(member)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.lighter',
                              },
                            }}
                          >
                            <PersonRemove sx={{ fontSize: '20px' }} />
                          </IconButton>
                        )}
                      </Box>
                    )
                  })
                )}
              </Box>
            </Box>

            {/* Members to be removed */}
            {membersToRemove.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  Sẽ bị xóa ({membersToRemove.length}):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {membersToRemove.map((member) => (
                    <Box
                      key={member.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'error.lighter',
                        borderRadius: '16px',
                        fontSize: '13px',
                      }}
                    >
                      <Typography sx={{ fontSize: '13px', color: 'error.main' }}>{member.name}</Typography>
                      <IconButton size="small" onClick={() => undoRemoveMember(member)} sx={{ p: 0.25 }}>
                        <Close sx={{ fontSize: '14px', color: 'error.main' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Members to be added */}
            {membersToAdd.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 1 }}>
                  Sẽ được thêm ({membersToAdd.length}):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {membersToAdd.map((member) => (
                    <Box
                      key={member.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'success.lighter',
                        borderRadius: '16px',
                      }}
                    >
                      <Typography sx={{ fontSize: '13px', color: 'success.main' }}>{member.name}</Typography>
                      <IconButton size="small" onClick={() => toggleAddMember(member)} sx={{ p: 0.25 }}>
                        <Close sx={{ fontSize: '14px', color: 'success.main' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Panel - Add Members */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Thêm thành viên mới
            </Typography>

            {/* Search */}
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              fullWidth
              size="small"
              sx={{ mb: 2 }}
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

            {/* Available Users List */}
            <Box
              sx={{
                flex: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
                {isLoading && filteredAvailableUsers.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : filteredAvailableUsers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                      {searchQuery ? 'Không tìm thấy người dùng nào' : 'Không có người dùng khả dụng'}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {filteredAvailableUsers.map((person) => (
                      <PeopleProfileToAdd key={person.id} person={person} handleTogglePerson={toggleAddMember} />
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
                            `Tải thêm (${pagination.total - availableUsers.length} còn lại)`
                          )}
                        </Button>
                      </Box>
                    )}

                    {/* Show message when all loaded */}
                    {pagination.currentPage >= pagination.totalPages && pagination.totalPages > 1 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          Đã tải tất cả {pagination.total} người dùng
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          variant="contained"
          sx={{
            background: COLORS.gradientPrimary,
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
            '&.Mui-disabled': {
              background: 'grey.300',
            },
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ManageMembersModal
