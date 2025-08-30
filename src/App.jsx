import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import JobsList from "./pages/JobsList.jsx";
import Planner from "./pages/planner.jsx";

export default function App() {
  return (
    <>
      <NavBar />
      <div className="container" style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
