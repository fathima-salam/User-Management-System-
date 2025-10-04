import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../../redux-toolkit/adminDataReducer";
import toast from "react-hot-toast";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isAuthenticated = useSelector((state) => state.adminData.isAuthenticated);
    const loading = useSelector((state) => state.adminData.loading);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(adminLogin({ email, password })).unwrap()
            .then((res) => {
                toast.success(res.message);
                navigate('/dashboard');
            })
            .catch((err) => {
                toast.error(err.message || 'Something went wrong, please try again.');
                console.log(err);
            });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
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

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        ADMIN <span className="bg-white text-black px-3 py-1 rounded-md">LOGIN</span>
                    </h1>
                    <p className="text-gray-400 mt-4">Access administrative dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-900 border-2 border-gray-800 rounded-lg p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-wide">LOG IN</h2>
                        <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block mb-2 font-bold text-white text-sm tracking-wide"
                            >
                                EMAIL
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block mb-2 font-bold text-white text-sm tracking-wide"
                            >
                                PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded pr-20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-semibold"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-white text-black border-2 border-white text-base font-bold cursor-pointer mt-4 hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded tracking-wide"
                        >
                            SIGN IN
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Secure admin access with encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;