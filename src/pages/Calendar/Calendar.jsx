import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header/Header"
import "./Calendar.css"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const Calendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [activeNav, setActiveNav] = useState("CALENDAR");
  const navigate = useNavigate();

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

  return (
    <div className="calendar">
      <Header
        activeNav={activeNav}
        handleNavClick={handleNavClick}
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
        months={months}
      />
      <main className="content">
        <h1>Calendar Here!!!!</h1>
      </main>
    </div>
  )
}

export default Calendar