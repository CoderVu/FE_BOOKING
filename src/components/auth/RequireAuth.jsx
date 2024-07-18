import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("userId");
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push({
        pathname: "/login",
        state: { path: location.pathname }
      });
    }
  }, [user, history, location.pathname]);

  return user ? children : null;
};

export default RequireAuth;
