// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

// pages
import Home from "./pages/Home.jsx";
import JobsList from "./pages/JobsList.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import PostJob from "./pages/PostJob.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Planner from "./pages/planner.jsx"; // wrapper that renders KitchenPlanner

export default function App() {
  return (
    <>
      <NavBar />
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/planner" element={<Planner />} />
          {/* catch-all -> home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}
