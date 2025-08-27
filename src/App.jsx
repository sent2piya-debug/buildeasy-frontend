import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import JobsList from "./pages/JobsList.jsx";
import PostJob from "./pages/PostJob.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import NavBar from "./components/NavBar.jsx";
import "./styles.css";

function Layout({ children }) {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: 960, margin: "20px auto", padding: "0 16px" }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {   // <-- DEFAULT EXPORT
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </Layout>
  );
}

