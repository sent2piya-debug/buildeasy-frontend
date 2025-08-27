import React,{useState} from "react";
import api from "../api";
export default function Register(){
  const [form,setForm]=useState({name:"",email:"",password:"",role:"customer"}); const [error,setError]=useState("");
  const onSubmit=async(e)=>{e.preventDefault(); setError("");
    try{const {data}=await api.post("/auth/register",form);
      localStorage.setItem("token",data.token); localStorage.setItem("user",JSON.stringify(data.user)); window.location.href="/jobs";
    }catch(err){setError(err?.response?.data?.error||"Registration failed");}
  };
  return(<div style={{maxWidth:480,margin:"40px auto"}}><h2>Create Account</h2>
    <form onSubmit={onSubmit}>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="customer">Customer</option><option value="contractor">Contractor</option><option value="agent">Agent</option>
      </select>{error&&<p style={{color:"red"}}>{error}</p>}<button type="submit">Register</button>
    </form></div>);
}
