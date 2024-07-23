import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from "../auth/AuthProvider";

const AdminOrSuperAdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  // Để cả 2 role ADMIN và ROLE_SUPERUSER đều được truy cập
  const isAuthorized = user && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPPERUSER"));

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" /> // Redirects to the home page if the user is not ADMIN or ROLE_SUPERUSER
        )
      }
    />
  );
};
export default AdminOrSuperAdminRoute;