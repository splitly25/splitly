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

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const handleTogglePerson = (person, groupName = null) => {
    setSelectedPeople((prev) => {
      const exists = prev.find((p) => p.id === person.id)
      if (exists) {
        return prev.filter((p) => p.id !== person.id)
      } else {
        return [
          ...prev,
          {
            ...person,
            groups: groupName ? [groupName] : [],
          },
        ]
      }
    })
  }

  const handleToggleGroup = (group) => {
    setSelectedPeople((prev) => {
      // Check if all members of this group are already selected
      const allMembersSelected = group.members.every((member) => prev.find((p) => p.id === member.id))

      if (allMembersSelected) {
        // Remove all members of this group
        const memberIds = new Set(group.members.map((m) => m.id))
        return prev
          .map((person) => {
            if (memberIds.has(person.id)) {
              // Remove this group from the person's groups array
              const updatedGroups = person.groups.filter((g) => g !== group.name)
              if (updatedGroups.length === 0 && person.groups.length > 0) {
                // If this was the only group, remove the person entirely
                return null
              }
              return { ...person, groups: updatedGroups }
            }
            return person
          })
          .filter((p) => p !== null)
      } else {
        // Add all members of this group
        const newPeople = [...prev]
        group.members.forEach((member) => {
          const existingIndex = newPeople.findIndex((p) => p.id === member.id)
          if (existingIndex >= 0) {
            // Person already exists, add this group to their groups array
            if (!newPeople[existingIndex].groups.includes(group.name)) {
              newPeople[existingIndex] = {
                ...newPeople[existingIndex],
                groups: [...newPeople[existingIndex].groups, group.name],
              }
            }
          } else {
            // New person, add with this group
            newPeople.push({
              ...member,
              groups: [group.name],
            })
          }
        })
        return newPeople
      }
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

  // Groups are not filtered - we show all groups and indicate which are selected
  const filteredGroups = useMemo(() => groupsToDisplay, [groupsToDisplay])

  const getTotalSelected = () => {
    // Filter out people who are already current participants
    return selectedPeople.filter((p) => !currentParticipantIds.has(p.id)).length
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
                          {participant.email}
                        </Typography>

                        {participant.groups && participant.groups.length > 0 && (
                          <>
                            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>•</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {participant.groups.map((groupName, idx) => (
                                <Chip
                                  key={idx}
                                  label={groupName}
                                  size="small"
                                  sx={{
                                    height: '20px',
                                    fontSize: '11px',
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '& .MuiChip-label': {
                                      px: 1,
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </>
                        )}
                      </Box>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
                            {person.email}
                          </Typography>
                          {person.groups && person.groups.length > 0 && (
                            <>
                              <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>•</Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {person.groups.map((groupName, idx) => (
                                  <Chip
                                    key={idx}
                                    label={groupName}
                                    size="small"
                                    sx={{
                                      height: '20px',
                                      fontSize: '11px',
                                      backgroundColor: 'primary.main',
                                      color: 'primary.contrastText',
                                      '& .MuiChip-label': {
                                        px: 1,
                                      },
                                    }}
                                  />
                                ))}
                              </Box>
                            </>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Mark as payer button */}
                        <PayerButton
                          isPayer={currentPayerId === person.id}
                          onClick={() => onMarkAsPayer(person.id)}
                        >
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ width: '16px', height: '16px', color: 'text.secondary' }} />
                  </InputAdornment>
                ),
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
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {isSearching ? 'No people found matching your search' : 'No people available from your groups'}
                  </Typography>
                </Box>
              ) : (
                <>
                  {filteredPeople.map((person) => (
                    <PersonRow key={person.id}>
                      <UserAvatar sx={{ width: 32, height: 32, fontSize: '16px' }}>
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
                      <AddButton onClick={() => handleTogglePerson(person)}>Add</AddButton>
                    </PersonRow>
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
                    // Check how many members of this group are selected
                    const selectedMemberIds = selectedPeople
                      .filter((p) => p.groups.includes(group.name))
                      .map((p) => p.id)
                    const selectedCount = selectedMemberIds.length
                    const totalMembers = group.members?.length || 0
                    const isFullySelected = selectedCount === totalMembers && totalMembers > 0
                    const isPartiallySelected = selectedCount > 0 && selectedCount < totalMembers

                    const displayMembers = (group.members || []).slice(0, 3)
                    const remainingCount = totalMembers - 3

                    return (
                      <Box
                        key={group.id}
                        sx={(theme) => ({
                          border: `0.8px solid ${isFullySelected ? theme.palette.primary.main : theme.palette.divider}`,
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: '89.6px',
                          marginBottom: '16px',
                          backgroundColor: isFullySelected
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(144, 202, 249, 0.08)'
                              : 'rgba(25, 118, 210, 0.04)'
                            : 'transparent',
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
                              ({totalMembers} members{isPartiallySelected ? `, ${selectedCount} selected` : ''})
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
                          {isFullySelected ? 'Remove All' : isPartiallySelected ? 'Add Remaining' : 'Add All'}
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
