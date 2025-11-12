import { useState } from 'react'
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Checkbox,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { COLORS } from '~/theme'
import SearchIcon from '@mui/icons-material/Search'
import GroupIcon from '@mui/icons-material/Group'
import CloseIcon from '@mui/icons-material/Close'
import PeopleIcon from '@mui/icons-material/People'

const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    maxWidth: '1200px',
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      maxWidth: '95vw',
      margin: '16px',
      borderRadius: '16px',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      margin: '8px',
      borderRadius: '12px',
    },
  },
}))

const DialogContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '90vh',
  maxHeight: '717px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    maxHeight: '90vh',
  },
}))

const LeftPanel = styled(Box)(({ theme }) => ({
  width: '630px',
  padding: '24px',
  borderRight: `0.8px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    borderRight: 'none',
    borderBottom: `0.8px solid ${theme.palette.divider}`,
    height: 'auto',
    minHeight: '300px',
    maxHeight: '40vh',
  },
}))

const RightPanel = styled(Box)(({ theme }) => ({
  width: '550px',
  padding: '24px',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    maxHeight: '50vh',
  },
}))

const Label = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  marginBottom: '0px',
}))

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

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: theme.palette.primary.main,
  fontSize: '12px',
  fontWeight: 400,
  color: theme.palette.primary.contrastText,
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F3F4F6',
  borderBottom: `0.8px solid ${theme.palette.divider}`,
  padding: '12px 24px',
  marginLeft: '-24px',
  marginRight: '-24px',
}))

const PersonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '4px',
  minHeight: '72px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  },
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    gap: '8px',
    minHeight: 'auto',
  },
}))

const GroupCard = styled(Box)(({ theme }) => ({
  border: `0.8px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '89.6px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    minHeight: 'auto',
  },
}))

// eslint-disable-next-line no-unused-vars
const AddButton = styled(Button)(({ theme }) => ({
  background: COLORS.gradientPrimary,
  color: '#FFFFFF',
  borderRadius: '99px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  padding: '6px 24px',
  height: '37px',
  minWidth: '78px',
  '&:hover': {
    background: COLORS.gradientPrimary,
    opacity: 0.9,
  },
}))

const AddByEmailButton = styled(Button)(({ theme }) => ({
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
}))

