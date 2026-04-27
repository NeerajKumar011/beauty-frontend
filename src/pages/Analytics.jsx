import API_BASE_URL from "../utils/api";
import {
  useEffect,
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

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats =
    async () => {
      try {
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
  await res.json().catch(
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
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Top */}
        <div className="topbar">
          <div>
            <h1>
              Analytics
            </h1>

            <p>
              Business
              growth &
              salon
              insights
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="stats-grid">
          <div className="card">
            <h3>
              Total Users
            </h3>
            <p>
              {
                stats.totalUsers
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Total Bookings
            </h3>
            <p>
              {
                stats.totalBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Today's
              Bookings
            </h3>
            <p>
              {
                stats.todayBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Services
            </h3>
            <p>
              {
                stats.totalServices
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Completed
            </h3>
            <p>
              {
                stats.completedBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Pending
            </h3>
            <p>
              {
                stats.pendingBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Cancelled
            </h3>
            <p>
              {
                stats.cancelledBookings
              }
            </p>
          </div>

          <div className="card">
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

        {/* Summary */}
        <div className="booking-area">
          <h2>
            Performance
            Summary
          </h2>

          <div className="table-wrap">
            <p>
              📈 Your salon
              bookings are
              growing.
            </p>

            <p>
              👥 Total
              customers:{" "}
              {
                stats.totalUsers
              }
            </p>

            <p>
              💄 Total
              services:{" "}
              {
                stats.totalServices
              }
            </p>

            <p>
              ⭐ Reviews:{" "}
              {
                stats.reviews
              }
            </p>

            <p>
              📅 Today's
              bookings:{" "}
              {
                stats.todayBookings
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;