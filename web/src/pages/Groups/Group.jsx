/* eslint-disable no-unused-vars */
import { useConfirm } from 'material-ui-confirm'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createGroupAPI, deleteGroupAPI, getGroupsByUserIdAPI, updateGroupAPI } from '~/apis'
import Layout from '~/components/Layout'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { Add } from '@mui/icons-material'
import { COLORS } from '~/theme'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Search from '@mui/icons-material/Search'
import LoadingSpinner from '~/components/Loading/LoadingSpinner'
import CreateGroupModal from '~/components/Group/CreateGroupModal'
import GroupCard from '~/components/Group/GroupCard'
import Container from '@mui/material/Container'

function Group() {
  const navigate = useNavigate()

  const currentUser = useSelector(selectCurrentUser)
  const [groups, setGroups] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [manageMembersModalOpen, setManageMembersModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const groupsResponse = await getGroupsByUserIdAPI(currentUser._id)
    setGroups(Array.isArray(groupsResponse) ? groupsResponse : [])
    setLoading(false)
  }, [currentUser._id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredGroups = groups.filter(
    (group) =>
      group.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateGroup = async (groupName, description, memberIds) => {
    const groupData = {
      groupName: groupName,
      description: description || '',
      members: memberIds,
    }
    await createGroupAPI(groupData)
    setCreateModalOpen(false)
    // Refresh the groups list
    fetchData()
  }

  const handleEditGroup = async (groupId, groupName, newDescription) => {
    const updateData = {
      groupName: groupName,
    }
    if (newDescription !== undefined) {
      updateData.description = newDescription
    }

    const response = await updateGroupAPI(groupId, updateData)

    setEditModalOpen(false)
    setSelectedGroup(null)
  }

  const handleUpdateMembers = async (groupId, memberIds) => {
    const response = await updateGroupAPI(groupId, { members: memberIds })

    setManageMembersModalOpen(false)
    setSelectedGroup(null)
  }

  const confirmDeleteGroup = useConfirm()
  const handleDeleteGroup = async (groupId) => {
    const { confirmed } = await confirmDeleteGroup({
      title: 'Xác nhận xóa nhóm',
      description: 'Bạn có chắc chắn muốn xóa nhóm này không?',
      confirmationText: 'Xóa',
      cancellationText: 'Hủy',
    })

    if (confirmed) {
      await deleteGroupAPI(groupId)
      // Refresh the groups list
      fetchData()
    }
  }

  const handleSelectGroup = (group) => {
    if (group && group._id) {
      navigate(`/groups/${group._id}`)
    }
  }

  const handleOpenEditModal = (group, event) => {
    event.stopPropagation()
    setSelectedGroup(group)
    setEditModalOpen(true)
  }

  const handleOpenMembersModal = (group, event) => {
    event.stopPropagation()
    setSelectedGroup(group)
    setManageMembersModalOpen(true)
  }
  return (
    <Layout>
      <Box
        sx={{
          padding: '32px',
          width: '100%',
          margin: '0 auto',
          height: '100%',
        }}
        className="bg-gray-50"
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
              gap: '16px',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                sx={(theme) => ({
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: theme.palette.text.primary,
                  marginBottom: '8px',
                  letterSpacing: '-0.02em',
                })}
              >
                Quản lý nhóm
              </Typography>
              <Typography
                variant="body1"
                sx={(theme) => ({
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: theme.palette.text.secondary,
                  fontFamily: "'Nunito Sans', sans-serif",
                })}
              >
                Tạo và quản lý các nhóm chi tiêu của bạn
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                background: COLORS.gradientPrimary,
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Nunito Sans', sans-serif",
                boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
                minWidth: '140px',
                '&:hover': {
                  background: COLORS.gradientPrimary,
                  opacity: 0.9,
                  boxShadow: '0px 6px 16px rgba(0,0,0,0.16)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Tạo nhóm mới
            </Button>
          </Box>

          {/* Search */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm nhóm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Groups Grid */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                width: '100%',
                py: 8,
              }}
            >
              <LoadingSpinner caption="Đang tải nhóm..." />
            </Box>
          ) : filteredGroups.length === 0 ? (
            <Card sx={{ borderRadius: '16px', p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {searchQuery ? 'Không tìm thấy nhóm nào' : 'Chưa có nhóm nào'}
              </Typography>

              {!searchQuery && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateModalOpen(true)}
                  sx={{
                    background: COLORS.gradientPrimary,
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      background: COLORS.gradientPrimary,
                      opacity: 0.9,
                    },
                  }}
                >
                  Tạo nhóm đầu tiên
                </Button>
              )}
            </Card>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 3, md: 4 },
                maxWidth: '100%',
              }}
            >
              {filteredGroups.map((group) => (
                <Box key={group._id}>
                  <GroupCard
                    group={group}
                    onClick={() => handleSelectGroup(group)}
                    onDelete={(e) => {
                      e.stopPropagation()
                      handleDeleteGroup(group._id)
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <CreateGroupModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateGroup} />
    </Layout>
  )
}

export default Group
