import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import api from "../api";
export default function JobsList() {
  return <h2>Jobs List OK</h2>;
}
  const [jobs,setJobs]=useState([]); const [error,setError]=useState("");
  const user = JSON.parse(localStorage.getItem("user")||"null");
  useEffect(()=>{(async()=>{try{const {data}=await api.get("/jobs"); setJobs(data);}catch(e){setError("Please login to view jobs.");}})();},[]);
  if(!user) return <p style={{marginTop:20}}>Please <Link to="/login">login</Link> to view jobs.</p>;
  return(<div><h2>{user.role==="agent"?"All Jobs":(user.role==="contractor"?"Open Jobs":"My Jobs")}</h2>
    {error&&<p style={{color:"red"}}>{error}</p>}
    {jobs.map(job=>(<div key={job.id} className="card">
      <div className="flex" style={{justifyContent:"space-between"}}>
        <div><h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3><p>{job.description}</p>
          <div className="flex"><span className="badge">{job.status}</span>
            <span className="badge">Budget: {job.budget_min}–{job.budget_max} THB</span>
            {job.location&&<span className="badge">{job.location}</span>}</div></div></div></div>))}
  </div>);
}
