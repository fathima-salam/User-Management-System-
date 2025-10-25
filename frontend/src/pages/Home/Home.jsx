import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, logout } from '../../../redux-toolkit/userDataReducer'
import { toast } from "react-hot-toast";


function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const token = useSelector((state) => state.userData.token)
    const name = useSelector((state) => state.userData.name)
    const err = useSelector((state) => state.userData.error);
    const loading = useSelector((state) => state.userData.loading)

    // Redirect to login if token is lost (due to cross-tab logout)
    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true });
        }
    },[token, navigate]);

    function handleLogout() {
        dispatch(logout());
        toast.success('Logout Successfully')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-black">
            {
                loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-2xl flex items-center space-x-4">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg font-semibold text-gray-800">Loading...</span>
                        </div>
                    </div>
                )
            }

            {/* Navigation */}
            <nav className="bg-black border-b border-gray-800 shadow-lg">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
                    <span className="self-center text-2xl font-bold text-white tracking-wide">User Management System</span>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {
                            token ? <div className="flex items-center gap-4">
                                <a className='text-white font-medium hover:text-gray-300 cursor-pointer transition-colors' onClick={() => navigate('/profile')}>Profile</a>
                                <button type="button" className="text-black bg-white hover:bg-gray-200 font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200" onClick={handleLogout}>Logout</button>
                            </div> :
                                <button type="button" className="text-black bg-white hover:bg-gray-200 font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200" onClick={() => navigate('/login')}>Login</button>
                        }
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="min-h-screen grid place-items-center">
                <div className="max-w-screen-xl mx-auto px-4 py-16">
                    <div className="text-center mb-16">
                        <h1 className='text-5xl font-bold text-white mb-4'>
                            Welcome Back, <span className="text-gray-300">{name || 'Guest'} </span>
                        </h1>
                        <p className="text-gray-400 text-lg">Your personalized dashboard for managing your account</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black border-t border-gray-800 mt-16">
                <div className="max-w-screen-xl mx-auto px-4 py-8">
                    <p className="text-center text-gray-500 text-sm">
                        © 2024 User Management System. All rights reserved. Built with security and user experience in mind.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home