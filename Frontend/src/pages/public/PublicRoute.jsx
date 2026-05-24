import React from "react";
import { Route, Redirect } from "react-router-dom";

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
          // Đã đăng nhập rồi → đá ra
          return user.role === "Admin"
            ? <Redirect to="/dashboard/managementMovie" />
            : <Redirect to="/" />;
        }

        // Chưa đăng nhập → cho vào bình thường
        return <Component {...props} />;
      }}
    />
  );
}

export default PublicRoute;