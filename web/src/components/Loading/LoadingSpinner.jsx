import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function LoadingSpinner({ caption, containerStyle }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100%',
        height: '100%',
        minHeight: '200px',
        ...containerStyle,
      }}
    >
      <CircularProgress />
      {caption && (
        <Typography
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  )
}

export default LoadingSpinner
