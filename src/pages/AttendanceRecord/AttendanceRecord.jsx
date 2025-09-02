import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AttendanceRecord.css";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AttendanceRecord = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState(""); // new state
  const [password, setPassword] = useState(""); // new state
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

 
  // Mutation for Time In
  const timeInMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch('http://localhost:5000/api/employee/v1/time-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Failed to time in');
      return res.json();
    },
    // Optionally, you can add onSuccess/onError handlers here
  });

  const handleTimeIn = () => {
    timeInMutation.mutate({ email, password });
  };

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
          Sign in
        </a>

        <div className="date-time">{date}</div>
        <div className="time-display">{time}</div>

        <div className="signup-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email acc."
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="button-group">
            <button
              className="btn-time-in"
              onClick={handleTimeIn}
              disabled={timeInMutation.isLoading}
            >
              {timeInMutation.isLoading ? "Timing In..." : "Time In"}
            </button>
            <button className="btn-time-out">Time Out</button>
          </div>
          {/* Show feedback */}
          {timeInMutation.isError && (
            <div style={{ color: "red" }}>Failed to time in: {timeInMutation.error.message}</div>
          )}
          {timeInMutation.isSuccess && (
            <div style={{ color: "green" }}>Time in successful!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;