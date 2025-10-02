import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import DashBoard from './pages/Dashboard/DashBoard';

function App() {
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
          <Route path='*' element={<NotFound />}/>
          <Route path='/admin-login' element={<AdminLogin />}/>
          <Route path='/dashboard' element={<DashBoard />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
