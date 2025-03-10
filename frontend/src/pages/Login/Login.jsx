import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import axiosInstance from '../../utils/axiosinstance';

function Login() {

  const [username, setUsername] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username) {
      setError("Please enter the username.");
      return;
    }
  
    if (!password) {
      setError("Please enter the password.");
      return;
    }
  
    setError("");
  
    try {
      const response = await axiosInstance.post("/api/users/login", {
        username,
        password
      });
  
      if (response.status === 200 && response.data === "Login Successful!") {
        navigate('/home'); 
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      setError(error.response?.data || "Invalid username or password. Please try again.");
    }
  };

  return (
    <>
    <Navbar />

    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl mb-7'>Login</h4>
          
          <input type='text' placeholder='username' className='input-box' value={username} onChange={(e) => setUsername(e.target.value)} />
          <PasswordInput 
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

          {error && <p className='text-red-500 text xs pb-1'>{error}</p> }  
          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-sm text-center mt-4'>
            Not registered? {" "}
            <Link to={"/SignUp"} className='font-medium text-primary underline'>Create an Account</Link>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login