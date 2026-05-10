import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchPGs = createAsyncThunk(
    'pg/fetchPGs',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/pgs?page=${page}&limit=${limit}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch PGs')
        }
    }
)

export const fetchPGById = createAsyncThunk(
    'pg/fetchPGById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/pgs/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch PG')
        }
    }
)

export const createPG = createAsyncThunk(
    'pg/createPG',
    async (pgData, { rejectWithValue }) => {
        try {
            const response = await api.post('/pgs', pgData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create PG')
        }
    }
)

export const updatePG = createAsyncThunk(
    'pg/updatePG',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/pgs/${id}`, data)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update PG')
        }
    }
)

export const deletePG = createAsyncThunk(
    'pg/deletePG',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/pgs/${id}`)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete PG')
        }
    }
)

const initialState = {
    pgs: [],
    currentPG: null,
    isLoading: false,
    error: null,
    pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
    },
}

const pgSlice = createSlice({
    name: 'pg',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch PGs
            .addCase(fetchPGs.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchPGs.fulfilled, (state, action) => {
                state.isLoading = false
                state.pgs = action.payload.data || []
                state.pagination = action.payload.pagination || {}
            })
            .addCase(fetchPGs.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Fetch PG By ID
            .addCase(fetchPGById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchPGById.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentPG = action.payload
            })
            .addCase(fetchPGById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // Create PG
            .addCase(createPG.fulfilled, (state, action) => {
                state.pgs.push(action.payload)
            })
            // Update PG
            .addCase(updatePG.fulfilled, (state, action) => {
                const index = state.pgs.findIndex(pg => pg.id === action.payload.id)
                if (index !== -1) {
                    state.pgs[index] = action.payload
                }
                state.currentPG = action.payload
            })
            // Delete PG
            .addCase(deletePG.fulfilled, (state, action) => {
                state.pgs = state.pgs.filter(pg => pg.id !== action.payload)
            })
    },
})

export const { clearError } = pgSlice.actions
export default pgSlice.reducer
