import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return <h2>Home OK</h2>;
}
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Find Trusted Contractors for Your Next Project</h1>
          <p>Get AI-powered estimates, connect with verified pros, and track your project from start to finish.</p>
          <div className="hero-actions">
            <input className="input" placeholder="What service do you need?" />
            <input className="input" placeholder="Enter your location" />
            <Link className="btn primary" to="/jobs">Find Contractors</Link>
          </div>
          <ul className="stats">
            <li><strong>6+</strong><span>Verified Contractors</span></li>
            <li><strong>1,054+</strong><span>Projects Completed</span></li>
            <li><strong>4.9/5</strong><span>Avg Rating</span></li>
          </ul>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section">
        <div className="container">
          <h2>Popular Services</h2>
          <p className="muted">Get expert help for any home improvement project</p>
          <div className="cards">
            {[
              "Kitchen Remodel", "Bathroom Remodel", "Plumbing Services",
              "HVAC & Air Conditioning", "Landscaping", "Roofing",
              "Painting", "Flooring", "Electrical", "General Handyman"
            ].map((label) => (
              <div className="card" key={label}>
                <div className="card-icon" />
                <div className="card-title">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estimate widget + sample projects */}
      <section className="section alt">
        <div className="container grid-2">
          <div className="panel">
            <h3>Get Instant Project Estimates</h3>
            <p className="muted">Upload photos and describe your needs to receive material & labor estimates in minutes.</p>
            <ul className="ticks">
              <li>Photo analysis</li>
              <li>Local market data</li>
              <li>Design suggestions</li>
            </ul>
            <Link className="btn" to="/post-job">Try AI Estimation</Link>
          </div>
          <div className="panel">
            <h3>Kitchen Remodel Estimate</h3>
            <div className="estimate-box">
              <div className="row"><span>Labor</span><b>$15,000</b></div>
              <div className="row"><span>Materials</span><b>$22,000</b></div>
              <div className="row"><span>Permits</span><b>$1,200</b></div>
              <div className="row total"><span>Total Estimate</span><b>$38,200</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* Top-Rated Contractors */}
      <section className="section">
        <div className="container">
          <h2>Top-Rated Contractors</h2>
          <p className="muted">Connect with verified professionals in your area</p>
          <div className="cards contractors">
            {[
              { name: "Alex Thompson", trade: "HVAC & Air Conditioning" },
              { name: "Maria Rodriguez", trade: "Landscaping" },
              { name: "James Wilson", trade: "Custom Home Building" }
            ].map((c) => (
              <div className="card contractor" key={c.name}>
                <div className="avatar" />
                <div className="card-title">{c.name}</div>
                <div className="card-sub">{c.trade}</div>
                <Link className="btn ghost" to="/jobs">View Profile</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section alt">
        <div className="container">
          <h2>How BuildConnect Works</h2>
          <div className="steps">
            {[
              ["Submit Your Project", "Upload photos and describe what you need."],
              ["Get Matched", "We connect you with verified contractors."],
              ["Compare & Book", "Review quotes and choose the best pro."],
              ["Track Progress", "Monitor updates, photos, and milestones."]
            ].map(([title, blurb], i) => (
              <div className="step" key={i}>
                <div className="step-icon">{i + 1}</div>
                <div className="step-title">{title}</div>
                <div className="step-sub">{blurb}</div>
              </div>

          </div>
          <div className="center">
            <Link className="btn primary" to="/post-job">Start Your Project</Link>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Ready to Start Your Next Project?</h2>
            <p className="muted">Join homeowners who finish on time and on budget.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn" to="/jobs">Get Started</Link>
            <Link className="btn ghost" to="/planner">Try Kitchen Planner</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
