import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Admin.css";

function AdminSidebar() {
  const [collapsed, setCollapsed] =
  useState(
    localStorage.getItem(
      "adminSidebarCollapsed"
    ) === "true"
  );

  const location =
    useLocation();

  const logout = () => {
    localStorage.removeItem("token");
localStorage.removeItem("user");
localStorage.removeItem("selectedService");
    window.location.href =
  "/login";
setTimeout(() => {
  window.location.reload();
}, 100);
  };

  const isActive = (path) =>
  location.pathname === path ||
  location.pathname.startsWith(path + "/");

  return (
    <aside
      className={`admin-sidebar ${
        collapsed
          ? "collapsed"
          : ""
      }`}
    >
      {/* Top */}
      <div className="sidebar-top">
        <h2 className="brand-title">
          {collapsed
            ? "💄"
            : "💄 Admin Panel"}
        </h2>

        <button
          className="collapse-btn"
          onClick={() => {
  const next = !collapsed;
  setCollapsed(next);
  localStorage.setItem(
    "adminSidebarCollapsed",
    next
  );
}}
        >
          {collapsed
            ? "➡"
            : "⬅"}
        </button>
      </div>

      {/* Links */}
      <nav className="sidebar-links">
        <Link
          to="/dashboard"
          className={
            isActive(
              "/dashboard"
            )
              ? "active"
              : ""
          }
        >
          📊
          {!collapsed &&
            " Dashboard"}
        </Link>

        <Link
          to="/manage-bookings"
          className={
            isActive(
              "/manage-bookings"
            )
              ? "active"
              : ""
          }
        >
          📅
          {!collapsed &&
            " Bookings"}
        </Link>
        
        <Link to="/booking-calendar">
            📅 Calendar
            </Link>
        <Link to="/availability-settings">
        🕒 Availability
        </Link>

        <Link
          to="/manage-users"
          className={
            isActive(
              "/manage-users"
            )
              ? "active"
              : ""
          }
        >
          👥
          {!collapsed &&
            " Users"}
        </Link>

        <Link
          to="/manage-services"
          className={
            isActive(
              "/manage-services"
            )
              ? "active"
              : ""
          }
        >
          💅
          {!collapsed &&
            " Services"}
        </Link>

        <Link
          to="/manage-reviews"
          className={
            isActive(
              "/manage-reviews"
            )
              ? "active"
              : ""
          }
        >
          ⭐
          {!collapsed &&
            " Reviews"}
        </Link>

        <Link
          to="/analytics"
          className={
            isActive(
              "/analytics"
            )
              ? "active"
              : ""
          }
        >
          📈
          {!collapsed &&
            " Analytics"}
        </Link>

        <Link
          to="/add-service"
          className={
            isActive(
              "/add-service"
            )
              ? "active"
              : ""
          }
        >
          ➕
          {!collapsed &&
            " Add Service"}
        </Link>
        <Link to="/manage-gallery">
          Manage Gallery
        </Link>

        <Link to="/">
          🏠
          {!collapsed &&
            " Homepage"}
        </Link>
      </nav>

      {/* Bottom */}
      <button
        className="sidebar-logout"
        onClick={logout}
      >
        🚪
        {!collapsed &&
          " Logout"}
      </button>
    </aside>
  );
}

export default AdminSidebar;