import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import api from "../api";
export default function JobDetail(){
  const { id } = useParams();
  const [job,setJob]=useState(null); const [bids,setBids]=useState([]); const [error,setError]=useState("");
  const [bidForm,setBidForm]=useState({amount:"",durationDays:"",message:""});
  const user = JSON.parse(localStorage.getItem("user")||"null");
  async function fetchDetails(){ try{
      const {data}=await api.get(`/jobs/${id}`); setJob(data);
      const bidsRes=await api.get(`/jobs/${id}/bids`); setBids(bidsRes.data);
    }catch(e){ setError(e?.response?.data?.error||"Failed to load job"); } }
  useEffect(()=>{fetchDetails();},[id]);
  const submitBid=async(e)=>{e.preventDefault(); try{
      await api.post(`/jobs/${id}/bids`,bidForm); await fetchDetails(); setBidForm({amount:"",durationDays:"",message:""});
    }catch(e){ setError(e?.response?.data?.error||"Failed to submit bid"); } };
  const acceptBid=async(bidId)=>{ try{ await api.post(`/bids/${bidId}/accept`); await fetchDetails(); }
    catch(e){ setError(e?.response?.data?.error||"Failed to accept bid"); } };
  if(!user) return <p>Please login first.</p>;
  if(!job) return <p>Loading...</p>;
  return(<div><h2>{job.title}</h2><p>{job.description}</p>
    <div className="flex"><span className="badge">{job.status}</span><span className="badge">Budget: {job.budget_min}–{job.budget_max} THB</span>{job.location&&<span className="badge">{job.location}</span>}</div>
    {error&&<p style={{color:"red"}}>{error}</p>}
    <h3 style={{marginTop:20}}>Bids</h3>{bids.length===0&&<p>No bids yet.</p>}
    {bids.map(b=>(<div key={b.id} className="card"><div className="flex" style={{justifyContent:"space-between"}}>
      <div><strong>{b.contractor_name||"Contractor"}</strong>
        <div className="flex"><span className="badge">{b.status}</span><span className="badge">฿{b.amount}</span><span className="badge">{b.duration_days} days</span></div>
        <p>{b.message}</p></div>
      {(user.role==="customer"||user.role==="agent") && job.status==="open" && b.status==="pending" && (<button onClick={()=>acceptBid(b.id)}>Accept</button>)}
    </div></div>))}
    {user.role==="contractor" && job.status==="open" && (<div style={{marginTop:20}}><h3>Submit a Bid</h3>
      <form onSubmit={submitBid}><div className="flex">
        <input placeholder="Amount (THB)" value={bidForm.amount} onChange={e=>setBidForm({...bidForm,amount:e.target.value})}/>
        <input placeholder="Duration (days)" value={bidForm.durationDays} onChange={e=>setBidForm({...bidForm,durationDays:e.target.value})}/>
      </div>
        <textarea placeholder="Message" rows="3" value={bidForm.message} onChange={e=>setBidForm({...bidForm,message:e.target.value})}/>
        <button type="submit">Bid</button></form>
    </div>)}
  </div>);
}
