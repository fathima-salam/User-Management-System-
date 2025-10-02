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
                                setData({ name, email });
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
        <div>
            {
                loading && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                            <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-lg font-semibold text-gray-800">Loading...</span>
                        </div>
                    </div>
                )
            }

            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Home Page</span>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

                        {
                            token ? <div>
                                <a className='text-white mr-6 hover:underline cursor-pointer hover:text-blue-700' onClick={() => navigate('/profile')}>Profile</a>
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleLogout}>Logout</button>
                            </div> :
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => navigate('/login')}>Login</button>

                        }

                    </div>

                </div>
            </nav>

            <h1 className='text-center text-3xl text-blue-900 m-[20%]'>Hello {name ? name : 'Guest'}</h1>
        </div>
    )
}

export default Home
