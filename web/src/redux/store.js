import { configureStore } from '@reduxjs/toolkit'

// Placeholder reducer until we add actual slices
const placeholderReducer = (state = {}, action) => {
  return state
}

export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer
  },
})