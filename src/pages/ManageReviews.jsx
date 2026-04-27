import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/admin.css";

function ManageReviews() {
  const [reviews, setReviews] =
    useState([]);

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews =
    async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }
    };

  const deleteReview =
    async (id) => {
      if (
        !window.confirm(
          "Delete review?"
        )
      )
        return;

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
    };

  const featureReview =
    async (id) => {
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
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Top */}
        <div className="topbar">
          <div>
            <h1>
              Manage
              Reviews
            </h1>

            <p>
              Highlight
              good reviews
              or remove
              spam
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="booking-area">
          <h2>
            Customer
            Reviews
          </h2>

          <div className="table-wrap">
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
                    Message
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {reviews.map(
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
                        {"⭐".repeat(
                          item.rating ||
                            5
                        )}
                      </td>

                      <td>
                        {
                          item.message
                        }
                      </td>

                      <td>
                        <button
                          className="feature-btn"
                          onClick={() =>
                            featureReview(
                              item._id
                            )
                          }
                        >
                          Feature
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteReview(
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

            {reviews.length ===
              0 && (
              <p
                style={{
                  marginTop:
                    "15px",
                }}
              >
                No reviews
                found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageReviews;