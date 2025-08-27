import React,{useState} from "react";
import api from "../api";
export default function PostJob(){
  const [form,setForm]=useState({title:"",description:"",budgetMin:"",budgetMax:"",location:"",customerEmail:"",commissionPct:""});
  const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  const onSubmit=async(e)=>{e.preventDefault(); setErr(""); setMsg("");
    try{const {data}=await api.post("/jobs",form); setMsg(`Job posted: ID ${data.job.id}`);
      setForm({title:"",description:"",budgetMin:"",budgetMax:"",location:"",customerEmail:"",commissionPct:""});
    }catch(e){setErr(e?.response?.data?.error||"Failed to post job");}};
  return(<div style={{maxWidth:640,margin:"20px auto"}}><h2>Post a Job</h2>
    <form onSubmit={onSubmit}>
      <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <textarea placeholder="Description" rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      {JSON.parse(localStorage.getItem("user")||"{}").role==="agent" && (
        <div className="card" style={{background:"#fcfcfc"}}>
          <h4>Create on behalf of Customer</h4>
          <input placeholder="Customer Email (existing)" value={form.customerEmail} onChange={e=>setForm({...form,customerEmail:e.target.value})}/>
          <input placeholder="Commission % (e.g., 7.5)" value={form.commissionPct} onChange={e=>setForm({...form,commissionPct:e.target.value})}/>
        </div>)}
      <div className="flex">
        <input placeholder="Budget Min (THB)" value={form.budgetMin} onChange={e=>setForm({...form,budgetMin:e.target.value})}/>
        <input placeholder="Budget Max (THB)" value={form.budgetMax} onChange={e=>setForm({...form,budgetMax:e.target.value})}/>
      </div>
      <input placeholder="Location (e.g., Bangkok)" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      {err&&<p style={{color:"red"}}>{err}</p>}{msg&&<p style={{color:"green"}}>{msg}</p>}<button type="submit">Post</button>
    </form></div>);
}
