import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUserData } from "../../../redux-toolkit/userDataReducer";
import { toast } from "react-hot-toast";



function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const token = useSelector((state) => state.userData.token);
  const loading = useSelector((state) => state.userData.loading)


  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate])


  const [data, setData] = useState({
    email: '',
    password: ''
  })

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUserData(data)).unwrap()
      .then((res) => {
        toast.success(res.message)
        navigate('/')
      })
      .catch((err) => {
        toast.error(err.message||'something went wrong.please try again')
        console.log(err)
      })
  }


  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }



  return (
    <div className="login-page">
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

      <div className="login-container">
        <h1 className="text-2xl font-bold mb-7 text-black text-center">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-5">
            <label htmlFor="email" className="block mb-2 font-bold text-black">
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
              className="w-full p-3 border-2 border-black bg-white text-base outline-none focus:shadow-[4px_4px_0px_#000000] transition-all duration-300"
            />
          </div>

          <div className="input-group mb-5">
            <label htmlFor="password" className="block mb-2 font-bold text-black">
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
              className="w-full p-3 border-2 border-black bg-white text-base outline-none focus:shadow-[4px_4px_0px_#000000] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#FF5E5B] text-white border-2 border-black text-base font-bold cursor-pointer mt-2.5 hover:shadow-[4px_4px_0px_#000000] hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300"
          >
            SIGN IN
          </button>
        </form>
        <div className="footer mt-5 text-center text-black">
          Don't have an account?{" "}
          <a onClick={() => navigate('/register')} href="#" className="font-bold text-black underline">
            Sign up
          </a>
        </div>

      </div>
    </div>
  );
}

export default Login;