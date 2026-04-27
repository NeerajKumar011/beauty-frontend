import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
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

  const [updatingId, setUpdatingId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [msg, setMsg] =
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
  }, []);

  useEffect(() => {
    loadBookings(
      selectedDate
    );
  }, [selectedDate]);

  /* ======================
     Load Bookings
  ====================== */
  const loadBookings =
    async (date) => {
      setLoading(true);
      setMsg("");

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
          await res
            .json()
            .catch(
              () => []
            );

        setBookings(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch {
        setMsg(
          "Unable to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Update Status
  ====================== */
  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        setUpdatingId(
          id
        );

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
      } catch {
        setMsg(
          "Status update failed."
        );
      } finally {
        setUpdatingId(
          ""
        );
      }
    };

  /* ======================
     Search
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
            ) ||
          item.time
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
     Format
  ====================== */
  const formatDate = (
    date
  ) => {
    const d =
      new Date(
        date
      );

    return d.toLocaleDateString(
      "en-IN",
      {
        weekday:
          "long",
        day: "numeric",
        month:
          "long",
        year:
          "numeric",
      }
    );
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
      "completed"
    )
      return "blue";

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
              appointment
              management
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={() =>
              loadBookings(
                selectedDate
              )
            }
          >
            ↻ Refresh
          </button>
        </div>

        {/* Controls */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                Manage Day
              </h2>

              <p>
                {
                  formatDate(
                    selectedDate
                  )
                }
              </p>
            </div>

            <span className="pill-count">
              {
                filteredBookings.length
              }{" "}
              Bookings
            </span>
          </div>

          <div className="table-wrap">
            <div className="calendar-controls">
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

              <input
                type="text"
                className="search-box"
                placeholder="Search..."
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
            </div>

            {msg && (
              <div className="admin-msg error">
                {msg}
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>

                <p>
                  Loading
                  bookings...
                </p>
              </div>
            ) : filteredBookings.length ===
              0 ? (
              <div className="empty-box">
                <p>
                  No
                  bookings
                  for this
                  date.
                </p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>
                      Time
                    </th>
                    <th>
                      Customer
                    </th>
                    <th>
                      Service
                    </th>
                    <th>
                      Status
                    </th>
                    <th>
                      Update
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map(
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
                          <span
                            className={`status-pill ${statusClass(
                              item.status
                            )}`}
                          >
                            {item.status ||
                              "Pending"}
                          </span>
                        </td>

                        <td>
                          <select
                            value={
                              item.status ||
                              "Pending"
                            }
                            disabled={
                              updatingId ===
                              item._id
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