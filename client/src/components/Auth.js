import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import './Auth.css';

function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // --- THE MISSING FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const endpoint = isRegistering ? "register" : "login";
    try {
      const response = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          alert("Account created! You can now log in.");
          setIsRegistering(false);
        } else {
          // Success: Save to LocalStorage and update App State
          const userData = { username: data.username, token: data.token };
          localStorage.setItem("witbriUser", JSON.stringify(userData));
          onLogin(userData);
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Cannot connect to server. Check your backend.");
    }
  };

  return (
    <div className="insta-auth">
      <div className="auth-card">
        <h1 className="witbri-logo">WitbriChat</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="insta-input"
            type="text"
            placeholder="Username"
            required
            autoComplete="username"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          
          <div className="password-container">
            <input
              className="insta-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              autoComplete="current-password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </span>
          </div>
          
          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit" className="auth-btn">
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? " Log In" : " Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;