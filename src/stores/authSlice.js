import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi } from '../services/authService'

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await loginApi(email, password)
            const token = data.token
            const user = data.user
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            return { token, user }
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Invalid email or password'
            )
        }
    }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
})

const storedUser = localStorage.getItem('user')

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuthenticated = false
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.error = null
            })
    },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
