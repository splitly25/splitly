// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogActionsProps: { maxWidth: 'xs' }, confirmationButtonProps: { variant: 'outlined' }, cancellationButtonProps: { color: 'inherit' }, buttonOrder: ['confirm', 'cancel']
        }}>
          <CssBaseline enableColorScheme />
          <App />
          <ToastContainer />
        </ConfirmProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
)
