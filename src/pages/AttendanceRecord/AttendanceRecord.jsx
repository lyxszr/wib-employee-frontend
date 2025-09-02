import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AttendanceRecord.css";

const AttendanceRecord = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setTime(timeString);
      setDate(`Today is ${dateString}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <img src="Wib.png" alt="When in Baguio Logo" className="main-logo" />
        <div className="blob-shape1"></div>
        <div className="blob-shape2"></div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <a onClick={() => navigate("/authentication")} className="signup-header">
          Please Sign in
        </a>

        <div className="date-time">{date}</div>
        <div className="time-display">{time}</div>

        <div className="signup-form">
          <div className="form-group">
            <input type="email" placeholder="Enter your email acc." />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="button-group">
            <button className="btn-time-in">Time In</button>
            <button className="btn-time-out">Time Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord
