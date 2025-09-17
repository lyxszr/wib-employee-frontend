// context/AuthContext.jsx
import { createContext, useState, useContext } from "react"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(false)

    const login = (userData) => {
        setAuth(userData)
    }

    const logout = () => {
        setAuth({})
    }

    const value = {
        auth,
        setAuth,
        loading,
        setLoading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Add useAuth hook for easier consumption
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext