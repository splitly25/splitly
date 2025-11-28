// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'
import { store } from '~/redux/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from '~/App.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
import { injectStore } from '~/utils/authorizeAxios.js'
import { ChatbotProvider } from '~/context/ChatbotContext.jsx'
injectStore(store)

// socket.io client setup
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
export const socketIoInstance = io(API_ROOT)

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChatbotProvider>
          <CssVarsProvider theme={theme} defaultMode="light">
            <ConfirmProvider
              defaultOptions={{
                dialogActionsProps: { maxWidth: 'xs' },
                confirmationButtonProps: { variant: 'outlined' },
                cancellationButtonProps: { color: 'inherit' },
                buttonOrder: ['confirm', 'cancel'],
              }}
            >
              <CssBaseline enableColorScheme />
              <App />
              <ToastContainer />
            </ConfirmProvider>
          </CssVarsProvider>
        </ChatbotProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
