import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import NavBar from "./components/NavBar";
import JobsList from "./pages/JobsList";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Planner from "./pages/planner";  // wrapper that loads KitchenPlanner

function Layout() {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: 960, margin: "20px auto", padding: 12 }}>
        <Outlet />  {/* 👈 this is where page content renders */}
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
          <Route path="/planner" element={<Planner />} />   {/* 👈 here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

