import { Box, Typography, Chip, TextField, InputAdornment } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SearchIcon from '@mui/icons-material/Search'
import { COLORS } from '~/theme'
import ParticipantCard from '~/components/Form/ParticipantCard'
import Button from '@mui/material/Button'
import { useMemo, useState } from 'react'

function ParticipantsSection({
  participants,
  splitType,
  onOpenParticipantDialog,
  onDeleteParticipant,
  onParticipantAmountChange,
  onParticipantAmountBlur,
  availableGroups = [],
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate which groups have all members present in participants
  const completeGroups = useMemo(() => {
    const participantIds = new Set(participants.map((p) => p.id))

    return availableGroups.filter((group) => {
      // Check if all members of this group are in the participants list
      return group.members && group.members.length > 0 && group.members.every((member) => participantIds.has(member.id))
    })
  }, [participants, availableGroups])

  // Filter participants based on search query
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) {
      return participants
    }
    const searchLower = searchQuery.toLowerCase()
    return participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(searchLower) || participant.email.toLowerCase().includes(searchLower)
    )
  }, [participants, searchQuery])
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        border: `0.8px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        boxShadow: 'none',
        marginBottom: '24px',
        padding: '24px',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Box sx={{ mb: 0, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <GroupAddIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
          <Typography
            sx={(theme) => ({
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '20px',
              color: theme.palette.text.primary,
            })}
          >
            Thành viên tham gia ({participants.length})
          </Typography>
        </Box>
        <Button
          sx={{
            background: COLORS.gradientPrimary,
            color: '#FAFAFA',
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 12px',
            height: '32px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            '&:hover': {
              opacity: 0.9,
            },
          }}
          onClick={onOpenParticipantDialog}
        >
          <GroupAddIcon sx={{ width: '18px', height: '18px' }} />
          Thêm thành viên
        </Button>
      </Box>

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
              icon={<GroupAddIcon sx={{ fontSize: '16px' }} />}
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

      {/* Local search for participants */}
      {participants.length > 5 && (
        <TextField
          sx={(theme) => ({
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: theme.palette.background.default,
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
          placeholder="Tìm kiếm thành viên..."
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
      )}

      {/* Participants list with scroll */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxHeight: participants.length > 5 ? '500px' : 'none',
          overflowY: participants.length > 5 ? 'auto' : 'visible',
          paddingRight: participants.length > 5 ? '4px' : '0',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
            },
          },
        }}
      >
        {filteredParticipants.length === 0 ? (
          <Box
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F4F5F7'),
              border: (theme) => `0.8px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              Không tìm thấy thành viên phù hợp với "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          filteredParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              showAmountInput={splitType === 'by-person'}
              onAmountChange={(amount) => onParticipantAmountChange(participant.id, amount)}
              onAmountBlur={onParticipantAmountBlur}
              onDelete={() => onDeleteParticipant(participant.id)}
              canDelete={participants.length > 1}
            />
          ))
        )}
      </Box>
    </Box>
  )
}

export default ParticipantsSection
