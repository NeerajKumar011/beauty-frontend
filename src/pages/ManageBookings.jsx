import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

function ManageBookings() {
  const [bookings, setBookings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings =
    async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }
    };

  const updateStatus =
    async (
      id,
      status
    ) => {
      await fetch(`${API_BASE_URL}/bookings/${id}`,
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
    };

  const deleteBooking =
    async (id) => {
      if (
        !window.confirm(
          "Delete booking?"
        )
      )
        return;

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
    };

  const filtered =
    bookings.filter(
      (item) =>
        item.name
          ?.toLowerCase()
          .includes(
            (search || "").toLowerCase()
          ) ||
        item.service
          ?.toLowerCase()
          .includes(
            (search || "").toLowerCase()
          )
    );

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Top */}
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

          <input
            type="text"
            className="search-box"
            placeholder="Search booking..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target
                  .value
              )
            }
          />
        </div>

        {/* Table */}
        <div className="booking-area">
          <h2>
            All Bookings
          </h2>

          <div className="table-wrap">
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
                        <select
                          value={
                            item.status ||
                            "Pending"
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

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteBooking(
                              item._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {filtered.length ===
              0 && (
              <p
                style={{
                  marginTop:
                    "15px",
                }}
              >
                No bookings
                found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageBookings;