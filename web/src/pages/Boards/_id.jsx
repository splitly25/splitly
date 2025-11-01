import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
// import { mockData } from '~/apis/mock-data'

function Board() {
  const { boardId } = useParams()

  useEffect(() => {

  }, [boardId])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
    </Container >
  )
}

export default Board