import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

// Export as 'adminLogin' to match your existing imports
export const adminLogin = createAsyncThunk('admin/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/admin/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in admin login');
    }
});

const adminDataSlice = createSlice({
    name: "adminData",
    initialState: {
        email: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")).email : '',
        _id: localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin"))._id : '',
        loading: false,
        error: null,
        token: localStorage.getItem("adminToken") || null,
        isAuthenticated: !!localStorage.getItem("adminToken"),
        isAdmin: localStorage.getItem("admin") 
            ? JSON.parse(localStorage.getItem("admin")).isAdmin 
            : false,
    },
    reducers: {
        logout: (state) => {
            // Clear Redux state
            state.token = null;
            state.email = '';
            state._id = '';
            state.isAuthenticated = false;
            state.isAdmin = false;
            
            // Clear localStorage
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            
            // Broadcast logout to other tabs using BroadcastChannel
            try {
                const channel = new BroadcastChannel('auth_channel');
                channel.postMessage({ type: 'LOGOUT', source: 'admin' });
                channel.close();
            } catch (err) {
                console.log('BroadcastChannel not supported');
            }
            
            // Also trigger storage event for older browsers
            localStorage.setItem('logout-event', Date.now().toString());
            localStorage.removeItem('logout-event');
        },
        clearError: (state) => {
            state.error = null;
        },
        // New action to handle logout from other tabs (doesn't broadcast again)
        syncLogout: (state) => {
            state.token = null;
            state.email = '';
            state._id = '';
            state.isAuthenticated = false;
            state.isAdmin = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Admin login
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                const { token, admin } = action.payload;
                state.token = token;
                state.loading = false;
                state.email = admin.email;
                state._id = admin._id;
                state.isAuthenticated = !!token;
                state.isAdmin = admin.isAdmin;

                localStorage.setItem("adminToken", token);
                localStorage.setItem("admin", JSON.stringify(admin));
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError, syncLogout } = adminDataSlice.actions;

export default adminDataSlice.reducer;