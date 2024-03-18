import { configureStore } from '@reduxjs/toolkit'
import useroptionsReducer from './slice'

export default configureStore({
  reducer: {
    useroptions: useroptionsReducer,
  },
})