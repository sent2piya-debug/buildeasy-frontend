import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import JobsList from "./pages/JobsList.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import PostJob from "./pages/PostJob.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Planner from "./pages/planner.jsx"; // wrapper page

export default function App() {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: 960, margin: "20px auto", padding: "0 16px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

