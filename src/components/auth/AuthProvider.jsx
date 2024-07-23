import React, { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      localStorage.setItem("userEmail", decodedUser.sub); // Đảm bảo email được lưu
    }
  }, []);

  const handleLogin = (token) => {
    const decodedUser = jwtDecode(token);
    localStorage.setItem("userId", decodedUser.sub);
    localStorage.setItem("userRole", decodedUser.roles);
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", decodedUser.sub); // Đảm bảo email được lưu
    setUser(decodedUser);
    window.location.reload(); // Cập nhật lại trạng thái
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};