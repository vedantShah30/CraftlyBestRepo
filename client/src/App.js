import React, { useState } from "react";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./components/Editor/Editor.tsx";
import ProtectedRoutes from "./context/ProtectedRoutes.tsx";
import Landing from "./components/Landing/Landing.jsx";
import { UserProvider, useUser } from "./context/UserContext.js";
import { message } from "antd";

function AppContent() {
  const { loading } = useUser();

  if (loading) {
    message.loading({ content: "Loading...", key: "loading" });
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
