import React, { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {}
})


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
	  // Lấy thông tin người dùng từ localStorage khi component được tạo
	  const token = localStorage.getItem("token");
	  if (token) {
		  const decodedUser = jwtDecode(token);
		  setUser(decodedUser);
	  }
  }, []);

  const handleLogin = (token) => {
    const decodedUser = jwtDecode(token) // Use jwtDecode
    localStorage.setItem("userId", decodedUser.sub)
    localStorage.setItem("userRole", decodedUser.roles)
    localStorage.setItem("token", token)
    setUser(decodedUser)
    window.location.reload()
    window.location.href = "/"
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userRole")
    localStorage.removeItem("token")
    setUser(null)
    window.location.reload()
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
