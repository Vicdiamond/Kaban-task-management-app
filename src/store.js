import { configureStore } from '@reduxjs/toolkit'
import dummyDataSlice from './features/slices/dummyDataSlice'

const store = configureStore({
  reducer: {
    boards: dummyDataSlice
  }
})

export default store
