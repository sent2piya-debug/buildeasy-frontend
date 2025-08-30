import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="section hero">
        <div className="container">
          <h1>Find Trusted Contractors for Your Next Project</h1>
          <p>
            Get AI-powered estimates, connect with verified pros, and track your
            project from start to finish.
          </p>
          <div className="hero-actions">
            <input className="input" placeholder="What service do you need?" />
            <input className="input" placeholder="Enter your location" />
            <Link className="btn primary" to="/jobs">
              Find Contractors
            </Link>
          </div>
          <ul className="hero-stats">
            <li><strong>6+</strong> <span>Verified Contractors</span></li>
            <li><strong>1,054+</strong> <span>Projects Completed</span></li>
            <li><strong>4.9/5</strong> <span>Avg. Rating</span></li>
          </ul>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Popular Services</h2>
          <div className="cards">
            <div className="card">
              <div className="card-icon">🍳</div>
              <div className="card-title">Kitchen Remodel</div>
              <div className="card-sub">$25k – $80k</div>
            </div>
            <div className="card">
              <div className="card-icon">🚿</div>
              <div className="card-title">Bathroom Remodel</div>
              <div className="card-sub">$15k – $50k</div>
            </div>
            <div className="card">
              <div className="card-icon">🧰</div>
              <div className="card-title">General Handyman</div>
              <div className="card-sub">$100 – $2k</div>
            </div>
          </div>
        </div>
      </section>

       {/* Home Building Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Home Building Services</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Professional construction and building services for major projects
          </p>

          <div className="services-grid" style={{ marginTop: 18 }}>
            {[
              { icon: "🏠", title: "Custom Home Building", range: "$200k – $800k" },
              { icon: "➕", title: "Home Additions", range: "$50k – $200k" },
              { icon: "🚗", title: "Garage Construction", range: "$15k – $50k" },
              { icon: "🪵", title: "Deck & Patio", range: "$5k – $25k" },
              { icon: "🧱", title: "Foundation Work", range: "$10k – $50k" },
              { icon: "📐", title: "Structural Engineering", range: "$5k – $30k" }
            ].map((s) => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <div className="service-range">{s.range}</div>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: 18 }}>
            Our certified general contractors handle everything—from custom homes to large additions.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="section alt">
        <div className="container">
          <h2 className="section-title">How BuildEasy Works</h2>
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
            ))}
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
