import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = { currentUser: null }

export const loginUserAPI = createAsyncThunk('activeBoard/loginUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  return response.data
})

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showSuccessMessage) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
  if (showSuccessMessage) {
    toast.success('Logged out successfully')
  }
  return response.data
})

export const updateUserProfileAPI = createAsyncThunk('user/updateUserProfileAPI', async ({ profileData }) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, profileData)
  return response.data
})

// Fetch fresh user data from API
export const refreshCurrentUserAPI = createAsyncThunk('user/refreshCurrentUserAPI', async (userId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/${userId}`)
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(updateUserProfileAPI.fulfilled, (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    })
    builder.addCase(refreshCurrentUserAPI.fulfilled, (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    })
  },
})

export const { clearUser, updateUser } = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
