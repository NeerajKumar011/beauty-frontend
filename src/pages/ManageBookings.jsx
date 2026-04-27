import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function ManageBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [msg, setMsg] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState("");

  const [deletingId, setDeletingId] =
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

    loadBookings();
  }, []);

  /* ======================
     Load Bookings
  ====================== */
  const loadBookings =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            `${API_BASE_URL}/bookings`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

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
          `${API_BASE_URL}/bookings/${id}`,
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

        loadBookings();
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
     Delete Booking
  ====================== */
  const deleteBooking =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this booking?"
        );

      if (!ok)
        return;

      try {
        setDeletingId(
          id
        );

        await fetch(
          `${API_BASE_URL}/bookings/${id}`,
          {
            method:
              "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        loadBookings();
      } catch {
        setMsg(
          "Delete failed."
        );
      } finally {
        setDeletingId(
          ""
        );
      }
    };

  /* ======================
     Search
  ====================== */
  const filtered =
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
          item.date
            ?.includes(
              search
            )
      );
    }, [
      bookings,
      search,
    ]);

  /* ======================
     Helpers
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
        {/* Header */}
        <div className="topbar">
          <div>
            <h1>
              Manage
              Bookings
            </h1>

            <p>
              Update,
              search or
              delete
              appointments
            </p>
          </div>

          <div className="top-actions">
            <input
              type="text"
              className="search-box"
              placeholder="Search booking..."
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
                loadBookings
              }
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                All
                Bookings
              </h2>

              <p>
                {
                  filtered.length
                }{" "}
                results
                found
              </p>
            </div>

            <span className="pill-count">
              {
                bookings.length
              }{" "}
              Total
            </span>
          </div>

          <div className="table-wrap">
            {msg && (
              <div className="admin-msg error">
                {msg}
              </div>
            )}

            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>

                <p>
                  Loading
                  bookings...
                </p>
              </div>
            ) : filtered.length ===
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

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
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

                        <td>
                          <div className="action-row">
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

                            <button
                              className="delete-btn"
                              disabled={
                                deletingId ===
                                item._id
                              }
                              onClick={() =>
                                deleteBooking(
                                  item._id
                                )
                              }
                            >
                              {deletingId ===
                              item._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
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

export default ManageBookings;