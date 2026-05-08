import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { users } from '../data/mockData'

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        const user = users.find(
            (account) => account.email === email && account.password === password
        )

        if (!user) {
            return rejectWithValue('Invalid email or password')
        }

        const token = `demo-token-${user.role}`
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { token, user }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return null
    }
)

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
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
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false
                state.user = null
                state.token = null
                state.isAuthenticated = false
                state.error = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
