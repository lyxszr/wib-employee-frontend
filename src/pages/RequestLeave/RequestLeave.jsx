import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"
import Header from "../../components/Header/Header"
import "./RequestLeave.css"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const RequestLeave = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [activeNav, setActiveNav] = useState("REQUEST LEAVE");
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  })

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // React Query mutation for submitting leave request
  const leaveRequestMutation = useMutation({
    mutationFn: async (newRequest) => {
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      })
      if (!response.ok) throw new Error("Failed to submit leave request");
      return response.json()
    },
    onSuccess: () => {
      alert("Leave request submitted successfully!");
      setFormData({
        reason: "",
        startDate: "",
        endDate: "",
      })
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    onError: (error) => {
      alert(error.message || "Something went wrong!")
    },
  })

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    if (nav === "DASHBOARD") navigate("/dashboard");
    else if (nav === "CALENDAR") navigate("/calendar");
    else if (nav === "REQUEST LEAVE") navigate("/request-leave");
    else if (nav === "LOGOUT") navigate("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    let newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill in all required fields.");
      return;
    }

    leaveRequestMutation.mutate(formData);
  }

  return (
    <div className="request-leave">
      {/* Top Header with Navigation */}
      <Header
        activeNav={activeNav}
        handleNavClick={handleNavClick}
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
        months={months}
      />

      {/* Main Form Content */}
      <main className="contents">
        <div className="form-container">
          <h1 className="form-title">Request Leave</h1>

          <form onSubmit={handleSubmit}>
            {/* Reason for Leave */}
            <div className="form-group full-width">
              <label className="form-label">Reason for Leave</label>
              <textarea
                name="reason"
                className={`form-textarea ${errors.reason ? "error" : ""}`}
                placeholder="Please provide a detailed reason for leave request..."
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            {/* Start Date and End Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className={`date-inputs ${errors.startDate ? "error" : ""}`}
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className={`date-inputs ${errors.endDate ? "error" : ""}`}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                /> 
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={leaveRequestMutation.isLoading}
              style={{
                background: leaveRequestMutation.isSuccess
                  ? "linear-gradient(135deg, #38a169, #2f855a)"
                  : "",
              }}
            >
              {leaveRequestMutation.isLoading
                ? "Submitting..."
                : leaveRequestMutation.isSuccess
                ? "Submitted ✓"
                : "Submit Request"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RequestLeave