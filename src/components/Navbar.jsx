import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const storedUser =
    localStorage.getItem(
      "user"
    );

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const token =
    localStorage.getItem(
      "token"
    );

  const isLoggedIn =
    !!user && !!token;

  const isAdmin =
    user?.role === "admin";

  /* =====================
     Auto Close On Route Change
  ===================== */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* =====================
     Lock Body Scroll On Mobile Menu
  ===================== */
  useEffect(() => {
    if (
      menuOpen &&
      window.innerWidth <= 768
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [menuOpen]);

  /* =====================
     Logout
  ===================== */
  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );
    localStorage.removeItem(
      "user"
    );
    localStorage.removeItem(
      "selectedService"
    );

    setMenuOpen(false);
    navigate("/login");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  /* =====================
     Booking Modal Trigger
  ===================== */
  const openBooking = () => {
    setMenuOpen(false);

    window.dispatchEvent(
      new Event(
        "openBookingModal"
      )
    );
  };

  const closeMenu = () =>
    setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          💄 Neha Beauty
          Parlour
        </Link>

        {/* Toggle */}
        <button
          className="menu-toggle"
          aria-label="Open menu"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          {menuOpen
            ? "✕"
            : "☰"}
        </button>

        {/* Menu */}
        <nav
          className={`nav-right ${
            menuOpen
              ? "open"
              : ""
          }`}
        >
          {/* Public */}
          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/services"
            onClick={closeMenu}
          >
            Services
          </Link>

          <Link
            to="/gallery"
            onClick={closeMenu}
          >
            Gallery
          </Link>

          <a
            href="/#reviews"
            onClick={closeMenu}
          >
            Reviews
          </a>

          <a
            href="/#contact"
            onClick={closeMenu}
          >
            Contact
          </a>

          {/* User */}
          {isLoggedIn && (
            <Link
              to="/my-bookings"
              onClick={closeMenu}
            >
              My Bookings
            </Link>
          )}

          {/* Admin */}
          {isLoggedIn &&
            isAdmin && (
              <Link
                to="/dashboard"
                onClick={
                  closeMenu
                }
              >
                Dashboard
              </Link>
            )}

          {/* Auth */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/signup"
                onClick={
                  closeMenu
                }
              >
                Signup
              </Link>

              <Link
                to="/login"
                onClick={
                  closeMenu
                }
              >
                Login
              </Link>
            </>
          ) : (
            <button
              className="logout-btn"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          )}

          {/* CTA */}
          <a
            href="tel:+919199364185"
            className="call-btn"
          >
            Call Now
          </a>

          <button
            className="book-btn"
            onClick={
              openBooking
            }
          >
            Book Now
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;