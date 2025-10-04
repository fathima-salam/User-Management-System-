import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, logout } from '../../../redux-toolkit/userDataReducer'
import { toast } from "react-hot-toast";


function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    function handleLogout() {
        dispatch(logout());
        toast.success('Logout Successfully')
        navigate('/login')
    }
    const token = useSelector((state) => {
        return state.userData.token
    })
    const name = useSelector((state) => {
        return state.userData.name
    })

    const err = useSelector((state) => state.userData.error);
    const loading = useSelector((state) => state.userData.loading)

    if (err) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
                <div className="max-w-lg w-full bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-6 relative">

                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-6 w-6 text-red-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728m12.728 0L5.636 5.636" />
                            </svg>
                        </div>

                        <div className="ml-3 flex-1">
                            <h3 className="text-lg font-semibold text-red-700">Something went wrong</h3>
                            <p className="mt-2 text-sm text-gray-700">
                                {err.message?.errors?.email?.message || err.message?.message || "Unknown error occurred"}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                dispatch(clearError());
                            }}
                            className="ml-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <span className="sr-only">Close</span>
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
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
                            Welcome Back, <span className="text-gray-300">{name ? name : 'Guest'}</span>
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