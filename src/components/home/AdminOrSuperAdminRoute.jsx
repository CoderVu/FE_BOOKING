import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from "../auth/AuthProvider";

const AdminOrSuperAdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  const isAuthorized = user && (user.roles.includes("ROLE_OWNER") || user.roles.includes("ROLE_ADMIN"));

  return (
    <Route
      {...rest}
      render={props =>
        isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" /> // Redirects to the home page if the user is not ADMIN or ROLE_ADMIN
        )
      }
    />
  );
};
export default AdminOrSuperAdminRoute;