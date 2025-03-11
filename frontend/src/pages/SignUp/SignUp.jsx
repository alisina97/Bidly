import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosinstance";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  // Address Fields
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(""); 
  const [customCountry, setCustomCountry] = useState(""); 
  const [postalCode, setPostalCode] = useState("");
  const [countries, setCountries] = useState([]); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🌍 Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const finalCountry = country === "Other" ? customCountry : country; // Use custom country if selected

    if (!username || !email || !firstName || !lastName || !streetName || !streetNumber || !city || !finalCountry || !postalCode || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    } else if (password == !confirmPassword){
      setError("Password mismatch. Remember to insert your password and confirm your password with the same password.");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        username,
        email,
        password,
        firstName,
        lastName,
        country: finalCountry, // ✅ Send selected or typed country
        city,
        postalCode,
        streetNumber,
        streetName,
      }).toString();
      
      const response = await axiosInstance.post(`/api/users/register?${queryParams}`);

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred, please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-20">
        <div className="w-[600px] border rounded bg-white px-7 py-10">
          <h4 className="text-2xl mb-7 text-center">Sign Up</h4>
          <form onSubmit={handleSignUp} className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className="input-box w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                className="input-box w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="First Name"
                className="input-box w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input-box w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <input 
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password" // Added for consistency
              />
            </div>

            {/* Right Column */}
            <div>
              <input
                type="text"
                placeholder="Street Number"
                className="input-box w-full"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Street Name"
                className="input-box w-full"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="input-box w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              {/* ✅ Country Dropdown with API */}
              <select
                className="input-box w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map((c, index) => (
                  <option key={index} value={c}>{c}</option>
                ))}
                <option value="Other">Other</option>
              </select>

              {/* ✅ Show input if "Other" is selected */}
              {country === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Country Name"
                  className="input-box w-full mt-2"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                />
              )}

              <input
                type="text"
                placeholder="Postal Code"
                className="input-box w-full"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm col-span-2 text-center">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-500 text-sm col-span-2 text-center">{success}</p>}

            {/* Submit Button */}
            <button type="submit" className="btn-primary col-span-2 w-full">Create Account</button>

            {/* Login Link */}
            <p className="text-sm text-center col-span-2 mt-4">
              Already have an account?{" "}
              <Link to={"/login"} className="font-medium text-primary underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;