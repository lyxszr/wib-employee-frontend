import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSubmitLeaveRequest } from "../../hooks/employees/useEmployeesServices"
import Header from "../../components/Header/Header"
import "./RequestLeave.css"
import useUserProfile from "../../hooks/user/useUserProfile"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const RequestLeave = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(months[new Date().getMonth()])
  const [activeNav, setActiveNav] = useState("REQUEST LEAVE")
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  })
  const { userProfile } = useUserProfile()

  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const submitLeaveRequestMutation = useSubmitLeaveRequest()

  const handleSubmitLeaveRequest = async (e) => {
    e.preventDefault()
    
    // Extract values from formData
    const { reason, startDate, endDate } = formData
    
    console.log(
      userProfile?._id, 
      reason, 
      startDate, 
      endDate 
    )
    
    submitLeaveRequestMutation.mutate({ 
      userId: userProfile?._id, 
      reason, 
      startDate, 
      endDate 
    })
  }

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    if (nav === "DASHBOARD") navigate("/dashboard")
    else if (nav === "CALENDAR") navigate("/calendar")
    else if (nav === "REQUEST LEAVE") navigate("/request-leave")
    else if (nav === "LOGOUT") navigate("/")
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
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

          <form onSubmit={handleSubmitLeaveRequest}>
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
              {errors.reason && <span className="error-message">{errors.reason}</span>}
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
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
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
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </div>
            </div>

            {/* Error Display for Mutation */}
            {submitLeaveRequestMutation.error && (
              <div className="mutation-error" style={{ color: "red", marginBottom: "16px" }}>
                Error: {submitLeaveRequestMutation.error.message}
              </div>
            )}

            {/* Success Message */}
            {submitLeaveRequestMutation.isSuccess && (
              <div className="mutation-success" style={{ color: "green", marginBottom: "16px" }}>
                Leave request submitted successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={submitLeaveRequestMutation.isPending}
              style={{
                background: submitLeaveRequestMutation.isSuccess
                  ? "linear-gradient(135deg, #38a169, #2f855a)"
                  : "",
              }}
            >
              {submitLeaveRequestMutation.isPending
                ? "Submitting..."
                : submitLeaveRequestMutation.isSuccess
                ? "Submitted ✓"
                : "Submit Request"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default RequestLeave