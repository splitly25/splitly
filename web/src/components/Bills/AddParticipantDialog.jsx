import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { COLORS } from '~/theme'
import SearchIcon from '@mui/icons-material/Search'
import GroupIcon from '@mui/icons-material/Group'
import CloseIcon from '@mui/icons-material/Close'
import PeopleIcon from '@mui/icons-material/People'
import PeopleProfileToAdd from './PeopleProfileToAdd/PeopleProfileToAdd'
import { createGuestUserAPI } from '~/apis'
import { EMAIL_RULE } from '~/utils/validators'
import { getInitials } from '~/utils/formatters'

const Label = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  marginBottom: '0px',
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

const AddButton = styled(Button)(() => ({
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

const PayerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isPayer',
})(({ theme, isPayer }) => ({
  background: isPayer ? COLORS.gradientPrimary : 'transparent',
  color: isPayer ? '#FFFFFF' : theme.palette.text.primary,
  border: isPayer ? 'none' : `1px solid ${theme.palette.divider}`,
  borderRadius: '99px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  padding: '6px 16px',
  height: '32px',
  minWidth: '70px',
  '&:hover': {
    background: isPayer ? COLORS.gradientPrimary : theme.palette.action.hover,
    opacity: isPayer ? 0.9 : 1,
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
  onSearch,
  onLoadMore,
  searchedUsers = [],
  searchedGroups = [],
  searchPagination = {
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  },
  normalPagination = {
    users: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
    groups: { currentPage: 1, totalPages: 1, total: 0, limit: 10 },
  },
  isLoadingSearch = false,
  currentPayerId = null,
  onMarkAsPayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [leftPanelSearch, setLeftPanelSearch] = useState('') // Local search for current participants

  // Format: { id: string, name: string, email: string, groups: string[] }
  const [selectedPeople, setSelectedPeople] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    if (!onSearch) return // Skip if callback not provided

    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(1, 10, searchQuery, false, 'both') // Fetch first page, replace data, search both users and groups
      }
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleLoadMoreUsers = () => {
    const isSearching = searchQuery.trim() !== ''

    if (isSearching) {
      // Load more search results
      if (
        !isLoadingSearch &&
        !isLoadingMore &&
        searchPagination.users.currentPage < searchPagination.users.totalPages
      ) {
        setIsLoadingMore(true)
        onSearch(
          searchPagination.users.currentPage + 1,
          searchPagination.users.limit,
          searchQuery,
          true,
          'users'
        ).finally(() => setIsLoadingMore(false))
      }
    } else {
      // Load more normal mode results
      if (
        onLoadMore &&
        !isLoading &&
        !isLoadingMore &&
        normalPagination.users.currentPage < normalPagination.users.totalPages
      ) {
        setIsLoadingMore(true)
        onLoadMore(normalPagination.users.currentPage + 1, normalPagination.users.limit, true, 'users').finally(() =>
          setIsLoadingMore(false)
        )
      }
    }
  }

  const handleLoadMoreGroups = () => {
    const isSearching = searchQuery.trim() !== ''

    if (isSearching) {
      // Load more search results
      if (
        !isLoadingSearch &&
        !isLoadingMore &&
        searchPagination.groups.currentPage < searchPagination.groups.totalPages
      ) {
        setIsLoadingMore(true)
        onSearch(
          searchPagination.groups.currentPage + 1,
          searchPagination.groups.limit,
          searchQuery,
          true,
          'groups'
        ).finally(() => setIsLoadingMore(false))
      }
    } else {
      // Load more normal mode results
      if (
        onLoadMore &&
        !isLoading &&
        !isLoadingMore &&
        normalPagination.groups.currentPage < normalPagination.groups.totalPages
      ) {
        setIsLoadingMore(true)
        onLoadMore(normalPagination.groups.currentPage + 1, normalPagination.groups.limit, true, 'groups').finally(() =>
          setIsLoadingMore(false)
        )
      }
    }
  }

  const handleTogglePerson = async (person) => {
    let personToAdd = person

    // If this is a temporary guest user (not yet created in backend), create it first
    if (person.isTemporary) {
      try {
        const guestUser = await createGuestUserAPI(person.email, person.name)
        // Replace temporary person with actual created guest user
        personToAdd = {
          id: guestUser._id,
          name: guestUser.displayName || person.name,
          email: guestUser.email,
          userType: 'guest',
        }
      } catch (error) {
        console.error('Failed to create guest user:', error)
        return // Don't add if creation failed
      }
    }

    setSelectedPeople((prev) => {
      const exists = prev.find((p) => p.id === personToAdd.id)
      if (exists) {
        return prev.filter((p) => p.id !== personToAdd.id)
      } else {
        return [...prev, personToAdd]
      }
    })
  }

  const handleToggleGroup = (group) => {
    // add all members of this group that aren't already in the bill or selected
    setSelectedPeople((prev) => {
      const newPeople = [...prev]
      group.members.forEach((member) => {
        // Skip members who are already in the bill or already selected
        if (currentParticipantIds.has(member.id) || prev.find((p) => p.id === member.id)) {
          return
        }

        // Add member without group tracking
        newPeople.push(member)
      })
      return newPeople
    })
  }

  const handleConfirm = () => {
    // Filter out people who are already participants and pass the group info
    const uniqueParticipants = selectedPeople.filter((person) => !currentParticipantIds.has(person.id))

    onAdd(uniqueParticipants)
    handleCancel()
  }

  const handleCancel = () => {
    setSelectedPeople([])
    setSearchQuery('')
    setLeftPanelSearch('')
    onClose()
  }

  // Get all current participant IDs and selected person IDs
  const currentParticipantIds = useMemo(() => new Set(currentParticipants.map((p) => p.id)), [currentParticipants])

  const selectedPersonIds = useMemo(() => new Set(selectedPeople.map((p) => p.id)), [selectedPeople])

  // Determine which data to display based on search state
  const isSearching = searchQuery.trim() !== ''
  const peopleToDisplay = isSearching ? searchedUsers : availablePeople
  const groupsToDisplay = isSearching ? searchedGroups : availableGroups

  // Filter out current participants and already selected people (only for local filtering)
  const filteredPeople = useMemo(
    () =>
      peopleToDisplay.filter((person) => !currentParticipantIds.has(person.id) && !selectedPersonIds.has(person.id)),
    [peopleToDisplay, currentParticipantIds, selectedPersonIds]
  )

  // Filter out groups where all members are in bill or selected
  const filteredGroups = useMemo(() => {
    return groupsToDisplay.filter((group) => {
      // Check if ALL members are either in the bill OR in selectedPeople
      const allMembersAddedOrSelected = group.members.every(
        (member) => currentParticipantIds.has(member.id) || selectedPersonIds.has(member.id)
      )

      // Only show group if NOT all members are added/selected
      return !allMembersAddedOrSelected
    })
  }, [groupsToDisplay, currentParticipantIds, selectedPersonIds])

  const getTotalSelected = () => {
    // Filter out people who are already current participants
    return selectedPeople.filter((p) => !currentParticipantIds.has(p.id)).length
  }

  // Calculate which groups have all members in the bill (for display at top)
  const completeGroups = useMemo(() => {
    const participantIds = new Set(currentParticipants.map((p) => p.id))

    return availableGroups.filter((group) => {
      // Check if all members of this group are in currentParticipants
      return group.members && group.members.length > 0 && group.members.every((member) => participantIds.has(member.id))
    })
  }, [currentParticipants, availableGroups])

  // Filter current participants based on left panel search
  const filteredCurrentParticipants = useMemo(() => {
    if (!leftPanelSearch.trim()) {
      return currentParticipants
    }
    const searchLower = leftPanelSearch.toLowerCase()
    return currentParticipants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(searchLower) || participant.email.toLowerCase().includes(searchLower)
    )
  }, [currentParticipants, leftPanelSearch])

  const isValidEmail = EMAIL_RULE.test(searchQuery.trim())
  const shouldShowGuestOption = isSearching && filteredPeople.length === 0 && isValidEmail

  const guestPerson = {
    id: 'temp-guest-' + searchQuery,
    name: searchQuery.split('@')[0],
    email: searchQuery.trim(),
    isTemporary: true, // Flag to indicate this needs to be created
    userType: 'guest',
  }

  return (
    <Dialog
      sx={(theme) => ({
        '& .MuiInputLabel-root': {
          fontSize: '14px',
          fontWeight: 500,
          color: theme.palette.text.primary,
          marginBottom: '8px',
          position: 'static',
          transform: 'none',
          borderRadius: '18px',
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
        },
        '& .MuiOutlinedInput-root': {
          marginTop: '8px',
          fontSize: '14px',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.default,
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '0.8px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.divider,
            borderWidth: '0.8px',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '0.8px',
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '8px 12px',
          fontSize: '14px',
          color: theme.palette.text.primary,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.7,
          },
        },
      })}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '25px',
          },
        },
      }}
      open={open}
      onClose={handleCancel}
      maxWidth="lg"
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          height: '90vh',
          maxHeight: '717px',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            height: 'auto',
            maxHeight: '90vh',
          },
        })}
      >
        {/* Left Panel - Current Participants */}
        <Box
          sx={(theme) => ({
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
          })}
        >
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PeopleIcon sx={{ width: '16px', height: '16px', color: 'text.primary' }} />
              <Label>Thành viên đã thêm ({currentParticipants.length})</Label>
            </Box>

            {/* Local search for current participants */}
            {currentParticipants.length > 5 && (
              <TextField
                sx={(theme) => ({
                  mb: 2,
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
                })}
                fullWidth
                placeholder="Search participants..."
                variant="outlined"
                value={leftPanelSearch}
                onChange={(e) => setLeftPanelSearch(e.target.value)}
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
            )}

            {/* Display complete groups as chips */}
            {completeGroups.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
                  border: (theme) => `0.8px solid ${theme.palette.primary.main}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.secondary',
                    marginRight: '8px',
                    alignSelf: 'center',
                  }}
                >
                  Nhóm:
                </Typography>
                {completeGroups.map((group) => (
                  <Chip
                    key={group.id}
                    label={`${group.name} (${group.members.length})`}
                    icon={<GroupIcon sx={{ fontSize: '16px' }} />}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      fontWeight: 500,
                      fontSize: '13px',
                      '& .MuiChip-icon': {
                        color: 'primary.contrastText',
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Current Participants - Displayed as list */}
            {currentParticipants.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                {filteredCurrentParticipants.length === 0 ? (
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F4F5F7',
                      border: (theme) => `0.8px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                      No participants found matching "{leftPanelSearch}"
                    </Typography>
                  </Box>
                ) : (
                  filteredCurrentParticipants.map((participant) => (
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
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
                          {participant.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Mark as payer button */}
                        <PayerButton
                          isPayer={currentPayerId === participant.id}
                          onClick={() => onMarkAsPayer(participant.id)}
                        >
                          {currentPayerId === participant.id ? 'Payer' : 'Mark'}
                        </PayerButton>
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
                      </Box>
                    </PersonRow>
                  ))
                )}
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

                {/* Show all selected people with their group affiliations */}
                {selectedPeople
                  .filter((person) => !currentParticipantIds.has(person.id))
                  .map((person) => (
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
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Mark as payer button */}
                        <PayerButton isPayer={currentPayerId === person.id} onClick={() => onMarkAsPayer(person.id)}>
                          {currentPayerId === person.id ? 'Payer' : 'Mark as Payer'}
                        </PayerButton>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePerson(person)}
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
                      </Box>
                    </PersonRow>
                  ))}
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
        </Box>

        {/* Right Panel - Add Options */}
        <Box
          sx={(theme) => ({
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
          })}
        >
          {/* Unified Search Section */}
          <Box>
            <Label sx={{ mb: 1.5 }}>Search</Label>
            <TextField
              sx={(theme) => ({
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
              })}
              fullWidth
              placeholder="Search people and groups..."
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
            {isSearching && (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 1, ml: 0.5 }}>
                Searching {searchPagination.users.total + searchPagination.groups.total} results (
                {searchPagination.users.total} people, {searchPagination.groups.total} groups)
              </Typography>
            )}
          </Box>

          {/* Available People Section */}
          <Box>
            <SectionHeader>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>
                  {isSearching ? 'Search Results - People' : 'Available People'}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {filteredPeople.length} {isSearching ? 'found' : 'available'}
                </Typography>
              </Box>
            </SectionHeader>

            <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2, minHeight: '100px' }}>
              {(isSearching ? isLoadingSearch : isLoading) && filteredPeople.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredPeople.length === 0 ? (
                <Box sx={{ py: 4 }}>
                  {shouldShowGuestOption ? (
                    <>
                      <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 2 }}>
                        Email you searched is not registered yet. Add them as guest?
                      </Typography>
                      <PeopleProfileToAdd person={guestPerson} handleTogglePerson={handleTogglePerson} />
                    </>
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                      {isSearching ? 'No people found matching your search' : 'No people available from your groups'}
                    </Typography>
                  )}
                </Box>
              ) : (
                <>
                  {filteredPeople.map((person) => (
                    <PeopleProfileToAdd key={person.id} person={person} handleTogglePerson={handleTogglePerson} />
                  ))}

                  {/* Load More Button for both modes */}
                  {((isSearching && searchPagination.users.currentPage < searchPagination.users.totalPages) ||
                    (!isSearching && normalPagination.users.currentPage < normalPagination.users.totalPages)) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <Button
                        onClick={handleLoadMoreUsers}
                        disabled={isLoadingMore || isLoading}
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
                            Loading...
                          </>
                        ) : isSearching ? (
                          `Load More (${searchPagination.users.total - filteredPeople.length} remaining)`
                        ) : (
                          `Load More (${normalPagination.users.total - filteredPeople.length} remaining)`
                        )}
                      </Button>
                    </Box>
                  )}

                  {/* Show message when all pages loaded */}
                  {isSearching &&
                    searchPagination.users.currentPage >= searchPagination.users.totalPages &&
                    searchPagination.users.totalPages > 1 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          All {searchPagination.users.total} people loaded
                        </Typography>
                      </Box>
                    )}
                  {!isSearching &&
                    normalPagination.users.currentPage >= normalPagination.users.totalPages &&
                    normalPagination.users.totalPages > 1 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          All {normalPagination.users.total} people loaded
                        </Typography>
                      </Box>
                    )}
                </>
              )}
            </Box>
          </Box>

          {/* Available Groups Section */}
          <Box>
            <SectionHeader>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>
                    {isSearching ? 'Search Results - Groups' : 'Available Groups'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {filteredGroups.length} {isSearching ? 'found' : 'available'}
                </Typography>
              </Box>
            </SectionHeader>
            <Box sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto', minHeight: '100px' }}>
              {(isSearching ? isLoadingSearch : isLoading) && filteredGroups.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filteredGroups.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {isSearching ? 'No groups found matching your search' : 'No groups available'}
                  </Typography>
                </Box>
              ) : (
                <>
                  {filteredGroups.map((group) => {
                    const totalMembers = group.members?.length || 0
                    const displayMembers = (group.members || []).slice(0, 3)
                    const remainingCount = totalMembers - 3

                    // Count how many are already added (in bill or selected)
                    const addedCount = group.members.filter(
                      (member) => currentParticipantIds.has(member.id) || selectedPersonIds.has(member.id)
                    ).length

                    return (
                      <Box
                        key={group.id}
                        sx={(theme) => ({
                          border: `0.8px solid ${theme.palette.divider}`,
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: '89.6px',
                          marginBottom: '16px',
                          backgroundColor: 'transparent',
                          [theme.breakpoints.down('sm')]: {
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '12px',
                            minHeight: 'auto',
                          },
                        })}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <GroupIcon sx={{ width: '18px', height: '18px', color: 'text.primary' }} />
                            <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                              {group.name}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                              ({totalMembers} members{addedCount > 0 ? `, ${addedCount} added` : ''})
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
                        <AddButton onClick={() => handleToggleGroup(group)}>
                          {addedCount > 0 ? 'Add Remaining' : 'Add All'}
                        </AddButton>
                      </Box>
                    )
                  })}

                  {/* Load More Button for both modes */}
                  {((isSearching && searchPagination.groups.currentPage < searchPagination.groups.totalPages) ||
                    (!isSearching && normalPagination.groups.currentPage < normalPagination.groups.totalPages)) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <Button
                        onClick={handleLoadMoreGroups}
                        disabled={isLoadingMore || isLoading}
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
                            Loading...
                          </>
                        ) : isSearching ? (
                          `Load More (${searchPagination.groups.total - filteredGroups.length} remaining)`
                        ) : (
                          `Load More (${normalPagination.groups.total - filteredGroups.length} remaining)`
                        )}
                      </Button>
                    </Box>
                  )}

                  {/* Show message when all pages loaded */}
                  {isSearching &&
                    searchPagination.groups.currentPage >= searchPagination.groups.totalPages &&
                    searchPagination.groups.totalPages > 1 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          All {searchPagination.groups.total} groups loaded
                        </Typography>
                      </Box>
                    )}
                  {!isSearching &&
                    normalPagination.groups.currentPage >= normalPagination.groups.totalPages &&
                    normalPagination.groups.totalPages > 1 && (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                          All {normalPagination.groups.total} groups loaded
                        </Typography>
                      </Box>
                    )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default AddParticipantDialog
