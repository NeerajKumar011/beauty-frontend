import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function ManageServices() {
  const [services, setServices] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      price: "",
      time: "",
      description: "",
      category: "",
    });

  const [editId, setEditId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [msgType, setMsgType] =
    useState("success");

  const token =
    localStorage.getItem(
      "token"
    ) || "";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    loadServices();
  }, []);

  /* ======================
     Load Services
  ====================== */
  const loadServices =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/services`
          );

        const data =
          await res.json();

        setServices(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Unable to load services."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Reset Form
  ====================== */
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      time: "",
      description: "",
      category: "",
    });

    setEditId(null);
  };

  /* ======================
     Submit
  ====================== */
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const url =
        editId
          ? `${API_BASE_URL}/services/${editId}`
          : `${API_BASE_URL}/services`;

      const method =
        editId
          ? "PUT"
          : "POST";

      try {
        setSaving(true);

        const res =
          await fetch(
            url,
            {
              method,
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(
                {
                  ...form,
                  name:
                    form.name.trim(),
                  price:
                    form.price.trim(),
                  time:
                    form.time.trim(),
                  description:
                    form.description.trim(),
                  category:
                    form.category.trim(),
                }
              ),
            }
          );

        const data =
          await res
            .json()
            .catch(
              () => ({})
            );

        if (
          res.ok
        ) {
          setMsgType(
            "success"
          );

          setMsg(
            editId
              ? "Service updated successfully ✨"
              : "Service added successfully ✨"
          );

          resetForm();
          loadServices();
        } else {
          setMsgType(
            "error"
          );

          setMsg(
            data.message ||
              "Failed to save service."
          );
        }
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Server error."
        );
      } finally {
        setSaving(false);
      }
    };

  /* ======================
     Delete
  ====================== */
  const handleDelete =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this service?"
        );

      if (!ok)
        return;

      try {
        setDeletingId(
          id
        );

        await fetch(
          `${API_BASE_URL}/services/${id}`,
          {
            method:
              "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMsgType(
          "success"
        );

        setMsg(
          "Service deleted."
        );

        loadServices();
      } catch {
        setMsgType(
          "error"
        );

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
     Edit
  ====================== */
  const handleEdit = (
    item
  ) => {
    setEditId(
      item._id
    );

    setForm({
      name:
        item.name ||
        "",
      price:
        item.price ||
        "",
      time:
        item.time ||
        "",
      description:
        item.description ||
        "",
      category:
        item.category ||
        "",
    });

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  };

  /* ======================
     Search
  ====================== */
  const filtered =
    useMemo(() => {
      if (!search)
        return services;

      return services.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.category
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      services,
      search,
    ]);

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Header */}
        <div className="topbar">
          <div>
            <h1>
              Manage
              Services
            </h1>

            <p>
              Add, edit
              or delete
              salon
              services
            </p>
          </div>

          <div className="top-actions">
            <input
              type="text"
              className="search-box"
              placeholder="Search services..."
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
                loadServices
              }
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                {editId
                  ? "Edit Service"
                  : "Create Service"}
              </h2>

              <p>
                Premium
                service
                management
              </p>
            </div>
          </div>

          <div className="table-wrap luxury-form-wrap">
            {msg && (
              <div
                className={`admin-msg ${
                  msgType ===
                  "error"
                    ? "error"
                    : "success"
                }`}
              >
                {msg}
              </div>
            )}

            <form
              className="service-form premium-form"
              onSubmit={
                handleSubmit
              }
            >
              <div className="input-group">
                <label>
                  Service
                  Name
                </label>

                <input
                  type="text"
                  required
                  placeholder="Bridal Makeup"
                  value={
                    form.name
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      name:
                        e
                          .target
                          .value,
                    })
                  }
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>
                    Price
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="₹1999"
                    value={
                      form.price
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        price:
                          e
                            .target
                            .value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="60 min"
                    value={
                      form.time
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        time:
                          e
                            .target
                            .value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="input-group">
                <label>
                  Category
                </label>

                <select
                  value={
                    form.category
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      category:
                        e
                          .target
                          .value,
                    })
                  }
                >
                  <option value="">
                    Select
                    Category
                  </option>

                  <option>
                    Bridal
                  </option>

                  <option>
                    Hair
                  </option>

                  <option>
                    Facial
                  </option>

                  <option>
                    Nails
                  </option>

                  <option>
                    Makeup
                  </option>

                  <option>
                    Spa
                  </option>
                </select>
              </div>

              <div className="input-group">
                <label>
                  Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Write service details..."
                  value={
                    form.description
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      description:
                        e
                          .target
                          .value,
                    })
                  }
                />
              </div>

              <div className="action-row">
                <button
                  className="book-btn premium-submit"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Service"
                    : "Add Service"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="feature-btn"
                    onClick={
                      resetForm
                    }
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                All
                Services
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
                services.length
              }{" "}
              Total
            </span>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>
                <p>
                  Loading
                  services...
                </p>
              </div>
            ) : filtered.length ===
              0 ? (
              <div className="empty-box">
                <p>
                  No
                  services
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
                      Price
                    </th>
                    <th>
                      Time
                    </th>
                    <th>
                      Category
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
                            item.price
                          }
                        </td>

                        <td>
                          {
                            item.time
                          }
                        </td>

                        <td>
                          {item.category ||
                            "-"}
                        </td>

                        <td>
                          <div className="action-row">
                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              disabled={
                                deletingId ===
                                item._id
                              }
                              onClick={() =>
                                handleDelete(
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

export default ManageServices;