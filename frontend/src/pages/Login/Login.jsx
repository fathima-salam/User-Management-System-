import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUserData } from "../../../redux-toolkit/userDataReducer";
import { toast } from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.userData.token);
  const loading = useSelector((state) => state.userData.loading);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUserData(data)).unwrap()
      .then((res) => {
        toast.success(res.message);
        navigate('/');
      })
      .catch((err) => {
        toast.error(err.message || 'something went wrong. please try again');
        console.log(err);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

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
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 border-2 border-gray-800 rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-white text-center tracking-wide">LOGIN</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-bold text-white text-sm tracking-wide">
                EMAIL
              </label>
              <input
                type="email"
                onChange={handleChange}
                name="email"
                value={data.email}
                required
                id="email"
                placeholder="your@email.com"
                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-bold text-white text-sm tracking-wide">
                PASSWORD
              </label>
              <input
                onChange={handleChange}
                name="password"
                type="password"
                required
                value={data.password}
                id="password"
                placeholder="••••••••"
                className="w-full p-3 border-2 border-gray-700 bg-black text-white text-base outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-white text-black border-2 border-white text-base font-bold cursor-pointer mt-4 hover:shadow-[6px_6px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 rounded tracking-wide"
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <a 
              onClick={() => navigate('/register')} 
              className="font-bold text-white underline cursor-pointer hover:text-gray-300 transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>Secure login with industry-standard encryption</p>
        </div>
      </div>
    </div>
  );
}

export default Login;