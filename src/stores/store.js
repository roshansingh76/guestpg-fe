import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import pgReducer from './pgSlice'
import userReducer from './userSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        pg: pgReducer,
        user: userReducer,
    },
})
