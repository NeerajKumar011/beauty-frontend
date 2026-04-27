import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function BookingCalendar() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const tomorrowDate =
    new Date();

  tomorrowDate.setDate(
    tomorrowDate.getDate() +
      1
  );

  const tomorrow =
    tomorrowDate
      .toISOString()
      .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadBookings(
      selectedDate
    );
  }, [selectedDate]);

  const loadBookings =
    async (date) => {
      setLoading(true);

      try {
        const res =
          await fetch(
  `${API_BASE_URL}/bookings/date/${date}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
  await res.json().catch(
    () => []
  );

        setBookings(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const updateStatus =
    async (
      id,
      status
    ) => {
      await fetch(
  `${API_BASE_URL}/bookings/${id}/status`,
        {
          method:
            "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            { status }
          ),
        }
      );

      loadBookings(
        selectedDate
      );
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Top */}
        <div className="topbar">
          <div>
            <h1>
              Booking
              Calendar
            </h1>

            <p>
              Daily salon
              planner &
              appointments
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="table-wrap">
          <div
            style={{
              display:
                "flex",
              gap: "10px",
              flexWrap:
                "wrap",
              marginBottom:
                "20px",
            }}
          >
            <input
              type="date"
              value={
                selectedDate
              }
              onChange={(
                e
              ) =>
                setSelectedDate(
                  e.target
                    .value
                )
              }
            />

            <button
              className="book-btn"
              onClick={() =>
                setSelectedDate(
                  today
                )
              }
            >
              Today
            </button>

            <button
              className="feature-btn"
              onClick={() =>
                setSelectedDate(
                  tomorrow
                )
              }
            >
              Tomorrow
            </button>
          </div>

          <h2>
            Bookings for{" "}
            {
              selectedDate
            }
          </h2>
        </div>

        {/* Bookings */}
        <div className="booking-area">
          <div className="table-wrap">
            {loading ? (
              <p>
                Loading...
              </p>
            ) : bookings.length ===
              0 ? (
              <p>
                No bookings
                for this
                date.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>
                      Time
                    </th>
                    <th>
                      Name
                    </th>
                    <th>
                      Service
                    </th>
                    <th>
                      Status
                    </th>
                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map(
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
                            item.time
                          }
                        </td>

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
                            item.status
                          }
                        </td>

                        <td>
                          <select
                            value={
                              item.status
                            }
                            onChange={(
                              e
                            ) =>
                              updateStatus(
                                item._id,
                                e
                                  .target
                                  .value
                              )
                            }
                          >
                            <option>
                              Pending
                            </option>
                            <option>
                              Confirmed
                            </option>
                            <option>
                              Completed
                            </option>
                            <option>
                              Cancelled
                            </option>
                          </select>
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

export default BookingCalendar;