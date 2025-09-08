import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './Sidebar.css'

const ProfileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle navigation with sidebar close
  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/authentication')
    onClose()
  };

  // Mock user data - replace with real user data from context/state
  const userData = {
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    position: 'Senior Developer',
    department: 'IT Department',
    joinDate: 'January 2022',
    avatar: null // Set to image URL if available
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* Backdrop/Overlay */}
      {isOpen && (
        <div 
          className="profile-sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`profile-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header with close button */}
        <div className="profile-sidebar-headers">
        
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close profile sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="user-profile-section">
          <div className="user-avatar-large">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {getInitials(userData.name)}
              </div>
            )}
            <div className="avatar-status online"></div>
          </div>

          <div className="user-info-detailed">
            <h3 className="user-name">{userData.name}</h3>
            <p className="user-email">{userData.email}</p>
            <p className="user-position">{userData.position}</p>
            <p className="user-department">{userData.department}</p>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Member since</span>
              <span className="stat-value">{userData.joinDate}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value online-status">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h4 className="section-title">Quick Actions</h4>
          
          <button 
            className="action-button primary"
            onClick={() => handleNavigation('/profile')}
          >
            <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Edit Profile Settings
          </button>


          <button 
            className="action-button"
            onClick={() => handleNavigation('/notifications')}
          >
            <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19l5-5 5 5H4z" />
            </svg>
            Notifications
            <span className="notification-badge">3</span>
          </button>

          <button 
            className="action-button"
            onClick={() => handleNavigation('/help')}
          >
            <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help & Support
          </button>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h4 className="section-title">Recent Activity</h4>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <p className="activity-title">Dashboard viewed</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📅</div>
              <div className="activity-content">
                <p className="activity-title">Leave request submitted</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">⚙️</div>
              <div className="activity-content">
                <p className="activity-title">Profile updated</p>
                <p className="activity-time">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with logout */}
        <div className="profile-sidebar-footer">
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            <svg className="logout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar