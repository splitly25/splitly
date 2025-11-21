import { formatCurrency } from '~/utils/formatters'
import SearchIcon from '@mui/icons-material/Search'
import { useMemo, useState } from 'react'
import { TextField, InputAdornment } from '@mui/material'
import ParticipantCard from '~/components/Form/ParticipantCard'
import { Box, Typography } from '@mui/material'

function ParticipantAutoCaculateList({ participants, totalAmount }) {
  const [searchQuery, setSearchQuery] = useState('')

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
    <Box>
      <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 3, mb: 1}} />

      {/* Auto Calculate Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Tự động tính toán
        </Typography>
      </Box>
      {/* Search Field */}
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

      {/* Calculated Amounts - All Participants */}
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
              showAmountInput={false}
              onAmountChange={() => {}}
              onDelete={() => {}}
              canDelete={false}
            />
          ))
        )}
      </Box>

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Tổng cộng:
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {formatCurrency(totalAmount || 0)} ₫
        </Typography>
      </Box>
    </Box>
  )
}

export default ParticipantAutoCaculateList
