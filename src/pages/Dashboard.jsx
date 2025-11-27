// src/components/DashboardComponent.jsx
import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { performLogout, selectUser } from "../features/authSlice";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  TimeScale
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    dispatch(performLogout());
  };

  // Example data — replace with real API data when ready
  const chartData = useMemo(() => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = [12, 19, 8, 14, 24, 20, 26];

    return {
      labels,
      datasets: [
        {
          label: "Activity",
          data: values,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          backgroundColor: "rgba(108,92,231,0.12)",
          borderColor: "rgba(108,92,231,1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(108,92,231,1)",
        },
      ],
    };
  }, []);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "var(--muted)" },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "var(--muted)", beginAtZero: true },
        },
      },
    }),
    []
  );

  // stats & recent remain same data as before
  const stats = [
    { title: "Projects", value: 8 },
    { title: "Tasks", value: 124 },
    { title: "Completed", value: 87 },
    { title: "Team", value: 5 },
  ];

  const recent = [
    { id: 1, text: "Finished UI for Task Manager", time: "2h ago" },
    { id: 2, text: "Merged PR #42 — auth fixes", time: "1d ago" },
    { id: 3, text: "Deployed staging build", time: "2d ago" },
  ];

  return (
    <div className="dash-root">
      <aside className="dash-sidebar">
        <div className="brand">MyDashboard</div>
        <nav className="nav">
          <a href="#" className="nav-item active">Overview</a>
          <a href="#" className="nav-item">Projects</a>
          <a href="#" className="nav-item">Tasks</a>
          <a href="#" className="nav-item">Analytics</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini">
            <div className="avatar">{user?.email ? user.email[0].toUpperCase() : "U"}</div>
            <div className="user-info">
              <div className="u-name">{user?.email || "Guest"}</div>
              <div className="u-role">Frontend Dev</div>
            </div>
          </div>

          <div>
            {/* <button
              className="theme-btn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button> */}

            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <h1>Overview</h1>
          <div className="header-actions">
            <div className="search">
              <input placeholder="Search..." />
            </div>
            <button className="btn">New Project</button>
          </div>
        </header>

        <section className="stats">
          {stats.map((s) => (
            <div key={s.title} className="stat-card fade-in">
              <div className="stat-title">{s.title}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="card large fade-in">
            <h3>Activity</h3>
            <div className="chart-placeholder">
              <div style={{ height: 120 }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            <p className="muted">Activity over the last 7 days</p>
          </div>

          <div className="card fade-in">
            <h3>Recent</h3>
            <ul className="recent-list">
              {recent.map((r) => (
                <li key={r.id}>
                  <div className="rl-text">{r.text}</div>
                  <div className="rl-time">{r.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card fade-in">
            <h3>Quick Links</h3>
            <div className="links">
              <a href="#">Create task</a>
              <a href="#">Invite teammate</a>
              <a href="#">Project settings</a>
            </div>
          </div>

          <div className="card small fade-in">
            <h3>Profile</h3>
            <div className="profile">
              <div className="avatar large">{user?.email ? user.email[0].toUpperCase() : "U"}</div>
              <div>
                <div className="u-name">{user?.email || "Guest User"}</div>
                <div className="muted" onClick={()=>console.log(user,'user')}> Member since: {new Date(user?.joined).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
