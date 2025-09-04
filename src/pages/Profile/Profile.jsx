import React, { useState } from 'react'
import './profile.css'

const ProfileSettings = () => {
    // State management
    const [editingStates, setEditingStates] = useState({
        profile: false,
        password: false
    })

    const [profileData, setProfileData] = useState({
        fullName: 'John Doe',
        username: 'johndoe123',
        email: 'john.doe@email.com'
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const [profileImage, setProfileImage] = useState(null);

    // Helper function to get initials
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Toggle edit mode for sections
    const toggleEdit = (section) => {
        setEditingStates(prev => ({
            ...prev,
            [section]: !prev[section]
        }));

        // Clear password fields when canceling password edit
        if (section === 'password' && editingStates.password) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    // Handle profile input changes
    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle password input changes
    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Save profile changes
    const saveProfile = async () => {
        try {
            // Here you would typically make an API call to update the profile
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                toggleEdit('profile');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Network error. Please try again.')
        }
    }

    // Save password changes
    const savePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }

        try {
            // Here you would typically make an API call to change the password
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                alert('Password updated successfully!');
                toggleEdit('password');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Network error. Please try again.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    }

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
                // Here you would typically upload the image to your server
            };
            reader.readAsDataURL(file);
        }
    }

    // Eye icon SVG
    const EyeIcon = ({ isVisible }) => (
        <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
            )}
        </svg>
    )

    return (
        <div className="containers">
            {/* Header */}
            <div className="mainheaders">
                <h1>Profile Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="grid">
                {/* Profile Picture Section */}
                <div className="profile-card card">
                    <div className="profile-image-container">
                        <div className="profile-image">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <span id="profileInitials">{getInitials(profileData.fullName)}</span>
                            )}
                        </div>
                        <label className="camera-button" htmlFor="imageUpload">
                            <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input 
                                type="file" 
                                id="imageUpload" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <div className="profile-info">
                        <h3>{profileData.fullName}</h3>
                        <p>@{profileData.username}</p>
                    </div>
                </div>

                {/* Main Settings */}
                <div className="settings-main">
                    {/* Profile Information */}
                    <div className="card">
                        <div className="section-headers">
                            <h2>Profile Information</h2>
                            <button className="edit-button" onClick={() => toggleEdit('profile')}>
                                <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>{editingStates.profile ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input 
                                type="text" 
                                id="fullName" 
                                className="form-input" 
                                value={profileData.fullName}
                                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                                disabled={!editingStates.profile}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                className="form-input" 
                                value={profileData.username}
                                onChange={(e) => handleProfileChange('username', e.target.value)}
                                disabled={!editingStates.profile}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="form-input" 
                                value={profileData.email}
                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                disabled={!editingStates.profile}
                            />
                        </div>

                        {editingStates.profile && (
                            <div>
                                <button className="save-button" onClick={saveProfile}>
                                    <svg className="save-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Change Password */}
                    <div className="card">
                        <div className="section-headers">
                            <h2>Change Password</h2>
                            <button className="edit-button" onClick={() => toggleEdit('password')}>
                                <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>{editingStates.password ? 'Cancel' : 'Change'}</span>
                            </button>
                        </div>

                        {!editingStates.password ? (
                            <div className="password-info">
                                <p>Password was last changed 2 months ago</p>
                                <p className="small">Click "Change" to update your password</p>
                            </div>
                        ) : (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={passwordVisibility.currentPassword ? "text" : "password"}
                                            id="currentPassword" 
                                            className="form-input" 
                                            placeholder="Enter current password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => togglePasswordVisibility('currentPassword')}
                                        >
                                            <EyeIcon isVisible={passwordVisibility.currentPassword} />
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={passwordVisibility.newPassword ? "text" : "password"}
                                            id="newPassword" 
                                            className="form-input" 
                                            placeholder="Enter new password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => togglePasswordVisibility('newPassword')}
                                        >
                                            <EyeIcon isVisible={passwordVisibility.newPassword} />
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={passwordVisibility.confirmPassword ? "text" : "password"}
                                            id="confirmPassword" 
                                            className="form-input" 
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                        >
                                            <EyeIcon isVisible={passwordVisibility.confirmPassword} />
                                        </button>
                                    </div>
                                </div>

                                <button className="save-button" onClick={savePassword}>
                                    <svg className="save-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Update Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings