import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async ({ page = 1, limit = 10, role }, { rejectWithValue }) => {
        try {
            const url = role ? `/users?page=${page}&limit=${limit}&role=${role}` : `/users?page=${page}&limit=${limit}`
            const response = await api.get(url)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
        }
    }
)

export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/users', userData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user')
        }
    }
)

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/users/${id}`, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user')
        }
    }
)

const initialState = {
    users: [],
    isLoading: false,
    error: null,
    pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
    },
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload.data || []
                state.pagination = action.payload.pagination || {}
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload)
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id)
                if (index !== -1) {
                    state.users[index] = action.payload
                }
            })
    },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
