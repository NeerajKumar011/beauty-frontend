import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function ManageUsers() {
  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [msg, setMsg] =
    useState("");

  const [actionId, setActionId] =
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

    loadUsers();
  }, []);

  /* ======================
     Load Users
  ====================== */
  const loadUsers =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            `${API_BASE_URL}/users`,
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
      } catch {
        setMsg(
          "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Block User
  ====================== */
  const blockUser =
    async (id) => {
      try {
        setActionId(
          id
        );

        await fetch(
          `${API_BASE_URL}/users/${id}/block`,
          {
            method:
              "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMsg(
          "User blocked."
        );

        loadUsers();
      } catch {
        setMsg(
          "Block action failed."
        );
      } finally {
        setActionId(
          ""
        );
      }
    };

  /* ======================
     Unblock User
  ====================== */
  const unblockUser =
    async (id) => {
      try {
        setActionId(
          id
        );

        await fetch(
          `${API_BASE_URL}/users/${id}/unblock`,
          {
            method:
              "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMsg(
          "User unblocked."
        );

        loadUsers();
      } catch {
        setMsg(
          "Unblock action failed."
        );
      } finally {
        setActionId(
          ""
        );
      }
    };

  /* ======================
     Delete User
  ====================== */
  const deleteUser =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this user?"
        );

      if (!ok)
        return;

      try {
        setActionId(
          id
        );

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

        setMsg(
          "User deleted."
        );

        loadUsers();
      } catch {
        setMsg(
          "Delete failed."
        );
      } finally {
        setActionId(
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
        return users;

      return users.filter(
        (u) =>
          u.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          u.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      users,
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

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Header */}
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

          <div className="top-actions">
            <input
              type="text"
              className="search-box"
              placeholder="Search user..."
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
                loadUsers
              }
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                All Users
              </h2>

              <p>
                {
                  filtered.length
                }{" "}
                results
              </p>
            </div>

            <span className="pill-count">
              {
                users.length
              }{" "}
              Total
            </span>
          </div>

          <div className="table-wrap">
            {msg && (
              <div className="admin-msg success">
                {msg}
              </div>
            )}

            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>

                <p>
                  Loading
                  users...
                </p>
              </div>
            ) : filtered.length ===
              0 ? (
              <div className="empty-box">
                <p>
                  No users
                  found.
                </p>
              </div>
            ) : (
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
                          user._id ||
                          index
                        }
                      >
                        <td>
                          {
                            user.name
                          }
                        </td>

                        <td>
                          {
                            user.email
                          }
                        </td>

                        <td>
                          {formatDate(
                            user.createdAt
                          )}
                        </td>

                        <td>
                          {user.bookingsCount ||
                            0}
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              user.isBlocked
                                ? "red"
                                : "green"
                            }`}
                          >
                            {user.isBlocked
                              ? "Blocked"
                              : "Active"}
                          </span>
                        </td>

                        <td>
                          <div className="action-row">
                            {user.isBlocked ? (
                              <button
                                className="feature-btn"
                                disabled={
                                  actionId ===
                                  user._id
                                }
                                onClick={() =>
                                  unblockUser(
                                    user._id
                                  )
                                }
                              >
                                {actionId ===
                                user._id
                                  ? "Please wait..."
                                  : "Unblock"}
                              </button>
                            ) : (
                              <button
                                className="edit-btn"
                                disabled={
                                  actionId ===
                                  user._id
                                }
                                onClick={() =>
                                  blockUser(
                                    user._id
                                  )
                                }
                              >
                                {actionId ===
                                user._id
                                  ? "Please wait..."
                                  : "Block"}
                              </button>
                            )}

                            <button
                              className="delete-btn"
                              disabled={
                                actionId ===
                                user._id
                              }
                              onClick={() =>
                                deleteUser(
                                  user._id
                                )
                              }
                            >
                              Delete
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

export default ManageUsers;