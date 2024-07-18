import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from "../auth/AuthProvider";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  // Kiểm tra xem người dùng có phải là ADMIN không
  const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <Route
      {...rest}
      render={props =>
        isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" /> // Redirect về trang chính nếu người dùng không phải là ADMIN
        )
      }
    />
  );
};

export default AdminRoute;
