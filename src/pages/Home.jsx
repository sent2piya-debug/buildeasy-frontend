// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">
            Find Trusted Contractors for Your Next Project
          </h1>
          <p className="hero-subtitle">
            Get AI-powered estimates, connect with verified pros, and track your project from start to finish.
          </p>

          <div className="hero-search">
            <input
              className="input"
              type="text"
              placeholder="🔨 What service do you need? (e.g. Kitchen Remodel)"
              aria-label="Service needed"
            />
            <input
              className="input"
              type="text"
              placeholder="📍 Enter your location"
              aria-label="Your location"
            />
            <Link className="btn primary btn-search" to="/jobs">
              Find Contractors
            </Link>
          </div>

          <ul className="hero-stats">
            <li><strong>6+</strong> Verified Contractors</li>
            <li><strong>1,054+</strong> Projects Completed</li>
            <li><strong>4.9/5</strong> Avg Rating</li>
          </ul>

          <div className="hero-quick">
            <Link className="btn ghost" to="/jobs">Browse Jobs</Link>
            <Link className="btn ghost" to="/planner">Try Kitchen Planner</Link>
          </div>
        </div>
      </section>

      {/* Popular Services (simple grid) */}
      <section className="section">
        <div className="container">
          <h2>Popular Services</h2>
          <div className="cards">
            {[
              { t: "Kitchen Remodel", p: "$25k – $80k" },
              { t: "Bathroom Remodel", p: "$15k – $50k" },
              { t: "Plumbing Services", p: "$200 – $5k" },
              { t: "Electrical", p: "$300 – $15k" },
              { t: "Flooring", p: "$3k – $20k" },
              { t: "General Handyman", p: "$100 – $2k" },
            ].map(({ t, p }) => (
              <div className="card" key={t}>
                <div className="card-title">{t}</div>
                <div className="card-sub">{p}</div>
                <Link className="btn small" to="/jobs">Find Pros</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section alt">
        <div className="container">
          <h2>How BuildEasy Works</h2>
          <div className="steps">
            {[
              ["Submit Your Project", "Upload photos and describe what you need."],
              ["Get Matched", "We connect you with verified contractors."],
              ["Compare & Book", "Review quotes and choose the best pro."],
              ["Track Progress", "Monitor updates, photos, and milestones."],
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
