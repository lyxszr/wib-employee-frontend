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

  // New function to calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!userAttendanceData?.success || !userAttendanceData.data) {
      return {
        totalDays: 0,
        presentDays: 0,
        lateCount: 0,
        totalHours: 0,
        overtimeHours: 0,
        averageHours: 0,
        attendanceRate: 0
      };
    }

    const attendanceData = userAttendanceData.data;
    const workingDays = [];
    const standardWorkHours = 8; // Assuming 8 hours is standard
    const standardStartTime = 9; // Assuming 9 AM is standard start time
    
    // Get all working days in the month (excluding weekends)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      // Exclude weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays.push(day);
      }
    }

    let presentDays = 0;
    let lateCount = 0;
    let totalHours = 0;
    let overtimeHours = 0;

    Object.keys(attendanceData).forEach(dateKey => {
      const attendance = attendanceData[dateKey];
      if (attendance && (attendance.timeIn || attendance.timeOut)) {
        presentDays++;
        
        if (attendance.totalHours) {
          totalHours += attendance.totalHours;
          
          // Calculate overtime (hours worked beyond standard)
          if (attendance.totalHours > standardWorkHours) {
            overtimeHours += (attendance.totalHours - standardWorkHours);
          }
        }

        // Check if late (arrived after standard start time)
        if (attendance.timeIn) {
          const checkInTime = new Date(attendance.timeIn);
          const checkInHour = checkInTime.getHours();
          const checkInMinute = checkInTime.getMinutes();
          const checkInDecimal = checkInHour + (checkInMinute / 60);
          
          if (checkInDecimal > standardStartTime) {
            lateCount++;
          }
        }
      }
    });

    const averageHours = presentDays > 0 ? totalHours / presentDays : 0;
    const attendanceRate = workingDays.length > 0 ? (presentDays / workingDays.length) * 100 : 0;

    return {
      totalDays: workingDays.length,
      presentDays,
      lateCount,
      totalHours,
      overtimeHours,
      averageHours,
      attendanceRate
    };
  };

  // New function to handle printing
  const handlePrint = () => {
    const stats = calculateAttendanceStats();
    const attendanceData = userAttendanceData?.data || {};
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Report - ${months[month]} ${year}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
            }
            
            .print-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
            }
            
            .print-header {
              text-align: center;
              border-bottom: 3px solid #445c2b;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .print-title {
              font-size: 28px;
              color: #445c2b;
              margin-bottom: 10px;
              font-weight: bold;
            }
            
            .print-subtitle {
              font-size: 18px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .print-period {
              font-size: 16px;
              color: #888;
            }
            
            .employee-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #445c2b;
            }
            
            .employee-info h3 {
              color: #445c2b;
              margin-bottom: 10px;
              font-size: 18px;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .stat-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e9ecef;
            }
            
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #445c2b;
              margin-bottom: 5px;
            }
            
            .stat-label {
              font-size: 14px;
              color: #666;
              text-transform: uppercase;
              font-weight: 600;
            }
            
            .stat-card.late .stat-value {
              color: #dc3545;
            }
            
            .stat-card.overtime .stat-value {
              color: #ffc107;
            }
            
            .detailed-records {
              margin-bottom: 30px;
            }
            
            .detailed-records h3 {
              color: #445c2b;
              margin-bottom: 20px;
              font-size: 20px;
              border-bottom: 2px solid #e9ecef;
              padding-bottom: 10px;
            }
            
            .records-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            
            .records-table th,
            .records-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e9ecef;
            }
            
            .records-table th {
              background: #445c2b;
              color: white;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 11px;
            }
            
            .records-table tr:nth-child(even) {
              background: #f8f9fa;
            }
            
            .status-completed { color: #28a745; font-weight: bold; }
            .status-working { color: #007bff; font-weight: bold; }
            .status-late { color: #dc3545; font-weight: bold; }
            
            .print-footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #e9ecef;
              padding-top: 20px;
            }
            
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .print-container {
                margin: 0;
                padding: 15mm;
                max-width: none;
              }
              .stat-card {
                break-inside: avoid;
              }
              .records-table {
                font-size: 10px;
              }
              .records-table th,
              .records-table td {
                padding: 6px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <h1 class="print-title">Attendance Report</h1>
              <p class="print-subtitle">Monthly Summary</p>
              <p class="print-period">${months[month]} ${year}</p>
            </div>
            
            <div class="employee-info">
              <h3>Employee Information</h3>
              <p><strong>Name:</strong> ${userProfile?.name || 'N/A'}</p>
              <p><strong>Email:</strong> ${userProfile?.email || 'N/A'}</p>
              <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${stats.totalDays}</div>
                <div class="stat-label">Working Days</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.presentDays}</div>
                <div class="stat-label">Present Days</div>
              </div>
              <div class="stat-card late">
                <div class="stat-value">${stats.lateCount}</div>
                <div class="stat-label">Late Arrivals</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.attendanceRate.toFixed(1)}%</div>
                <div class="stat-label">Attendance Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.totalHours.toFixed(1)}h</div>
                <div class="stat-label">Total Hours</div>
              </div>
              <div class="stat-card overtime">
                <div class="stat-value">${stats.overtimeHours.toFixed(1)}h</div>
                <div class="stat-label">Overtime Hours</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.averageHours.toFixed(1)}h</div>
                <div class="stat-label">Avg Daily Hours</div>
              </div>
            </div>
            
            <div class="detailed-records">
              <h3>Detailed Daily Records</h3>
              <table class="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Break Time</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${(() => {
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    let rows = '';
                    
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dayOfWeek = date.getDay();
                      
                      // Skip weekends
                      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
                      
                      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const attendance = attendanceData[dateKey];
                      const hasAttendance = attendance && (attendance.timeIn || attendance.timeOut);
                      
                      let statusClass = '';
                      let statusText = 'Absent';
                      
                      if (hasAttendance) {
                        statusText = getStatusDisplay(attendance.status);
                        if (attendance.timeIn) {
                          const checkInTime = new Date(attendance.timeIn);
                          const checkInHour = checkInTime.getHours() + (checkInTime.getMinutes() / 60);
                          if (checkInHour > 9) {
                            statusClass = 'status-late';
                            statusText += ' (Late)';
                          }
                        }
                        if (attendance.status === 'completed') statusClass = 'status-completed';
                        else if (attendance.status === 'working') statusClass = 'status-working';
                      }
                      
                      rows += `
                        <tr>
                          <td>${day} ${months[month].substring(0,3)} ${year}</td>
                          <td>${hasAttendance ? formatTime(attendance?.timeIn) : '--:--'}</td>
                          <td>${hasAttendance ? formatTime(attendance?.timeOut) : '--:--'}</td>
                          <td>${hasAttendance ? formatDuration(attendance?.breakTime) : '0h 0m'}</td>
                          <td>${hasAttendance ? formatDuration(attendance?.totalHours) : '0h 0m'}</td>
                          <td class="${statusClass}">${statusText}</td>
                        </tr>
                      `;
                    }
                    
                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
            
            <div class="print-footer">
              <p>This report was automatically generated from the Employee Attendance System</p>
              <p>For any discrepancies, please contact your HR department</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

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
                onClick={handlePrint}
                disabled={isLoading || !userAttendanceData?.success}
              >
                <span className="btn-icon">🖨️</span>
                Print
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