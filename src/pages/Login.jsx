import React,{useState} from "react";
import api from "../api";
export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  const onSubmit=async(e)=>{e.preventDefault(); setError("");
    try{const {data}=await api.post("/auth/login",{email,password});
      localStorage.setItem("token",data.token); localStorage.setItem("user",JSON.stringify(data.user));
      window.location.href="/jobs";
    }catch(err){setError(err?.response?.data?.error||"Login failed");}
  };
  return(<div style={{maxWidth:480,margin:"40px auto"}}><h2>Login</h2>
    <form onSubmit={onSubmit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      {error&&<p style={{color:"red"}}>{error}</p>}<button type="submit">Login</button>
    </form>
    <p>Samples: agent@example.com / agent123 · contractor@example.com / contractor123 · customer@example.com / customer123</p>
  </div>);
}
