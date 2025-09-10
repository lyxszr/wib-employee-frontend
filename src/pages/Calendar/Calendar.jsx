import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGetMonthlyAttendance } from "../../hooks/employees/useEmployeesServices"
import Header from "../../components/Header/Header"
import "./Calendar.css"
import useUserProfile from "../../hooks/user/useUserProfile"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Attendance Modal Component
const AttendanceModal = ({ isOpen, onClose, attendance, hasAttendance, isLoading, formatTime, formatDuration, getStatusDisplay, date }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="attendance-modal-overlay" onClick={onClose}>
      <div className="attendance-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="attendance-modal-header">
          <h3>Attendance Details - {date}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="attendance-modal-body">
          {hasAttendance ? (
            <>
              <div className="time-section-modal">
                <div className="time-row-modal">
                  <div className="time-group-modal">
                    <span className="time-label-modal">Check In</span>
                    <div className="time-value-modal">
                      {formatTime(attendance?.timeIn)}
                    </div>
                  </div>
                  <div className="time-group-modal">
                    <span className="time-label-modal">Check Out</span>
                    <div className="time-value-modal">
                      {formatTime(attendance?.timeOut)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hours-section-modal">
                <div className="hours-item-modal">
                  <span className="hours-label-modal">Break</span>
                  <span className="hours-value-modal break">
                    {formatDuration(attendance?.breakTime)}
                  </span>
                </div>
                <div className="hours-item-modal">
                  <span className="hours-label-modal">Total</span>
                  <span className="hours-value-modal total">
                    {formatDuration(attendance?.totalHours)}
                  </span>
                </div>
              </div>

              <div className="status-section-modal">
                <span
                  className={`status-badge-modal ${
                    attendance?.status === 'completed' ? "approved" : 
                    attendance?.status === 'working' ? "working" :
                    attendance?.status === 'on_break' ? "on-break" : "pending"
                  }`}
                >
                  {getStatusDisplay(attendance?.status)}
                </span>
              </div>
            </>
          ) : (
            <div className="no-data-modal">
              <span className="no-data-text-modal">
                {isLoading ? "Loading..." : "No attendance data for this date"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const navigate = useNavigate()
  const today = new Date()
  
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [activeNav, setActiveNav] = useState("CALENDAR")
  const [modalData, setModalData] = useState({ 
    isOpen: false, 
    attendance: null, 
    hasAttendance: false,
    date: ""
  })

  const { userProfile } = useUserProfile()

  const { 
    data: userAttendanceData, 
    isLoading, 
    error, 
    refetch 
  } = useGetMonthlyAttendance(year, month, userProfile?.email)

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

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleAttendanceClick = (attendance, hasAttendance, day, month, year) => {
    const dateString = `${day} ${months[month]} ${year}`;
    setModalData({
      isOpen: true,
      attendance,
      hasAttendance,
      date: dateString
    });
  };

  const closeModal = () => {
    setModalData({ 
      isOpen: false, 
      attendance: null, 
      hasAttendance: false,
      date: ""
    });
  };

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

  const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true
    })
  }

  const formatDuration = (hours) => {
    if (!hours || hours === 0) return '0h 0m'
    
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    
    if (wholeHours > 0 && minutes > 0) {
      return `${wholeHours}h ${minutes}m`
    } else if (wholeHours > 0) {
      return `${wholeHours}h`
    } else {
      return `${minutes}m`
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return 'APPROVED'
      case 'working':
        return 'WORKING'
      case 'on_break':
        return 'ON BREAK'
      default:
        return 'PENDING'
    }
  }

  const days = generateCalendarDays()

  return (
    <div className="dashboard">
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
        <h1 className="page-title">Employee Attendance Calendar</h1>
        
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="navigation-controls">
              <button 
                className="nav-arrow"
                onClick={handlePreviousMonth}
                disabled={isLoading}
                aria-label="Previous month"
              >
                ←
              </button>
              
              <h2 className="calendar-title">
                {months[month]} {year}
                {isLoading && (
                  <span className="loading-indicator"> (Loading...)</span>
                )}
              </h2>
              
              <button 
                className="nav-arrow"
                onClick={handleNextMonth}
                disabled={isLoading}
                aria-label="Next month"
              >
                →
              </button>
            </div>

            <div className="calendar-actions">
              <button 
                className="action-btn"
                disabled={isLoading}
              >
                <span className="btn-icon">📤</span>
                Export
              </button>
              <button 
                className="action-btn"
                disabled={isLoading}
              >
                <span className="btn-icon">🖨️</span>
                Print
              </button>
              <button 
                className="action-btn"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <span className="btn-icon">🔄</span>
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Error handling */}
          {error && (
            <div style={{ 
              color: "#721c24", 
              backgroundColor: "#f8d7da", 
              border: "1px solid #f5c6cb",
              padding: "12px 16px",
              borderRadius: "8px",
              margin: "0 24px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Error loading attendance: {error.message}</span>
              <button 
                onClick={() => refetch()}
                style={{ 
                  marginLeft: 8, 
                  color: "#721c24", 
                  background: "none", 
                  border: "1px solid #721c24",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div className="calendar-grid">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
              <div key={day} className="day-header">
                <span className="day-full">{day}</span>
                <span className="day-short">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][index]}
                </span>
              </div>
            ))}

            {days.map((dayObj, idx) => {
              const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`
              const attendance = userAttendanceData?.success ? userAttendanceData.data?.[dayKey] : null
              const hasAttendance = attendance && (attendance.timeIn || attendance.timeOut)

              return (
                <div
                  key={idx}
                  className={`day-cell ${dayObj.isOtherMonth ? "other-month" : ""} ${
                    dayObj.isToday ? "today" : ""
                  } ${hasAttendance ? "has-data" : ""} ${
                    isLoading ? "loading" : ""
                  }`}
                  onClick={() => !dayObj.isOtherMonth && handleAttendanceClick(
                    attendance, 
                    hasAttendance, 
                    dayObj.day, 
                    month, 
                    year
                  )}
                >
                  <div className="day-number">{dayObj.day}</div>

                  {!dayObj.isOtherMonth && (
                    <div className="attendance-content">
                      {hasAttendance ? (
                        <>
                          <div className="time-section">
                            <div className="time-row">
                              <div className="time-group">
                                <span className="time-label">Check In</span>
                                <div className="time-value">
                                  {formatTime(attendance?.timeIn)}
                                </div>
                              </div>
                              <div className="time-group">
                                <span className="time-label">Check Out</span>
                                <div className="time-value">
                                  {formatTime(attendance?.timeOut)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="hours-section">
                            <div className="hours-item">
                              <span className="hours-label">Break</span>
                              <span className="hours-value break">
                                {formatDuration(attendance?.breakTime)}
                              </span>
                            </div>
                            <div className="hours-item">
                              <span className="hours-label">Total</span>
                              <span className="hours-value total">
                                {formatDuration(attendance?.totalHours)}
                              </span>
                            </div>
                          </div>

                          <div className="status-section">
                            <span
                              className={`status-badge ${
                                attendance?.status === 'completed' ? "approved" : 
                                attendance?.status === 'working' ? "working" :
                                attendance?.status === 'on_break' ? "on-break" : "pending"
                              }`}
                            >
                              {getStatusDisplay(attendance?.status)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="no-data">
                          <span className="no-data-text">
                            {isLoading ? "Loading..." : "No attendance"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <AttendanceModal 
        isOpen={modalData.isOpen}
        onClose={closeModal}
        attendance={modalData.attendance}
        hasAttendance={modalData.hasAttendance}
        isLoading={isLoading}
        formatTime={formatTime}
        formatDuration={formatDuration}
        getStatusDisplay={getStatusDisplay}
        date={modalData.date}
      />

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading attendance data...</div>
        </div>
      )}
    </div>
  )
}

export default Calendar