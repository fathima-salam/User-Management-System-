import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const setUserData = createAsyncThunk('user/setUserData', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/user/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in register data');
    }
});

export const loginUserData = createAsyncThunk('user/loginUserData', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5001/api/user/login', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in login data');
    }
});

export const updateUserData = createAsyncThunk('user/updateUserData', async ({ data, id, token }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:5001/api/user/update-data/${id}`, data, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in update data');
    }
});

export const imageUpdateUpload = createAsyncThunk('user/imageUpdateUpload', async ({ data, token }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`http://localhost:5001/api/user/update-profile`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in image uploading');
    }
});

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (token, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5001/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'something went wrong in fetching user profile');
    }
});

const userDataSlice = createSlice({
    name: "userData",
    initialState: {
        name: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : '',
        email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email : '',
        _id: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : '',
        profile_Image: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).profileImage : '',
        loading: false,
        error: null,
        token: localStorage.getItem("token") || null,
        isAuthenticated: !!localStorage.getItem("token"),
        isAdmin: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).isAdmin
            : false,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.name = '';
            state.email = '';
            state._id = '';
            state.profile_Image = '';
            state.isAuthenticated = false;
            state.isAdmin = false;

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            try {
                const channel = new BroadcastChannel('auth_channel');
                channel.postMessage({ type: 'LOGOUT', source: 'user' });
                channel.close();
            } catch (err) {
                console.log('BroadcastChannel not supported');
            }

            localStorage.setItem('logout-event', Date.now().toString());
            localStorage.removeItem('logout-event');
        },
        clearError: (state) => {
            state.error = null;
        },
        syncLogout: (state) => {
            state.token = null;
            state.name = '';
            state.email = '';
            state._id = '';
            state.profile_Image = '';
            state.isAuthenticated = false;
            state.isAdmin = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setUserData.fulfilled, (state, action) => {
                const { token, user } = action.payload;
                state.token = token;
                state.loading = false;
                state.name = user.name;
                state.profile_Image = user.profileImage;
                state._id = user._id;
                state.email = user.email;
                state.isAuthenticated = !!token;
                state.isAdmin = user.isAdmin;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(setUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserData.fulfilled, (state, action) => {
                const { token, user } = action.payload;
                state.token = token;
                state.loading = false;
                state.name = user.name;
                state._id = user._id;
                state.profile_Image = user.profileImage;
                state.email = user.email;
                state.isAuthenticated = !!token;
                state.isAdmin = user.isAdmin;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(loginUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserData.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.loading = false;
                state.name = user.name;
                state._id = user._id;
                state.profile_Image = user.profileImage;
                state.email = user.email;
                state.isAdmin = user.isAdmin;

                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(updateUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(imageUpdateUpload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(imageUpdateUpload.fulfilled, (state, action) => {
                const { user } = action.payload;
                state.loading = false;
                state.name = user.name;
                state._id = user._id;
                state.profile_Image = user.profileImage;
                state.email = user.email;
                state.isAdmin = user.isAdmin;

                localStorage.setItem("user", JSON.stringify(user));
            })
            .addCase(imageUpdateUpload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
.addCase(fetchUserProfile.fulfilled, (state, action) => {
    const { user } = action.payload;
    state.loading = false;
    state.name = user.name;
    state._id = user._id;
    state.profile_Image = user.profileImage;
    state.email = user.email;
    state.isAdmin = user.isAdmin;
    localStorage.setItem("user", JSON.stringify(user));
})

            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError, syncLogout } = userDataSlice.actions;
export default userDataSlice.reducer;