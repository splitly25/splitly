import { Card, CardContent, Box, Typography, Avatar, IconButton, Chip, AvatarGroup } from '@mui/material'
import { Delete, People, Groups as GroupsIcon } from '@mui/icons-material'
import { COLORS } from '~/theme'
import { getInitials } from '~/utils/formatters'

function GroupCard({ group, onClick, onDelete }) {
  const memberCount = group.members?.length || 0
  const displayMembers = (group.members || []).slice(0, 5)
  // const remainingCount = memberCount - 5

  return (
    <Card
      sx={{
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          borderColor: 'primary.main',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: COLORS.gradientPrimary,
                borderRadius: '14px',
              }}
            >
              <GroupsIcon sx={{ fontSize: '28px' }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: '18px',
                  mb: 0.5,
                }}
              >
                {group.groupName || 'Unnamed Group'}
              </Typography>
              {group.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {group.description}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <Delete sx={{ fontSize: '18px' }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <People sx={{ fontSize: '18px', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontWeight: 500 }}>
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </Typography>
            </Box>

            {memberCount > 0 && (
              <AvatarGroup
                max={5}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 28,
                    height: 28,
                    fontSize: '12px',
                    border: (theme) => `2px solid ${theme.palette.background.paper}`,
                  },
                }}
              >
                {displayMembers.map((member, idx) => (
                  <Avatar
                    key={member._id || idx}
                    sx={{
                      bgcolor: 'primary.main',
                      width: 28,
                      height: 28,
                      fontSize: '11px',
                    }}
                  >
                    {getInitials(member.displayName || member.name || member.email)}
                  </Avatar>
                ))}
              </AvatarGroup>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default GroupCard
