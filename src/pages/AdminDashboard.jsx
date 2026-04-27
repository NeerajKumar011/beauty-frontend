import API_BASE_URL from "../utils/api";
import { useEffect, useState } from "react";
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

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          summaryRes,
          bookingsRes,
        ] =
          await Promise.all([
            fetch(`${API_BASE_URL}/dashboard/summary`,
              {
                headers,
              }
            ),
            fetch(`${API_BASE_URL}/bookings`,
              {
                headers,
              }
            ),
          ]);

        const summaryData =
          await summaryRes.json();

        const bookingsData =
          await bookingsRes.json();

        setSummary(summaryData || {});

        setBookings(
          Array.isArray(
            bookingsData
          )
            ? bookingsData
            : []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>
              Welcome Admin 👑
            </h1>

            <p>
              Luxury salon
              control panel
            </p>
          </div>

          <input
            type="text"
            className="search-box"
            placeholder="Search..."
          />
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="card">
            <h3>
              Total Bookings
            </h3>
            <p>
              {
                summary.totalBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Today's
              Appointments
            </h3>
            <p>
              {
                summary.todayBookings
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Total Users
            </h3>
            <p>
              {
                summary.totalUsers
              }
            </p>
          </div>

          <div className="card">
            <h3>
              Total Services
            </h3>
            <p>
              {
                summary.totalServices
              }
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="booking-area">
          <h2>
            Recent Bookings
          </h2>

          <div className="table-wrap">
            {loading ? (
              <p>
                Loading...
              </p>
            ) : bookings.length ===
              0 ? (
              <p>
                No bookings
                found
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>
                      Name
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
                  {bookings
                    .slice(0, 8)
                    .map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
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
                            {
                              item.date
                            }
                          </td>

                          <td>
                            {
                              item.time
                            }
                          </td>

                          <td>
                            {item.status ||
                              "Pending"}
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