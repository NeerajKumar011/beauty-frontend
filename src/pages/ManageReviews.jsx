import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function ManageReviews() {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

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

    loadReviews();
  }, []);

  /* ======================
     Load Reviews
  ====================== */
  const loadReviews =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            `${API_BASE_URL}/admin/reviews`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setReviews(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch {
        setMsg(
          "Unable to load reviews."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Delete Review
  ====================== */
  const deleteReview =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this review?"
        );

      if (!ok)
        return;

      try {
        setActionId(
          id
        );

        await fetch(
          `${API_BASE_URL}/reviews/${id}`,
          {
            method:
              "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        loadReviews();
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
     Feature Review
  ====================== */
  const featureReview =
    async (id) => {
      try {
        setActionId(
          id
        );

        await fetch(
          `${API_BASE_URL}/reviews/${id}/feature`,
          {
            method:
              "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        loadReviews();
      } catch {
        setMsg(
          "Feature update failed."
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
  const filteredReviews =
    useMemo(() => {
      if (!search)
        return reviews;

      return reviews.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.message
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      reviews,
      search,
    ]);

  const stars = (
    count = 5
  ) =>
    "⭐".repeat(
      Number(
        count
      )
    );

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Header */}
        <div className="topbar">
          <div>
            <h1>
              Manage
              Reviews
            </h1>

            <p>
              Highlight
              premium
              feedback or
              remove spam
            </p>
          </div>

          <div className="top-actions">
            <input
              type="text"
              className="search-box"
              placeholder="Search reviews..."
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
                loadReviews
              }
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                Customer
                Reviews
              </h2>

              <p>
                {
                  filteredReviews.length
                }{" "}
                results
              </p>
            </div>

            <span className="pill-count">
              {
                reviews.length
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
                  reviews...
                </p>
              </div>
            ) : filteredReviews.length ===
              0 ? (
              <div className="empty-box">
                <p>
                  No
                  reviews
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
                      Rating
                    </th>

                    <th>
                      Review
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
                  {filteredReviews.map(
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
                          {stars(
                            item.rating ||
                              5
                          )}
                        </td>

                        <td className="review-text">
                          {
                            item.message
                          }
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              item.featured
                                ? "green"
                                : "yellow"
                            }`}
                          >
                            {item.featured
                              ? "Featured"
                              : "Normal"}
                          </span>
                        </td>

                        <td>
                          <div className="action-row">
                            <button
                              className="feature-btn"
                              disabled={
                                actionId ===
                                item._id
                              }
                              onClick={() =>
                                featureReview(
                                  item._id
                                )
                              }
                            >
                              {actionId ===
                              item._id
                                ? "Updating..."
                                : item.featured
                                ? "Unfeature"
                                : "Feature"}
                            </button>

                            <button
                              className="delete-btn"
                              disabled={
                                actionId ===
                                item._id
                              }
                              onClick={() =>
                                deleteReview(
                                  item._id
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

export default ManageReviews;