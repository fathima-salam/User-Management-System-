import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const adminLogin = createAsyncThunk('admin/adminLogin', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/admin/login', { email, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
    }
})

const adminDataSlice = createSlice({
    name: 'adminData',
    initialState: {
        email: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).email : '',
        id: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin"))._id : '',
        loading: false,
        error: null,
        token: localStorage.getItem('admin-token')||null,
        isAuthenticated: !!localStorage.getItem('admin-token'),
        isAdmin: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).isAdmin : false
    },
    reducers: {
        logout:(state)=>{
            state.email='';
            state.id='';
            state.token=null;
            state.isAuthenticated=false;
            state.isAdmin=false;

            localStorage.removeItem("admin");
            localStorage.removeItem("admin-token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                const { token, admin } = action.payload;
                state.email = admin.email;
                state.token = token;
                state.id = admin._id;
                state.loading = false;
                state.isAdmin = admin.isAdmin;
                state.isAuthenticated = !!token;

                localStorage.setItem('admin-token', token);
                localStorage.setItem('admin', JSON.stringify(admin));

            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const {logout}=adminDataSlice.actions;
export default adminDataSlice.reducer;