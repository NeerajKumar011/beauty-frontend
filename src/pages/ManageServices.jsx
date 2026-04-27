import API_BASE_URL from "../utils/api";
import {
  useEffect,
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
    });

  const [editId, setEditId] =
    useState(null);

  const token =
  localStorage.getItem("token") || "";

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices =
    async () => {
      try {
        const res =
          await fetch(
  `${API_BASE_URL}/services`
)

        const data =
          await res.json();

        setServices(
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

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const url = editId
  ? `${API_BASE_URL}/services/${editId}`
  : `${API_BASE_URL}/services`;

      const method =
        editId
          ? "PUT"
          : "POST";

      try {
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  ...form,
  name: form.name.trim(),
  price: form.price.trim(),
  time: form.time.trim(),
  description:
    form.description.trim(),
}),
        });

        setForm({
          name: "",
          price: "",
          time: "",
          description:
            "",
        });

        setEditId(null);

        loadServices();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id) => {
      if (
        !window.confirm(
          "Delete service?"
        )
      )
        return;

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

      loadServices();
    };

  const handleEdit =
    (item) => {
      setEditId(
        item._id
      );

      setForm({
        name:
          item.name,
        price:
          item.price,
        time:
          item.time,
        description:
          item.description ||
          "",
      });
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
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
        </div>

        {/* Form */}
        <div className="table-wrap">
          <form
            className="service-form"
            onSubmit={
              handleSubmit
            }
          >
            <input
              type="text"
              placeholder="Service Name"
              required
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

            <input
              type="text"
              placeholder="Price"
              required
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

            <input
              type="text"
              placeholder="Duration"
              required
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

            <textarea
              rows="4"
              placeholder="Description"
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

            <button className="book-btn">
              {editId
                ? "Update Service"
                : "Add Service"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="booking-area">
          <h2>
            All Services
          </h2>

          <div className="table-wrap">
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
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map(
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
                          item.price
                        }
                      </td>

                      <td>
                        {
                          item.time
                        }
                      </td>

                      <td>
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
                          onClick={() =>
                            handleDelete(
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageServices;