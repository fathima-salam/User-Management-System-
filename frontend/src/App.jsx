import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import DashBoard from './pages/Dashboard/DashBoard';

import { fetchUserProfile, syncLogout as userSyncLogout, logout as userLogout } from '../redux-toolkit/userDataReducer';
import { syncLogout as adminSyncLogout, logout as adminLogout } from '../redux-toolkit/adminDataReducer';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.data?.deleted === true) {
                    const message = error.response.data.message || "Your account has been deleted";
                    toast.error(message, { duration: 4000 });
                    
                    const requestUrl = error.config?.url || '';
                    const isAdminRequest = requestUrl.includes('/api/admin/');
                    
                    if (isAdminRequest) {
                        dispatch(adminLogout());
                        setTimeout(() => {
                            window.location.href = '/admin-login';
                        }, 1000);
                    } else {
                        dispatch(userLogout());
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1000);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [dispatch]);

    // ✅ Handle logout sync between tabs
    useEffect(() => {
        let channel;
        try {
            channel = new BroadcastChannel('auth_channel');
            channel.onmessage = (event) => {
                if (event.data.type === 'LOGOUT') {
                    if (event.data.source === 'admin') {
                        dispatch(adminSyncLogout());
                        if (window.location.pathname.includes('admin') || window.location.pathname.includes('dashboard')) {
                            window.location.href = '/admin-login';
                        }
                    } else if (event.data.source === 'user') {
                        dispatch(userSyncLogout());
                        if (!window.location.pathname.includes('admin')) {
                            window.location.href = '/login';
                        }
                    }
                }
            };
        } catch (err) {
            console.log('BroadcastChannel not supported, using storage events');
        }

        const handleStorageChange = (e) => {
            if (e.key === 'adminToken' && e.oldValue && !e.newValue) {
                dispatch(adminSyncLogout());
                if (window.location.pathname.includes('admin') || window.location.pathname.includes('dashboard')) {
                    window.location.href = '/admin-login';
                }
            }
            
            if (e.key === 'token' && e.oldValue && !e.newValue) {
                dispatch(userSyncLogout());
                if (!window.location.pathname.includes('admin')) {
                    window.location.href = '/login';
                }
            }
            
            if (e.key === 'user' && e.oldValue && !e.newValue) {
                dispatch(userSyncLogout());
                if (!window.location.pathname.includes('admin')) {
                    window.location.href = '/login';
                }
            }
            
            if (e.key === 'admin' && e.oldValue && !e.newValue) {
                dispatch(adminSyncLogout());
                if (window.location.pathname.includes('admin') || window.location.pathname.includes('dashboard')) {
                    window.location.href = '/admin-login';
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            if (channel) {
                channel.close();
            }
        };
    }, [dispatch]);

    // ✅ Fetch user data on refresh if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(fetchUserProfile(token));  // This keeps Redux data updated
        }
    }, [dispatch]);

    return (
        <div>
            <Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 2000,
                        style: {
                            background: "#363636",
                            color: "#fff",
                        },
                    }}
                />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='/admin-login' element={<AdminLogin />} />
                    <Route path='/dashboard' element={<DashBoard />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;