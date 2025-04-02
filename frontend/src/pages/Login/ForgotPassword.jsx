import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'  
import axiosInstance from '../../utils/axiosinstance'

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post("/api/users/forgot-password", { username });
      if (res.status === 200) {
        setMessage("Redirecting to reset password...");
        setTimeout(() => {
          navigate("/reset-password");  
        }, 1500);
      } else {
        setError("Unexpected error. Please try again later.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Username not found.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleSubmit}>
          <h4 className='text-2xl mb-5'>Forgot Password</h4>
          <input
            type='text'
            placeholder='Enter your username'
            className='input-box'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {message && <p className='text-green-500 text-sm pt-2'>{message}</p>}
          {error && <p className='text-red-500 text-sm pt-2'>{error}</p>}
          <button type='submit' className='btn-primary mt-4'>Reset Password</button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword;