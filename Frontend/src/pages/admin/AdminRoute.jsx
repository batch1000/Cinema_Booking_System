// components/AdminRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";

function AdminRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = JSON.parse(localStorage.getItem("user"));

        // Chưa đăng nhập
        if (!user) {
          return <Redirect to="/login" />;
        }

        // Không phải Admin
        if (user.role !== "Admin") {
          return <Redirect to="/" />;
        }

        // Là Admin
        return <Component {...props} />;
      }}
    />
  );
}

export default AdminRoute;