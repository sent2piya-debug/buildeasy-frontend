import { Link, useNavigate } from "react-router-dom";
export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
  return (
    <nav className="container header">
      <div><Link to="/jobs"><strong>BuildEasy</strong></Link></div>
      <div className="flex" style={{ gap: 12 }}>
        <Link to="/planner"><strong>Kitchen Planner</strong></Link>
        {user?.role === "customer" && <Link to="/post-job">Post Job</Link>}
        {user?.role === "agent" && <Link to="/post-job">Create Job</Link>}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="badge">{user.role}</span>
            <span>{user.name}</span>
            <button className="secondary" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
