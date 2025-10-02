import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (token, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5001/api/admin/dataFetching', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in fetching data')
    }
})
export const addUser = createAsyncThunk('admin/addUser', async ({ name, email, password, token }, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/admin/addUser', { name, email, password }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Something went wrong in adding user' });
    }
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ id, name, email, token }, { rejectWithValue }) => {
    try {
        const response = await axios.put('http://localhost:5001/api/admin/updateUser', { id, name, email }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Something went wrong in updating user' });
    }
})

export const deleteUser = createAsyncThunk('admin/deletUser', async ({ id, token }, { rejectWithValue }) => {
    try {
        const response = await axios.delete('http://localhost:5001/api/admin/deleteUser', {
            headers: { Authorization: `Bearer ${token}` },
            data: { id },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: 'Something went wrong in delete user' });
    }
})

const allUsersData = createSlice({
    name: 'users',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                const { data } = action.payload;
                state.data = data;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export default allUsersData.reducer;