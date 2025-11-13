import { Box, Avatar, Typography, IconButton, Chip } from '@mui/material'
import { COLORS } from '~/theme'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomTextField from './CustomTextField'
import { getInitials } from '~/utils/formatters'
import { formatCurrency } from '~/utils/formatters'

const ParticipantCard = ({ participant, showAmountInput = false, onAmountChange, onDelete, canDelete = true }) => {
  return (
    <Box
      sx={(theme) => ({
        border: `0.8px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        padding: '16px',
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: showAmountInput ? 1.5 : 0 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: COLORS.gradientPrimary,
              fontSize: '16px',
              fontWeight: 400,
              color: '#FFFFFF',
            }}
          >
            {getInitials(participant.name)}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'text.primary',
                lineHeight: 1.5,
              }}
            >
              {participant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                  lineHeight: 1.4,
                }}
              >
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
                          height: '18px',
                          fontSize: '10px',
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '& .MuiChip-label': {
                            px: 0.75,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.secondary',
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              Số tiền
            </Typography>
            <Chip
              sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F5F5F5',
                color: theme.palette.text.primary,
                fontSize: '14px',
                fontWeight: 500,
                height: '26px',
                borderRadius: '16px',
                '& .MuiChip-label': {
                  padding: '0 8px',
                },
              })}
              label={formatCurrency(participant.amount)}
            />
          </Box>
          {canDelete && (
            <IconButton size="small" onClick={onDelete} sx={{ ml: 1, color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {showAmountInput && (
        <CustomTextField
          label="Số tiền sử dụng"
          type="text"
          value={participant.usedAmount || ''}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value)
            onAmountChange(isNaN(numValue) ? 0 : numValue)
          }}
          placeholder="VD: 100+200 hoặc 500*3 hoặc 1000/4"
          enableAutoCalculate
        />
      )}
    </Box>
  )
}

export default ParticipantCard