const AddParticipantDialog = ({
  open,
  onClose,
  onAdd,
  onRemove,
  currentParticipants = [],
  availablePeople = [],
  availableGroups = [],
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeople, setSelectedPeople] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleTogglePerson = (person) => {
    setSelectedPeople((prev) => {
      const exists = prev.find((p) => p.id === person.id)
      if (exists) {
        return prev.filter((p) => p.id !== person.id)
      } else {
        return [...prev, { ...person, fromIndividual: true }]
      }
    })
  }

  const handleToggleGroup = (group) => {
    setSelectedGroups((prev) => {
      const exists = prev.find((g) => g.id === group.id)
      if (exists) {
        return prev.filter((g) => g.id !== group.id)
      } else {
        return [...prev, group]
      }
    })
  }

  const handleConfirm = () => {
    // Combine all selections
    const allParticipants = [
      ...selectedPeople,
      ...selectedGroups.flatMap((group) =>
        group.members.map((member) => ({
          ...member,
          fromGroup: group.name,
        }))
      ),
    ]

    // Remove duplicates based on id and filter out people who are already participants
    const uniqueParticipants = allParticipants.reduce((acc, person) => {
      if (!acc.find((p) => p.id === person.id) && !currentParticipantIds.has(person.id)) {
        acc.push(person)
      }
      return acc
    }, [])

    onAdd(uniqueParticipants)
    handleCancel()
  }

  const handleCancel = () => {
    setSelectedPeople([])
    setSelectedGroups([])
    setSearchQuery('')
    onClose()
  }

  // Use provided available people and groups
  const peopleList = availablePeople
  const groupsList = availableGroups

  // Get all current participant IDs and selected person IDs
  const currentParticipantIds = new Set(currentParticipants.map((p) => p.id))
  const selectedPersonIds = new Set([
    ...selectedPeople.map((p) => p.id),
    ...selectedGroups.flatMap((g) => g.members.map((m) => m.id)),
  ])

  // Filter out current participants and already selected people
  const filteredPeople = peopleList.filter(
    (person) =>
      !currentParticipantIds.has(person.id) &&
      !selectedPersonIds.has(person.id) &&
      (person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Filter out already selected groups
  const filteredGroups = groupsList.filter(
    (group) =>
      !selectedGroups.find((g) => g.id === group.id) && group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTotalSelected = () => {
    // Filter out people who are already current participants
    const newIndividualCount = selectedPeople.filter((p) => !currentParticipantIds.has(p.id)).length
    const newGroupMembersCount = selectedGroups.reduce((sum, group) => {
      const newMembers = group.members.filter((m) => !currentParticipantIds.has(m.id))
      return sum + newMembers.length
    }, 0)
    return newIndividualCount + newGroupMembersCount
  }

  return (
    <DialogContainer open={open} onClose={handleCancel} maxWidth="lg">
      <DialogContent>
        {/* Left Panel - Current Participants */}
        <LeftPanel>
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon sx={{ width: '16px', height: '16px', color: 'text.primary' }} />
              <Label>Thành viên đã thêm ({currentParticipants.length})</Label>
            </Box>

            {/* Current Participants - Displayed as list */}
            {currentParticipants.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {currentParticipants.map((participant) => (
                  <PersonRow key={participant.id}>
                    <UserAvatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '16px',
                      }}
                    >
                      {getInitials(participant.name)}
                    </UserAvatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                        {participant.name}
                      </Typography>
                      <Typography sx={{ fontSize: '16px', color: 'text.secondary', fontWeight: 400 }}>
                        {participant.email}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => onRemove(participant.id)}
                      sx={{
                        width: '32px',
                        height: '32px',
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                        },
                      }}
                    >
                      <CloseIcon sx={{ width: '16px', height: '16px' }} />
                    </IconButton>
                  </PersonRow>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F4F5F7',
                  border: (theme) => `0.8px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                  Chưa có thành viên nào được thêm
                </Typography>
              </Box>
            )}

            {/* Newly Selected People - To be added */}
            {getTotalSelected() > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
                    pt: 2,
                    mb: 2,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PeopleIcon sx={{ width: '16px', height: '16px', color: 'primary.main' }} />
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}>
                    Sẽ được thêm ({getTotalSelected()})
                  </Typography>
                </Box>

                {/* Combine and deduplicate all selected people */}
                {(() => {
                  // Get all group member IDs
                  const groupMemberIds = new Set(selectedGroups.flatMap((g) => g.members.map((m) => m.id)))

                  // Create a unified list: individual people + group members
                  const allSelectedPeople = []

                  // Add individual people (only if not in a group)
                  selectedPeople
                    .filter((person) => !currentParticipantIds.has(person.id) && !groupMemberIds.has(person.id))
                    .forEach((person) => {
                      allSelectedPeople.push({
                        ...person,
                        source: 'individual',
                      })
                    })

                  // Add group members
                  selectedGroups.forEach((group) => {
                    group.members
                      .filter((member) => !currentParticipantIds.has(member.id))
                      .forEach((member) => {
                        // Check if this member is already in the list
                        if (!allSelectedPeople.find((p) => p.id === member.id)) {
                          allSelectedPeople.push({
                            ...member,
                            source: 'group',
                            groupName: group.name,
                            groupId: group.id,
                          })
                        }
                      })
                  })

                  return allSelectedPeople.map((person) => (
                    <PersonRow key={person.id}>
                      <UserAvatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '16px',
                        }}
                      >
                        {getInitials(person.name)}
                      </UserAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                          {person.name}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
                          {person.email}
                          {person.source === 'group' && ` • từ ${person.groupName}`}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() =>
                          person.source === 'individual'
                            ? handleTogglePerson(person)
                            : handleToggleGroup(selectedGroups.find((g) => g.id === person.groupId))
                        }
                        sx={{
                          width: '32px',
                          height: '32px',
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.light',
                          },
                        }}
                        title={person.source === 'group' ? 'Xóa toàn bộ nhóm' : 'Xóa người này'}
                      >
                        <CloseIcon sx={{ width: '16px', height: '16px' }} />
                      </IconButton>
                    </PersonRow>
                  ))
                })()}
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              flexShrink: 0,
              backgroundColor: 'background.default',
              flexWrap: 'wrap',
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
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={getTotalSelected() === 0}
              sx={{
                background: COLORS.gradientPrimary,
                borderRadius: '16px',
                textTransform: 'none',
                fontSize: '14px',
                minHeight: '36px',
                px: 3,
                '&:hover': {
                  background: COLORS.gradientPrimary,
                  opacity: 0.9,
                },
              }}
            >
              Thêm {getTotalSelected() > 0 ? `(${getTotalSelected()})` : ''}
            </Button>
          </Box>
        </LeftPanel>

        {/* Right Panel - Add Options */}
        <RightPanel>
          {/* Search Section */}
          <Box>
            <Label sx={{ mb: 1.5 }}>Search</Label>
            <StyledInput
              fullWidth
              placeholder="Search people, groups, or members..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Available People Section */}
          <Box>
            <SectionHeader>
              <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>Available People</Typography>
            </SectionHeader>
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredPeople.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>Không tìm thấy người nào</Typography>
                </Box>
              ) : (
                filteredPeople.map((person) => {
                  return (
                    <PersonRow key={person.id}>
                      <UserAvatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '16px',
                        }}
                      >
                        {getInitials(person.name)}
                      </UserAvatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                          {person.name}
                        </Typography>
                        <Typography sx={{ fontSize: '16px', color: 'text.secondary', fontWeight: 400 }}>
                          {person.email}
                        </Typography>
                      </Box>
                      <AddButton onClick={() => handleTogglePerson(person)}>Add</AddButton>
                    </PersonRow>
                  )
                })
              )}
            </Box>
          </Box>

          {/* Available Groups Section */}
          <Box>
            <SectionHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>Available Groups</Typography>
              </Box>
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredGroups.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>Không tìm thấy nhóm nào</Typography>
                </Box>
              ) : (
                filteredGroups.map((group) => {
                  const isSelected = selectedGroups.find((g) => g.id === group.id)
                  const displayMembers = group.members.slice(0, 3)
                  const remainingCount = group.members.length - 3

                  return (
                    <GroupCard key={group.id}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <GroupIcon sx={{ width: '18px', height: '18px', color: 'text.primary' }} />
                          <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                            {group.name}
                          </Typography>
                          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                            ({group.members.length} members)
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 3 }}>
                          {displayMembers.map((member) => (
                            <UserAvatar key={member.id} sx={{ width: 24, height: 24, fontSize: '11px' }}>
                              {getInitials(member.name)}
                            </UserAvatar>
                          ))}
                          {remainingCount > 0 && (
                            <Typography sx={{ fontSize: '12px', color: 'text.secondary', ml: 0.5 }}>
                              +{remainingCount} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <AddButton onClick={() => handleToggleGroup(group)}>{isSelected ? 'Remove' : 'Add'}</AddButton>
                    </GroupCard>
                  )
                })
              )}
            </Box>
          </Box>
        </RightPanel>
      </DialogContent>
    </DialogContainer>
  )
}

export default AddParticipantDialog
