import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header/Header"
import "./Calendar.css"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const Calendar = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // use index, not string
  const [activeNav, setActiveNav] = useState("CALENDAR")
  const navigate = useNavigate()

  // store approval state for each day in an object: { "2025-09-01": true/false }
  const [approvals, setApprovals] = useState({})

  const handleNavClick = (nav) => {
    setActiveNav(nav)
    if (nav === "DASHBOARD") {
      navigate("/dashboard")
    } else if (nav === "REQUEST LEAVE") {
      navigate("/request-leave")
    } else if (nav === "CALENDAR") {
      navigate("/calendar")
    }
  }

  // build days for current month (with prev/next fillers)
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const days = []

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isOtherMonth: true })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year
      days.push({ day, isOtherMonth: false, isToday })
    }

    const totalCells = days.length
    const remainingCells = 42 - totalCells
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day, isOtherMonth: true })
    }

    return days
  }

  const toggleApproval = (dayKey) => {
    setApprovals((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }))
  }

  const days = generateCalendarDays()

  return (
    <div className="calendar">
      <Header
        activeNav={activeNav}
        handleNavClick={handleNavClick}
        year={year}
        month={months[month]}
        setYear={setYear}
        setMonth={(val) =>
          typeof val === "number" ? setMonth(val) : setMonth(months.indexOf(val))
        }
        months={months}
      />

      <main className="content">
        <div className="calendar-container">
          <div className="calendar-header">
            <h2 className="calendar-title">
              {months[month]} {year}
            </h2>
          </div>

          <div className="calendar-grid">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="day-header">
                {d}
              </div>
            ))}

            {days.map((dayObj, idx) => {
  const dayKey = `${year}-${month + 1}-${dayObj.day}`
  const isApproved = approvals[dayKey] || false // optional, can default to false

  return (
    <div
      key={idx}
      className={`day-cell ${dayObj.isOtherMonth ? "other-month" : ""} ${
        dayObj.isToday ? "today" : ""
      }`}
    >
      <div className="day-number">{dayObj.day}</div>

      {!dayObj.isOtherMonth && (
        <>
          <div className="time-section">
            <div className="time-input-group">
              <span className="time-label">IN</span>
              <input type="time" className="time-input" />
            </div>
            <div className="time-input-group">
              <span className="time-label">OUT</span>
              <input type="time" className="time-input" />
            </div>
          </div>
          <div className="approval-section">
            <div
              className={`approval-status ${isApproved ? "approved" : "pending"}`}
            >
              {isApproved ? "APPROVED" : "PENDING"}
            </div>
          </div>
                  </>
              )}
              </div>
             )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Calendar
