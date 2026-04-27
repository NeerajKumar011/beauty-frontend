import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import "../styles/Admin.css";

function AdminSidebar() {
  const location =
    useLocation();

  const [collapsed, setCollapsed] =
    useState(
      localStorage.getItem(
        "adminSidebarCollapsed"
      ) === "true"
    );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  /* ======================
     Close mobile on route
  ====================== */
  useEffect(() => {
    setMobileOpen(false);
  }, [
    location.pathname,
  ]);

  /* ======================
     Logout
  ====================== */
  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "selectedService"
    );

    window.location.href =
      "/login";

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  /* ======================
     Active Route
  ====================== */
  const isActive = (
    path
  ) =>
    location.pathname ===
      path ||
    location.pathname.startsWith(
      path + "/"
    );

  /* ======================
     Collapse Toggle
  ====================== */
  const toggleCollapse =
    () => {
      const next =
        !collapsed;

      setCollapsed(
        next
      );

      localStorage.setItem(
        "adminSidebarCollapsed",
        next
      );
    };

  /* ======================
     Menu Items
  ====================== */
  const links = [
    {
      to: "/dashboard",
      icon: "📊",
      label:
        "Dashboard",
    },
    {
      to: "/manage-bookings",
      icon: "📅",
      label:
        "Bookings",
    },
    {
      to: "/booking-calendar",
      icon: "🗓️",
      label:
        "Calendar",
    },
    {
      to: "/availability-settings",
      icon: "🕒",
      label:
        "Availability",
    },
    {
      to: "/manage-users",
      icon: "👥",
      label:
        "Users",
    },
    {
      to: "/manage-services",
      icon: "💅",
      label:
        "Services",
    },
    {
      to: "/add-service",
      icon: "➕",
      label:
        "Add Service",
    },
    {
      to: "/manage-gallery",
      icon: "🖼️",
      label:
        "Gallery",
    },
    {
      to: "/manage-reviews",
      icon: "⭐",
      label:
        "Reviews",
    },
    {
      to: "/analytics",
      icon: "📈",
      label:
        "Analytics",
    },
    {
      to: "/",
      icon: "🏠",
      label:
        "Homepage",
    },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="admin-mobile-bar">
        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
        >
          ☰
        </button>

        <h2>
          💄 Admin
        </h2>

        <button
          className="collapse-btn mobile-hide"
          onClick={
            toggleCollapse
          }
        >
          {collapsed
            ? "➡"
            : "⬅"}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          collapsed
            ? "collapsed"
            : ""
        } ${
          mobileOpen
            ? "show-mobile"
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
            onClick={
              toggleCollapse
            }
          >
            {collapsed
              ? "➡"
              : "⬅"}
          </button>
        </div>

        {/* Links */}
        <nav className="sidebar-links">
          {links.map(
            (
              item
            ) => (
              <Link
                key={
                  item.to
                }
                to={
                  item.to
                }
                className={
                  isActive(
                    item.to
                  )
                    ? "active"
                    : ""
                }
              >
                <span className="nav-icon">
                  {
                    item.icon
                  }
                </span>

                {!collapsed && (
                  <span>
                    {
                      item.label
                    }
                  </span>
                )}
              </Link>
            )
          )}
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
    </>
  );
}

export default AdminSidebar;