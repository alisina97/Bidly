import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../../utils/axiosinstance';


function ResetPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/users/reset-password", {
        username,
        newPassword
      });

      if (response.status === 200) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 1500); 
      } else {
        setError("Unexpected error. Try again later.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Username not found.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleSubmit}>
          <h4 className='text-2xl mb-5'>Reset Password</h4>

          <input
            type="text"
            placeholder="Username"
            className="input-box"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="input-box mt-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input-box mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && <p className='text-green-500 text-sm pt-2'>{message}</p>}
          {error && <p className='text-red-500 text-sm pt-2'>{error}</p>}

          <button type="submit" className="btn-primary mt-4">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;