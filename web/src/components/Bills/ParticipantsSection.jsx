import { Box, Typography } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { COLORS } from '~/theme'
import ParticipantCard from '~/components/Form/ParticipantCard'
import Button from '@mui/material/Button'

function ParticipantsSection({
  participants,
  splitType,
  onOpenParticipantDialog,
  onDeleteParticipant,
  onParticipantAmountChange,
}) {
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            showAmountInput={splitType === 'by-person'}
            onAmountChange={(amount) => onParticipantAmountChange(participant.id, amount)}
            onDelete={() => onDeleteParticipant(participant.id)}
            canDelete={participants.length > 1}
          />
        ))}
      </Box>
    </Box>
  )
}

export default ParticipantsSection
