import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
// import { mockData } from '~/apis/mock-data'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />

    </Container >
  )
}

export default Board