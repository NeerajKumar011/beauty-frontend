import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate =
    useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const storedUser =
  localStorage.getItem("user");

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
    user?.role ===
      "admin";

  /* =====================
     Logout
  ===================== */
  const handleLogout =
    () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedService");
      setMenuOpen(false);
      navigate("/login");
      setTimeout(() => {
      window.location.reload();
    }, 100);
    };

  /* =====================
     Open Booking Modal
     (Handled only by Home.jsx)
  ===================== */


  const closeMenu =
    () =>
      setMenuOpen(
        false
      );

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={
            closeMenu
          }
        >
          💄 Neha Beauty
          Parlour
        </Link>

        {/* Mobile Toggle */}
        <button
          className="menu-toggle"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          ☰
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
            onClick={
              closeMenu
            }
          >
            Home
          </Link>

          <Link
            to="/services"
            onClick={
              closeMenu
            }
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
            onClick={
              closeMenu
            }
          >
            Reviews
          </a>

          <a
            href="/#contact"
            onClick={
              closeMenu
            }
          >
            Contact
          </a>

          {/* Logged User */}
          {isLoggedIn && (
            <Link
              to="/my-bookings"
              onClick={
                closeMenu
              }
            >
              My Bookings
            </Link>
          )}

          {/* Admin Only */}
          {isAdmin &&
            isLoggedIn && (
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

          {/* Action Buttons */}
          <a
            href="tel:+919199364185"
            className="call-btn"
          >
            Call Now
          </a>

          
        </nav>
      </div>
    </header>
  );
}

export default Navbar;