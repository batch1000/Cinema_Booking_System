import { useHistory } from "react-router-dom";
import "../css/sidebarDashboard.css";
import defaultAvt from "../image/default_avatar.jpg";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";

function SidebarDashboard() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login");
  };

  return (
    <>
      <div className="dashboard-sidebar">
        {/* Logo Header */}
        <div className="dashboard-sidebar__logo">
          <img
            src={defaultAvt}
            alt=""
            className="dashboard-sidebar__logo-icon"
          />
          <span className="dashboard-sidebar__logo-text">Nguyễn Văn An</span>
        </div>

        {/* MENU Section */}
        <div className="dashboard-sidebar__section">
          <div className="dashboard-sidebar__section-label">MENU</div>

          <NavLink
            to="/dashboard/managementMovie"
            className="dashboard-sidebar__item"
            activeClassName="dashboard-sidebar__item--active"
          >
            <span className="dashboard-sidebar__item-icon">
              <i className="fa-solid fa-film"></i>
            </span>
            <span className="dashboard-sidebar__item-text">Quản lý phim</span>
          </NavLink>

          <NavLink
            to="/dashboard/managementBooking/showTimeTab"
            className="dashboard-sidebar__item"
            activeClassName="dashboard-sidebar__item--active"
          >
            <span className="dashboard-sidebar__item-icon">
              <i className="fa-solid fa-ticket"></i>
            </span>
            <span className="dashboard-sidebar__item-text">Quản lý vé</span>
          </NavLink>

          <NavLink
            to="/dashboard/managementCinema/managementCinemaTab"
            className="dashboard-sidebar__item"
            activeClassName="dashboard-sidebar__item--active"
          >
            <span className="dashboard-sidebar__item-icon">
              <i className="fas fa-building"></i>
            </span>
            <span className="dashboard-sidebar__item-text">Quản lý rạp</span>
          </NavLink>

          <div className="dashboard-sidebar__item" onClick={handleLogout}>
            <span className="dashboard-sidebar__item-icon">
              <i className="fa-solid fa-right-from-bracket"></i>
            </span>
            <span className="dashboard-sidebar__item-text">Đăng xuất</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SidebarDashboard;
