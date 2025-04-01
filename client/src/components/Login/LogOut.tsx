import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.js";
import { message } from "antd";

const Logout = () => {
  const navigate = useNavigate();
  const { setId } = useUser();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigate("/");
    setTimeout(() => {
      setId(null);
    }, 500);

    message.success("Logged out successfully");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
