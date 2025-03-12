import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
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

    if (!username || !password) {
      setError("Invalid username or password. Please try again.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/api/users/login", {
        username,
        password
      }, { withCredentials: true });  // ✅ Store session cookies

      if (response.status === 200) {
        navigate('/home');  // ✅ Redirect on success
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      setError(error.response?.data || "Invalid username or password. Please try again.");
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

            <p className='text-sm text-center mt-4'>
              Not a Bidlier? {" "}
              <Link to={"/SignUp"} className='font-medium text-primary underline'>Sign Up Now!</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;
