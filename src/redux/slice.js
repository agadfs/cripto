import { createSlice } from '@reduxjs/toolkit'

export const coinsDataSlice = createSlice({
  name: 'useroptions',
  initialState: {
    lang: 'usd',
    currency: 'usd',
  },
  reducers: {
    setlanguage: (state, action) => {
      state.lang = action.payload
    },
    setcurrency: (state, action) => {
      state.currency = action.payload
    },
    
    
  },
})


export const { setlanguage, setcurrency } = coinsDataSlice.actions

export default coinsDataSlice.reducer