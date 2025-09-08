import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ProfileSidebar from "../Sidebar/Sidebar"
import "./Header.css"

// This Header component expects year (number), month (string), setYear, setMonth, months as props from parent
const Header = ({
  activeNav,
  handleNavClick,
  year,
  month,
  setYear,
  setMonth,
  months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
}) => {
  const navigate = useNavigate()
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  // Defensive: ensure month is a string and in months array
  const safeMonth = typeof month === "string" && months.includes(month)
    ? month
    : months[0]

  // Toggle profile sidebar
  const toggleProfileSidebar = () => {
    setIsProfileSidebarOpen(!isProfileSidebarOpen)
  };

  // Close profile sidebar
  const closeProfileSidebar = () => {
    setIsProfileSidebarOpen(false)
  };

 

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div 
            className="profile-icon-trigger" 
            onClick={toggleProfileSidebar}
            role="button"
            aria-label="Open profile menu"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleProfileSidebar();
              }
            }}
          >
            <div className="profile-icon">👤</div>
            <div className="profile-indicator">
              <span className="status-dot online"></span>
            </div>
          </div>
          <div className="welcome-text">
            Welcome, <span id="userName">Juan Dela Cruz</span>!
          </div>
        </div>
        
        <img 
          src="WIB LOGO.png" 
          alt="When in Baguio Logo" 
          className="logo-img" 
        />
      </header>

      <nav className="navigation">
        <div className="nav-links">
          <button
            type="button"
            className={`nav-link${activeNav === "DASHBOARD" ? " active" : ""}`}
            onClick={() => handleNavClick("DASHBOARD")}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            DASHBOARD
          </button>
          <button
            type="button"
            className={`nav-link${activeNav === "CALENDAR" ? " active" : ""}`}
            onClick={() => handleNavClick("CALENDAR")}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            CALENDAR
          </button>
          <button
            type="button"
            className={`nav-link${activeNav === "REQUEST LEAVE" ? " active" : ""}`}
            onClick={() => handleNavClick("REQUEST LEAVE")}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            REQUEST LEAVE
          </button>
      
        </div>

        {typeof year === "number" && typeof safeMonth === "string" && setYear && setMonth && (
          <div className="date-controls">
            <input
              type="number"
              className="date-input"
              value={year}
              min={2020}
              max={2030}
              onChange={e => setYear(Number(e.target.value))}
            />
            <select
              className="date-input"
              value={safeMonth}
              onChange={e => setMonth(e.target.value)}
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </nav>

      {/* Profile Sidebar */}
      <ProfileSidebar 
        isOpen={isProfileSidebarOpen} 
        onClose={closeProfileSidebar} 
      />
    </>
  )
}

export default Header