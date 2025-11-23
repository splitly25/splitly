import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { activeBillReducer } from './bill/activeBillSlice'
import { notificationReducer } from './notification/notificationSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'],
}

const reducers = combineReducers({
  user: userReducer,
  activeBill: activeBillReducer,
  notifications: notificationReducer,
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})
