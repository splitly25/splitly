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
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { COLORS } from '~/theme'
import { mockPeople, mockGroups } from '~/apis/mock-data'
import SearchIcon from '@mui/icons-material/Search'
import GroupIcon from '@mui/icons-material/Group'
import EmailIcon from '@mui/icons-material/Email'
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

const SelectedMembersContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F4F5F7',
  border: `0.8px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '12px',
  minHeight: '100px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  alignContent: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

const MemberChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
  border: `0.8px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  padding: '8px',
  height: '41.6px',
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

const AddGroupButton = styled(Button)({
  background: '#2970FF',
  color: '#FFFFFF',
  borderRadius: '99px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  padding: '6px 24px',
  height: '37px',
  minWidth: '127px',
  '&:hover': {
    background: '#2970FF',
    opacity: 0.9,
  },
})

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

const AddParticipantDialog = ({ open, onClose, onAdd, availablePeople = [], availableGroups = [] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeople, setSelectedPeople] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [emailInput, setEmailInput] = useState('')
  const [emailPeople, setEmailPeople] = useState([])

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

  const handleRemovePerson = (personId, source) => {
    if (source === 'email') {
      setEmailPeople((prev) => prev.filter((p) => p.id !== personId))
    } else if (source === 'individual') {
      setSelectedPeople((prev) => prev.filter((p) => p.id !== personId))
    }
  }

  const handleRemoveGroupMember = (groupId, memberId) => {
    setSelectedGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const updatedMembers = group.members.filter((m) => m.id !== memberId)
          // If no members left, remove the group entirely
          if (updatedMembers.length === 0) {
            return null
          }
          return { ...group, members: updatedMembers }
        }
        return group
      }).filter(Boolean) // Remove null entries
    )
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

  const handleRemoveGroup = (groupId) => {
    setSelectedGroups((prev) => prev.filter((g) => g.id !== groupId))
  }

  const handleAddByEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      const newPerson = {
        id: `email-${Date.now()}`,
        name: emailInput.split('@')[0],
        email: emailInput.trim(),
        isFromEmail: true,
      }
      setEmailPeople([...emailPeople, newPerson])
      setEmailInput('')
    }
  }

  const handleConfirm = () => {
    // Combine all selections
    const allParticipants = [
      ...emailPeople,
      ...selectedPeople,
      ...selectedGroups.flatMap((group) =>
        group.members.map((member) => ({
          ...member,
          fromGroup: group.name,
        }))
      ),
    ]

    // Remove duplicates based on email
    const uniqueParticipants = allParticipants.reduce((acc, person) => {
      if (!acc.find((p) => p.email === person.email)) {
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
    setEmailPeople([])
    setSearchQuery('')
    setEmailInput('')
    onClose()
  }

  // Use imported mock data if no available people/groups provided
  const peopleList = availablePeople.length > 0 ? availablePeople : mockPeople
  const groupsList = availableGroups.length > 0 ? availableGroups : mockGroups

  // Get all selected person IDs (from individual selections, email additions, and groups)
  const selectedPersonIds = new Set([
    ...selectedPeople.map(p => p.id),
    ...emailPeople.map(p => p.id),
    ...selectedGroups.flatMap(g => g.members.map(m => m.id))
  ])

  // Filter out already selected people
  const filteredPeople = peopleList.filter(
    (person) =>
      !selectedPersonIds.has(person.id) &&
      (person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Filter out already selected groups
  const filteredGroups = groupsList.filter((group) =>
    !selectedGroups.find(g => g.id === group.id) &&
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTotalSelected = () => {
    const emailCount = emailPeople.length
    const individualCount = selectedPeople.length
    const groupMembersCount = selectedGroups.reduce((sum, group) => sum + group.members.length, 0)
    return emailCount + individualCount + groupMembersCount
  }

  return (
    <DialogContainer open={open} onClose={handleCancel} maxWidth="lg">
      <DialogContent>
        {/* Left Panel - Selected Members */}
        <LeftPanel>
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PeopleIcon sx={{ width: '16px', height: '16px', color: 'text.primary' }} />
              <Label>Selected Members ({getTotalSelected()})</Label>
            </Box>

            {/* Email People Section */}
            {emailPeople.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ width: '14px', height: '14px', color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Added by Email</Typography>
                </Box>
                <SelectedMembersContainer>
                  {emailPeople.map((person) => (
                    <MemberChip key={person.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar>{getInitials(person.name)}</UserAvatar>
                        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                          {person.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePerson(person.id, 'email')}
                        sx={{ width: '16px', height: '16px', padding: 0 }}
                      >
                        <CloseIcon sx={{ width: '12px', height: '12px' }} />
                      </IconButton>
                    </MemberChip>
                  ))}
                </SelectedMembersContainer>
              </Box>
            )}

            {/* Selected Individual People */}
            {selectedPeople.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PeopleIcon sx={{ width: '14px', height: '14px', color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>Selected Individuals</Typography>
                </Box>
                <SelectedMembersContainer>
                  {selectedPeople.map((person) => (
                    <MemberChip key={person.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar>{getInitials(person.name)}</UserAvatar>
                        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                          {person.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePerson(person.id, 'individual')}
                        sx={{ width: '16px', height: '16px', padding: 0 }}
                      >
                        <CloseIcon sx={{ width: '12px', height: '12px' }} />
                      </IconButton>
                    </MemberChip>
                  ))}
                </SelectedMembersContainer>
              </Box>
            )}

            {/* Selected Groups */}
            {selectedGroups.map((group) => (
              <Box key={group.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ width: '14px', height: '14px', color: 'text.secondary' }} />
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>From Group: {group.name}</Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => handleRemoveGroup(group.id)}
                    sx={{
                      fontSize: '12px',
                      color: 'error.main',
                      textTransform: 'none',
                      minWidth: 'auto',
                      p: 0.5,
                    }}
                  >
                    Remove Group
                  </Button>
                </Box>
                <SelectedMembersContainer>
                  {group.members.map((member) => (
                    <MemberChip key={member.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar>{getInitials(member.name)}</UserAvatar>
                        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                          {member.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveGroupMember(group.id, member.id)}
                        sx={{ width: '16px', height: '16px', padding: 0 }}
                      >
                        <CloseIcon sx={{ width: '12px', height: '12px' }} />
                      </IconButton>
                    </MemberChip>
                  ))}
                </SelectedMembersContainer>
              </Box>
            ))}

            {getTotalSelected() === 0 && (
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F4F5F7',
                  border: (theme) => `0.8px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                  Chưa có thành viên nào được chọn
                </Typography>
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
                px: 3
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
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
              Xác nhận ({getTotalSelected()})
            </Button>
          </Box>
        </LeftPanel>

        {/* Right Panel - Add Options */}
        <RightPanel>
          {/* Add by Email Section */}
          <Box sx={{ borderBottom: (theme) => `0.8px solid ${theme.palette.divider}`, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <EmailIcon sx={{ width: '16px', height: '16px', color: 'text.primary' }} />
              <Label>Add by email</Label>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StyledInput
                fullWidth
                placeholder="Enter email address..."
                variant="outlined"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddByEmail()
                  }
                }}
              />
              <AddByEmailButton onClick={handleAddByEmail}>Add</AddByEmailButton>
            </Box>
          </Box>

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
              {filteredPeople.map((person) => {
                const isSelected = selectedPeople.find((p) => p.id === person.id)
                return (
                  <PersonRow key={person.id}>
                    <Checkbox
                      checked={!!isSelected}
                      onChange={() => handleTogglePerson(person)}
                      size="small"
                      sx={{
                        padding: 0,
                        '& .MuiSvgIcon-root': { fontSize: 16 },
                      }}
                    />
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
              })}
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
              {filteredGroups.map((group) => {
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
                          <UserAvatar
                            key={member.id}
                            sx={{ width: 24, height: 24, fontSize: '11px' }}
                          >
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
                    <AddGroupButton onClick={() => handleToggleGroup(group)}>
                      {isSelected ? 'Remove' : 'Add Group'}
                    </AddGroupButton>
                  </GroupCard>
                )
              })}
            </Box>
          </Box>
        </RightPanel>
      </DialogContent>
    </DialogContainer>
  )
}

export default AddParticipantDialog
