import API_BASE_URL from "../utils/api";
import { useEffect, useState } from "react";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const storedUser =
  localStorage.getItem("user");

const user = storedUser
  ? JSON.parse(storedUser)
  : null;
  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/bookings/${user._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load bookings.");
        setLoading(false);
      });
  }, []);

  const isUpcoming = (b) => {
    const bookingDate = new Date(`${b.date} ${b.time}`);
    return bookingDate >= new Date();
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "upcoming") return isUpcoming(b);
    if (filter === "past") return !isUpcoming(b);
    return true;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;

    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;

    return `${display}:${m} ${ampm}`;
  };

  const serviceIcon = (service = "") => {
    const s = service.toLowerCase();

    if (s.includes("hair")) return "✂️";
    if (s.includes("facial")) return "🧖‍♀️";
    if (s.includes("massage")) return "💆‍♀️";
    if (s.includes("makeup")) return "💄";
    if (s.includes("nail")) return "💅";

    return "💇‍♀️";
  };

  // 🔒 Not logged in
  if (!user) {
    return (
      <div className="mb-root">
        <div className="mb-empty-state">
          <div className="mb-empty-icon">🔒</div>
          <h2 className="mb-empty-title">Login Required</h2>
          <p className="mb-empty-sub">
            Please sign in to view your bookings.
          </p>

          <a href="/login" className="mb-login-btn">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-root">
      {/* background */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="mb-container">
        {/* HEADER */}
        <div className="mb-header clean-top">
          <div className="mb-header-left">
            <span className="mb-header-icon">📋</span>

            <div>
              <h1 className="mb-title">My Bookings</h1>

              <p className="mb-subtitle">
                Welcome back,{" "}
                <strong>
                  {user.name?.split(" ")[0] || "User"}
                </strong>
              </p>
            </div>
          </div>

          {/* removed overlapping stats box */}
        </div>

        {/* filters */}
        {!loading && bookings.length > 0 && (
          <div className="mb-filters">
            <button
              className={`mb-filter-btn ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={`mb-filter-btn ${
                filter === "upcoming" ? "active" : ""
              }`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>

            <button
              className={`mb-filter-btn ${
                filter === "past" ? "active" : ""
              }`}
              onClick={() => setFilter("past")}
            >
              Past
            </button>
          </div>
        )}

        {/* loading */}
        {loading && (
          <div className="mb-loading">
            <p>Loading bookings...</p>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="mb-error">{error}</div>
        )}

        {/* empty */}
        {!loading &&
          !error &&
          filteredBookings.length === 0 && (
            <div className="mb-empty-state card">
              <div className="mb-empty-icon">💄</div>

              <h3 className="mb-empty-title">
                No bookings yet
              </h3>

              <p className="mb-empty-sub">
                Book your first appointment now.
              </p>

              {/* integrated with homepage modal button logic */}
              <button
                className="mb-login-btn"
                onClick={() =>
                  window.dispatchEvent(
                    new Event("openBookingModal")
                  )
                }
              >
                Book Appointment
              </button>
            </div>
          )}

        {/* bookings list */}
        {!loading &&
          !error &&
          filteredBookings.length > 0 && (
            <div className="mb-list">
              {filteredBookings.map((b, index) => (
                <div
                  key={b._id || index}
                  className="mb-card"
                >
                  <div className="mb-card-icon">
                    {serviceIcon(b.service)}
                  </div>

                  <div className="mb-card-body">
                    <div className="mb-card-top">
                      <h3 className="mb-service">
                        {b.service}
                      </h3>
                    </div>

                    <div className="mb-card-details">
                      <span className="mb-detail">
                        📅 {formatDate(b.date)}
                      </span>

                      <span className="mb-detail">
                        🕐 {formatTime(b.time)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default MyBookings;