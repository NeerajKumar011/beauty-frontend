import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function AdminDashboard() {
  const [summary, setSummary] =
    useState({
      totalUsers: 0,
      totalBookings: 0,
      totalServices: 0,
      todayBookings: 0,
    });

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem(
      "token"
    ) || "";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    loadDashboard();
  }, []);

  /* ======================
     Load Dashboard
  ====================== */
  const loadDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          summaryRes,
          bookingsRes,
        ] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/dashboard/summary`,
              { headers }
            ),
            fetch(
              `${API_BASE_URL}/bookings`,
              { headers }
            ),
          ]);

        const summaryData =
          await summaryRes.json();

        const bookingsData =
          await bookingsRes.json();

        setSummary(
          summaryData ||
            {}
        );

        setBookings(
          Array.isArray(
            bookingsData
          )
            ? bookingsData
            : []
        );
      } catch {
        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Search Filter
  ====================== */
  const filteredBookings =
    useMemo(() => {
      if (!search)
        return bookings;

      return bookings.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.service
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      bookings,
      search,
    ]);

  /* ======================
     Formatters
  ====================== */
  const formatDate = (
    value
  ) => {
    if (!value)
      return "-";

    const d =
      new Date(
        value
      );

    if (
      isNaN(d)
    )
      return value;

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month:
          "short",
        year:
          "numeric",
      }
    );
  };

  const formatTime = (
    value
  ) => {
    if (!value)
      return "-";

    const [h, m] =
      value.split(
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

  const statusClass = (
    status
  ) => {
    const s =
      (
        status ||
        "Pending"
      ).toLowerCase();

    if (
      s ===
      "confirmed"
    )
      return "green";

    if (
      s ===
      "cancelled"
    )
      return "red";

    return "yellow";
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>
              Welcome
              Admin 👑
            </h1>

            <p>
              Luxury salon
              control
              center
            </p>
          </div>

          <div className="top-actions">
            <input
              type="text"
              className="search-box"
              placeholder="Search bookings..."
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
            />

            <button
              className="refresh-btn"
              onClick={
                loadDashboard
              }
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="card stat-card pink">
            <span className="stat-icon">
              📅
            </span>

            <h3>
              Total
              Bookings
            </h3>

            <p>
              {
                summary.totalBookings
              }
            </p>
          </div>

          <div className="card stat-card purple">
            <span className="stat-icon">
              ⏰
            </span>

            <h3>
              Today’s
              Appointments
            </h3>

            <p>
              {
                summary.todayBookings
              }
            </p>
          </div>

          <div className="card stat-card blue">
            <span className="stat-icon">
              👥
            </span>

            <h3>
              Total
              Users
            </h3>

            <p>
              {
                summary.totalUsers
              }
            </p>
          </div>

          <div className="card stat-card gold">
            <span className="stat-icon">
              ✨
            </span>

            <h3>
              Services
            </h3>

            <p>
              {
                summary.totalServices
              }
            </p>
          </div>
        </div>

        {/* Booking Area */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                Recent
                Bookings
              </h2>

              <p>
                Latest
                customer
                appointments
              </p>
            </div>

            <span className="pill-count">
              {
                filteredBookings.length
              }{" "}
              Results
            </span>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>
                <p>
                  Loading
                  dashboard...
                </p>
              </div>
            ) : error ? (
              <div className="error-box">
                <p>
                  {error}
                </p>

                <button
                  className="refresh-btn"
                  onClick={
                    loadDashboard
                  }
                >
                  Retry
                </button>
              </div>
            ) : filteredBookings.length ===
              0 ? (
              <div className="empty-box">
                <p>
                  No
                  bookings
                  found.
                </p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>
                      Customer
                    </th>
                    <th>
                      Service
                    </th>
                    <th>
                      Date
                    </th>
                    <th>
                      Time
                    </th>
                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings
                    .slice(
                      0,
                      10
                    )
                    .map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
                            item._id ||
                            index
                          }
                        >
                          <td>
                            {
                              item.name
                            }
                          </td>

                          <td>
                            {
                              item.service
                            }
                          </td>

                          <td>
                            {formatDate(
                              item.date
                            )}
                          </td>

                          <td>
                            {formatTime(
                              item.time
                            )}
                          </td>

                          <td>
                            <span
                              className={`status-pill ${statusClass(
                                item.status
                              )}`}
                            >
                              {item.status ||
                                "Pending"}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;