import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const Dashboard = () => {
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState("September")
  const [activeMonthBtn, setActiveMonthBtn] = useState("Current Month")
  const [activeNav, setActiveNav] = useState("CALENDAR")
  const navigate = useNavigate()

  const handleMonthBtnClick = (btn) => setActiveMonthBtn(btn)
  const handleNavClick = (nav) => setActiveNav(nav)

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <div className="profile-icon" role="img" aria-label="profile">👤</div>
          <div className="welcome-text">
            Welcome, <span id="userName">Juan Dela Cruz</span>!
          </div>
        </div>
        <div className="logo">When in Baguio</div>
      </header>

      <nav className="navigation">
        <div className="nav-links">
          <button
            type="button"
            className={`nav-link${activeNav === "DASHBOARD" ? " active" : ""}`}
            onClick={() => { handleNavClick("DASHBOARD"); }}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            DASHBOARD
          </button>
          <button
            type="button"
            className={`nav-link${activeNav === "CALENDAR" ? " active" : ""}`}
            onClick={() => { handleNavClick("CALENDAR"); }}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            CALENDAR
          </button>
          <button
            type="button"
            className={`nav-link${activeNav === "REQUEST LEAVE" ? " active" : ""}`}
            onClick={() => { handleNavClick("REQUEST LEAVE"); }}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            REQUEST LEAVE
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            LOGOUT
          </button>
        </div>
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
            value={month}
            onChange={e => setMonth(e.target.value)}
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </nav>

      <main className="content">
        <div className="month-controls">
          <button
            className={`month-btn${activeMonthBtn === "Previous Month" ? " active" : ""}`}
            onClick={() => handleMonthBtnClick("Previous Month")}
          >
            Previous Month
          </button>
          <button
            className={`month-btn${activeMonthBtn === "Current Month" ? " active" : ""}`}
            onClick={() => handleMonthBtnClick("Current Month")}
          >
            Current Month
          </button>
          <button
            className={`month-btn${activeMonthBtn === "Next Month" ? " active" : ""}`}
            onClick={() => handleMonthBtnClick("Next Month")}
          >
            Next Month
          </button>
        </div>

        <div className="page-title">{month.toUpperCase()} {year}</div>

        {/* Summary Section */}
        <section className="summary-section">
          <div className="summary-tab">
            Summary
            <div className="export-buttons">
              <button
                className="export-btn"
                onClick={() => alert("Export functionality would be implemented here")}
              >
                Export All
              </button>
              <button
                className="export-btn"
                onClick={() => alert("Export functionality would be implemented here")}
              >
                Export Summary
              </button>
            </div>
          </div>
          <h2 style={{ textAlign: "center", padding: 20, margin: 0 }}>Attendance Records</h2>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Entry Name</th>
                <th>For Approval</th>
                <th>Approved</th>
                <th>Disapproved</th>
                <th>Cancelled</th>
                <th>Total Count</th>
                <th>Entry Description</th>
                <th>Monthly Count</th>
                <th>Yearly Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Time Adjusted</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>LWOP</td><td>0</td><td>0</td>
              </tr>
              <tr style={{ background: "#f8f9fa" }}>
                <td>Single Day Leave</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Exclusion</td><td>0</td><td>0</td>
              </tr>
              <tr>
                <td>Multiple Day Leave</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>AWOL</td><td>0</td><td>0</td>
              </tr>
              <tr style={{ background: "#f8f9fa" }}>
                <td>Overtime</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>No Entry</td><td>0</td><td>0</td>
              </tr>
              <tr>
                <td>Shift Schedule</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Tardy</td><td>0</td><td>0</td>
              </tr>
              <tr style={{ background: "#f8f9fa" }}>
                <td>Official</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>Undertime</td><td>0</td><td>0</td>
              </tr>
              <tr>
                <td>Late Filing Statement</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td><td></td><td></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Leave Credits */}
        <section className="leave-credits">
          <div className="leave-section">
            <div className="leave-header">Leave Credits Summary (Last Year)</div>
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Beginning Balance</th>
                  <th>Availments</th>
                  <th>Remaining</th>
                  <th>Active</th>
                  <th>Reserved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SL (Sick Leave)</td><td>0</td><td>0</td><td>0</td><td>0</td><td>SL</td>
                </tr>
                <tr style={{ background: "#f8f9fa" }}>
                  <td>VL (Vacation Leave)</td><td>0</td><td>0</td><td>0</td><td>0</td><td>ML_104_BIRTH</td>
                </tr>
              </tbody>
            </table>
            <div style={{ padding: 15 }}>
              <button
                className="show-details-btn"
                onClick={() => alert("Show details functionality would be implemented here")}
              >
                Show Details
              </button>
            </div>
          </div>

          <div className="leave-section">
            <div className="leave-header">Leave Credits Summary (Current)</div>
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Beginning Balance</th>
                  <th>Availments</th>
                  <th>Remaining</th>
                  <th>Active</th>
                  <th>Reserved</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SL (Sick Leave)</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
                <tr style={{ background: "#f8f9fa" }}>
                  <td>VL (Vacation Leave)</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                </tr>
              </tbody>
            </table>
            <div style={{ padding: 15 }}>
              <button
                className="show-details-btn"
                onClick={() => alert("Show details functionality would be implemented here")}
              >
                Show Details
              </button>
            </div>
          </div>
        </section>

        {/* Overtime */}
        <section className="overtime-sections">
          <div className="overtime-section">
            <h3>Paid Overtime</h3>
            <p className="no-records">No record/s found</p>
          </div>
          <div className="overtime-section">
            <h3>Invalid Overtime</h3>
            <p className="no-records">No record/s found</p>
          </div>
        </section>

        {/* Holiday */}
        <section className="holiday-section">
          <div className="holiday-header">Holiday</div>
          <table className="holiday-table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Leave Type</th>
                <th>Working Hours</th>
                <th>Reason</th>
                <th>Filed Date</th>
                <th>Remarks by HR</th>
                <th>Remarks Filed Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09/01/2025</td><td>09/28/2025</td><td>HL</td><td>8</td><td>National Heroes Day</td><td></td><td></td><td></td>
              </tr>
              <tr style={{ background: "#f8f9fa" }}>
                <td>09/01/2025</td><td>09/01/2025</td><td>HL</td><td>8</td><td>National Heroes Day</td><td></td><td></td><td></td>
              </tr>
            </tbody>
          </table>
          <div className="pagination">
            <span style={{ marginRight: 20 }}>Showing 1 to 2 of 2 entries</span>
            <button className="page-btn">First</button>
            <button className="page-btn">Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">Next</button>
            <button className="page-btn">Last</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard