import React, { useEffect, useState } from "react";
import { signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/Firebase_Config";
import "./LoginForm.css";

const LoginPage = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          avatar: user.photoURL,
        };
        navigate("/");
      } else {
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = () => {
    signInWithRedirect(auth, provider);
  };

  const [formData, setFormData] = useState({ emailOrPhone: "" });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-box">
      <h1 className="logo-name">▼ CraFtLy</h1>
      <h1>One step to your creation</h1>
      <div className="login-page">
        <h2>Create your Account</h2>
        <button className="microsoft-button" onClick={handleLogin}>
          <span className="microsoft-icon" /> Sign in with Microsoft
        </button>
        <p>Or</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email Address or Mobile Number"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className="email-or-phone-input"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;