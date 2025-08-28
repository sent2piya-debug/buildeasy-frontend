import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import JobsList from "./pages/JobsList.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import PostJob from "./pages/PostJob.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Option A: using the wrapper page
import Planner from "./pages/planner.jsx";
// If you chose Option B earlier, instead do:
// import KitchenPlanner from "./planner/KitchenPlanner.jsx";

function Layout() {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: 960, margin: "20px auto", padding: 12 }}>
        <Outlet /> {/* <-- This is the important part */}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* If using wrapper page */}
          <Route path="/planner" element={<Planner />} />
          {/* If routing directly (Option B), use: 
             <Route path="/planner" element={<KitchenPlanner />} /> 
          */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
