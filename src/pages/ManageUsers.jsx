import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

function ManageUsers() {
  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers =
    async () => {
      try {
        const res =
          await fetch(`${API_BASE_URL}/users`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setUsers(
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

  const blockUser =
    async (id) => {
      await fetch(`${API_BASE_URL}/users/${id}/block`,
        {
          method:
            "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadUsers();
    };

  const unblockUser =
    async (id) => {
      await fetch(`${API_BASE_URL}/users/${id}/unblock`,
        {
          method:
            "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadUsers();
    };

  const deleteUser =
    async (id) => {
      if (
        !window.confirm(
          "Delete user?"
        )
      )
        return;

      await fetch(
  `${API_BASE_URL}/users/${id}`,
        {
          method:
            "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadUsers();
    };

  const filtered =
    users.filter(
      (u) =>
        u.name
          ?.toLowerCase()
          .includes(
            (search || "").toLowerCase()
          ) ||
        u.email
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
              Users
            </h1>

            <p>
              Search,
              block or
              delete users
            </p>
          </div>

          <input
            type="text"
            className="search-box"
            placeholder="Search user..."
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
            All Users
          </h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Email
                  </th>
                  <th>
                    Joined
                  </th>
                  <th>
                    Bookings
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
                    user,
                    index
                  ) => (
                    <tr
                      key={
                        index
                      }
                    >
                      <td>
                        {user.name}
                      </td>

                      <td>
                        {
                          user.email
                        }
                      </td>

                      <td>
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {
                          user.bookingsCount
                        }
                      </td>

                      <td>
                        {user.isBlocked ? (
                          <span
                            style={{
                              color:
                                "red",
                              fontWeight:
                                "700",
                            }}
                          >
                            Blocked
                          </span>
                        ) : (
                          <span
                            style={{
                              color:
                                "green",
                              fontWeight:
                                "700",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </td>

                      <td>
                        {user.isBlocked ? (
                          <button
                            className="feature-btn"
                            onClick={() =>
                              unblockUser(
                                user._id
                              )
                            }
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="edit-btn"
                            onClick={() =>
                              blockUser(
                                user._id
                              )
                            }
                          >
                            Block
                          </button>
                        )}

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteUser(
                              user._id
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
                No users
                found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;