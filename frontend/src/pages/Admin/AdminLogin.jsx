import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import axiosInstance from '../../utils/axiosinstance';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Check if user is already logged in (session exists)
  useEffect(() => {
    axiosInstance.get("/api/users/me", { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          navigate('/home');  // ✅ Redirect if already logged in
        }
      })
      .catch(() => {}); // Ignore errors if user isn't logged in
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    //Handles missing username field
    if (!username) {
      setError("An Username is required.");
      return;
    }
    //Handles missing password field
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/api/users/login", {
        username,
        password
      }, { withCredentials: true });  // ✅ Store session cookies
      // tracks errors and success
      if (response.status === 200) {
        await axiosInstance.get("/api/users/me", { withCredentials: true });
        navigate('/home');  // ✅ Redirect on success
      } else if  (response.status === 404){
        setError("User not found."); // when you attempt to login with an unknown account
      } else if (response.status === 400){
        setError("400 - Bad Request"); // generic error for unresolved requests
      } else if  (response.status === 403){
        setError("403 - Forbidden."); // generic addition (probably won't happen)
      } else if (response.status === 500){
        setError("500 - Internal Server Error"); // when nothing is found.
      } else if (response.status === 501){
        setError("501 - Not Implemented"); // for undeveloped areas that need to be fixed.
      }
      else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      // Handle network errors and server responses with error status
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 401:
            setError("Incorrect username or password. Please try again."); // password or username mismatch
            break;
          case 429:
            setError("Too many login attempts. Please wait and try again."); // database overflow from login attempts
            break;
          default:
            setError(data.message || "An error occurred during login."); // generic error
        }
      } else if (error.request) {
        setError("No response from server. Check your network connection."); // response not found
      } else {
        setError("Error with request."); // unexpected error
      }
    }
  };

  return (
    <>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>

            <input type='text' placeholder='Username' className='input-box' value={username} onChange={(e) => setUsername(e.target.value)} />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}  
            <button type='submit' className='btn-primary'>Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;