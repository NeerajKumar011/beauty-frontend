import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    cancellingId,
    setCancellingId,
  ] = useState("");

  const storedUser =
    localStorage.getItem(
      "user"
    );

  const user =
    storedUser
      ? JSON.parse(
          storedUser
        )
      : null;

  const token =
    localStorage.getItem(
      "token"
    ) || "";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    loadBookings();
  }, []);

  /* ======================
     Load Bookings
  ====================== */
  const loadBookings =
    async () => {
      if (
        !user ||
        !token
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/bookings/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (!res.ok) {
          throw new Error();
        }

        const data =
          await res.json();

        setBookings(
          Array.isArray(data)
            ? data
            : []
        );

        setError("");
      } catch {
        setError(
          "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Upcoming Check
  ====================== */
  const isUpcoming = (
    booking
  ) => {
    const dt =
      new Date(
        `${booking.date} ${booking.time}`
      );

    return (
      dt >=
      new Date()
    );
  };

  /* ======================
     Filters
  ====================== */
  const filteredBookings =
    useMemo(() => {
      if (
        filter ===
        "upcoming"
      ) {
        return bookings.filter(
          isUpcoming
        );
      }

      if (
        filter ===
        "past"
      ) {
        return bookings.filter(
          (b) =>
            !isUpcoming(
              b
            )
        );
      }

      return bookings;
    }, [
      bookings,
      filter,
    ]);

  /* ======================
     Formatters
  ====================== */
  const formatDate = (
    dateStr
  ) => {
    const d =
      new Date(
        dateStr
      );

    if (
      isNaN(d)
    )
      return dateStr;

    return d.toLocaleDateString(
      "en-IN",
      {
        weekday:
          "short",
        day: "numeric",
        month:
          "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (
    timeStr
  ) => {
    if (
      !timeStr
    )
      return "";

    const [h, m] =
      timeStr.split(
        ":"
      );

    const hour =
      parseInt(h);

    const ampm =
      hour >= 12
        ? "PM"
        : "AM";

    const finalHour =
      hour % 12 ===
      0
        ? 12
        : hour % 12;

    return `${finalHour}:${m} ${ampm}`;
  };

  const serviceIcon = (
    service = ""
  ) => {
    const s =
      service.toLowerCase();

    if (
      s.includes(
        "hair"
      )
    )
      return "✂️";

    if (
      s.includes(
        "facial"
      )
    )
      return "🧖‍♀️";

    if (
      s.includes(
        "massage"
      )
    )
      return "💆‍♀️";

    if (
      s.includes(
        "makeup"
      )
    )
      return "💄";

    if (
      s.includes(
        "nail"
      )
    )
      return "💅";

    return "✨";
  };

  /* ======================
     Cancel Booking
  ====================== */
  const cancelBooking =
    async (
      bookingId
    ) => {
      const ok =
        window.confirm(
          "Cancel this booking?"
        );

      if (!ok)
        return;

      try {
        setCancellingId(
          bookingId
        );

        const res =
          await fetch(
            `${API_BASE_URL}/bookings/${bookingId}`,
            {
              method:
                "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (
          !res.ok
        ) {
          throw new Error();
        }

        loadBookings();
      } catch {
        alert(
          "Unable to cancel booking."
        );
      } finally {
        setCancellingId(
          ""
        );
      }
    };

  /* ======================
     Login Required
  ====================== */
  if (!user) {
    return (
      <div className="mb-root">
        <div className="mb-empty-state">
          <div className="mb-empty-icon">
            🔒
          </div>

          <h2 className="mb-empty-title">
            Login Required
          </h2>

          <p className="mb-empty-sub">
            Please sign in
            to view your
            bookings.
          </p>

          <a
            href="/login"
            className="mb-login-btn"
          >
            Go To Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-root">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="mb-container">
        {/* Header */}
        <div className="mb-header">
          <div className="mb-header-left">
            <span className="mb-header-icon">
              📋
            </span>

            <div>
              <h1 className="mb-title">
                My
                Bookings
              </h1>

              <p className="mb-subtitle">
                Welcome
                back,{" "}
                <strong>
                  {user.name?.split(
                    " "
                  )[0] ||
                    "User"}
                </strong>
              </p>
            </div>
          </div>

          <div className="mb-count-box">
            <span>
              {
                bookings.length
              }
            </span>
            <p>
              Total
              Bookings
            </p>
          </div>
        </div>

        {/* Filters */}
        {!loading &&
          bookings.length >
            0 && (
            <div className="mb-filters">
              <button
                className={`mb-filter-btn ${
                  filter ===
                  "all"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(
                    "all"
                  )
                }
              >
                All
              </button>

              <button
                className={`mb-filter-btn ${
                  filter ===
                  "upcoming"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(
                    "upcoming"
                  )
                }
              >
                Upcoming
              </button>

              <button
                className={`mb-filter-btn ${
                  filter ===
                  "past"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(
                    "past"
                  )
                }
              >
                Past
              </button>
            </div>
          )}

        {/* Loading */}
        {loading && (
          <div className="mb-loading">
            <div className="mini-loader"></div>
            <p>
              Loading
              bookings...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-error">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBookings.length ===
            0 && (
            <div className="mb-empty-state card">
              <div className="mb-empty-icon">
                💄
              </div>

              <h3 className="mb-empty-title">
                No Bookings
                Yet
              </h3>

              <p className="mb-empty-sub">
                Book your
                first
                appointment
                now.
              </p>

              <button
                className="mb-login-btn"
                onClick={() =>
                  window.dispatchEvent(
                    new Event(
                      "openBookingModal"
                    )
                  )
                }
              >
                Book
                Appointment
              </button>
            </div>
          )}

        {/* Cards */}
        {!loading &&
          !error &&
          filteredBookings.length >
            0 && (
            <div className="mb-list">
              {filteredBookings.map(
                (
                  booking,
                  index
                ) => (
                  <div
                    key={
                      booking._id ||
                      index
                    }
                    className="mb-card"
                  >
                    <div className="mb-card-icon">
                      {serviceIcon(
                        booking.service
                      )}
                    </div>

                    <div className="mb-card-body">
                      <div className="mb-card-top">
                        <h3 className="mb-service">
                          {
                            booking.service
                          }
                        </h3>

                        <span
                          className={`mb-status ${
                            isUpcoming(
                              booking
                            )
                              ? "upcoming"
                              : "past"
                          }`}
                        >
                          {isUpcoming(
                            booking
                          )
                            ? "Upcoming"
                            : "Completed"}
                        </span>
                      </div>

                      <div className="mb-card-details">
                        <span className="mb-detail">
                          📅{" "}
                          {formatDate(
                            booking.date
                          )}
                        </span>

                        <span className="mb-detail">
                          🕐{" "}
                          {formatTime(
                            booking.time
                          )}
                        </span>
                      </div>

                      {isUpcoming(
                        booking
                      ) && (
                        <button
                          className="mb-cancel-btn"
                          onClick={() =>
                            cancelBooking(
                              booking._id
                            )
                          }
                          disabled={
                            cancellingId ===
                            booking._id
                          }
                        >
                          {cancellingId ===
                          booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default MyBookings;