import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function Analytics() {
  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalBookings: 0,
      totalServices: 0,
      todayBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      reviews: 0,
    });

  const [loading, setLoading] =
    useState(true);

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

    loadStats();
  }, []);

  /* ======================
     Load Stats
  ====================== */
  const loadStats =
    async () => {
      try {
        setLoading(true);
        setError("");

        const res =
          await fetch(
            `${API_BASE_URL}/dashboard/summary`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res
            .json()
            .catch(
              () => ({})
            );

        setStats({
          totalUsers:
            data.totalUsers ||
            0,
          totalBookings:
            data.totalBookings ||
            0,
          totalServices:
            data.totalServices ||
            0,
          todayBookings:
            data.todayBookings ||
            0,
          completedBookings:
            data.completedBookings ||
            0,
          pendingBookings:
            data.pendingBookings ||
            0,
          cancelledBookings:
            data.cancelledBookings ||
            0,
          reviews:
            data.reviews ||
            0,
        });
      } catch {
        setError(
          "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Percentages
  ====================== */
  const rates =
    useMemo(() => {
      const total =
        stats.totalBookings ||
        1;

      return {
        completed:
          Math.round(
            (stats.completedBookings /
              total) *
              100
          ),
        pending:
          Math.round(
            (stats.pendingBookings /
              total) *
              100
          ),
        cancelled:
          Math.round(
            (stats.cancelledBookings /
              total) *
              100
          ),
      };
    }, [stats]);

  const growth =
    stats.totalBookings >
    0
      ? Math.round(
          (stats.todayBookings /
            stats.totalBookings) *
            100
        )
      : 0;

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Header */}
        <div className="topbar">
          <div>
            <h1>
              Analytics
            </h1>

            <p>
              Business
              growth &
              premium salon
              insights
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={
              loadStats
            }
          >
            ↻ Refresh
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="loading-box">
            <div className="mini-loader"></div>
            <p>
              Loading
              analytics...
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
                loadStats
              }
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Main Cards */}
            <div className="stats-grid">
              <div className="card stat-card pink">
                <span className="stat-icon">
                  👥
                </span>

                <h3>
                  Total
                  Users
                </h3>

                <p>
                  {
                    stats.totalUsers
                  }
                </p>
              </div>

              <div className="card stat-card blue">
                <span className="stat-icon">
                  📅
                </span>

                <h3>
                  Total
                  Bookings
                </h3>

                <p>
                  {
                    stats.totalBookings
                  }
                </p>
              </div>

              <div className="card stat-card purple">
                <span className="stat-icon">
                  ✨
                </span>

                <h3>
                  Services
                </h3>

                <p>
                  {
                    stats.totalServices
                  }
                </p>
              </div>

              <div className="card stat-card gold">
                <span className="stat-icon">
                  ⭐
                </span>

                <h3>
                  Reviews
                </h3>

                <p>
                  {
                    stats.reviews
                  }
                </p>
              </div>
            </div>

            {/* Status Cards */}
            <div className="stats-grid">
              <div className="card progress-card">
                <h3>
                  Completed
                </h3>

                <p>
                  {
                    stats.completedBookings
                  }
                </p>

                <div className="progress-line">
                  <span
                    style={{
                      width: `${rates.completed}%`,
                    }}
                  ></span>
                </div>

                <small>
                  {
                    rates.completed
                  }
                  %
                </small>
              </div>

              <div className="card progress-card">
                <h3>
                  Pending
                </h3>

                <p>
                  {
                    stats.pendingBookings
                  }
                </p>

                <div className="progress-line">
                  <span
                    style={{
                      width: `${rates.pending}%`,
                    }}
                  ></span>
                </div>

                <small>
                  {
                    rates.pending
                  }
                  %
                </small>
              </div>

              <div className="card progress-card">
                <h3>
                  Cancelled
                </h3>

                <p>
                  {
                    stats.cancelledBookings
                  }
                </p>

                <div className="progress-line">
                  <span
                    style={{
                      width: `${rates.cancelled}%`,
                    }}
                  ></span>
                </div>

                <small>
                  {
                    rates.cancelled
                  }
                  %
                </small>
              </div>

              <div className="card progress-card">
                <h3>
                  Today’s
                  Growth
                </h3>

                <p>
                  {
                    stats.todayBookings
                  }
                </p>

                <div className="progress-line">
                  <span
                    style={{
                      width: `${growth}%`,
                    }}
                  ></span>
                </div>

                <small>
                  {growth}%
                </small>
              </div>
            </div>

            {/* Summary */}
            <div className="booking-area">
              <div className="section-head">
                <div>
                  <h2>
                    Performance
                    Summary
                  </h2>

                  <p>
                    Quick view
                    of business
                    health
                  </p>
                </div>
              </div>

              <div className="table-wrap analytics-summary">
                <div className="summary-item">
                  <span>
                    📈
                  </span>

                  <div>
                    <h4>
                      Booking
                      Momentum
                    </h4>

                    <p>
                      Your salon
                      is receiving
                      regular
                      customer
                      bookings.
                    </p>
                  </div>
                </div>

                <div className="summary-item">
                  <span>
                    👥
                  </span>

                  <div>
                    <h4>
                      Customer
                      Base
                    </h4>

                    <p>
                      {
                        stats.totalUsers
                      }{" "}
                      registered
                      users.
                    </p>
                  </div>
                </div>

                <div className="summary-item">
                  <span>
                    💄
                  </span>

                  <div>
                    <h4>
                      Service
                      Range
                    </h4>

                    <p>
                      {
                        stats.totalServices
                      }{" "}
                      active salon
                      services.
                    </p>
                  </div>
                </div>

                <div className="summary-item">
                  <span>
                    📅
                  </span>

                  <div>
                    <h4>
                      Today’s
                      Demand
                    </h4>

                    <p>
                      {
                        stats.todayBookings
                      }{" "}
                      bookings
                      scheduled
                      today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;