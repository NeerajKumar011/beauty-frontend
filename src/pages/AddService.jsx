import API_BASE_URL from "../utils/api";
import {
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function AddService() {
  const [form, setForm] =
    useState({
      name: "",
      price: "",
      time: "",
      description: "",
    });

  const [msg, setMsg] =
    useState("");

  const token =
  localStorage.getItem("token") || "";

  const handleChange =
    (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await fetch(`${API_BASE_URL}/services`,
            {
              method:
                "POST",
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
            }
          );

        const data =await res.json().catch(() => ({}));

        if (res.ok) {
          setMsg(
            "Service added successfully 💄"
          );

          setForm({
            name: "",
            price: "",
            time: "",
            description:
              "",
          });
        } else {
          setMsg(
            data.message ||
              "Failed to add service"
          );
        }
      } catch (error) {
        console.log(error);
        setMsg(
          "Server error"
        );
      }
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Top */}
        <div className="topbar">
          <div>
            <h1>
              Add Service
            </h1>

            <p>
              Create new
              salon service
              offerings
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="booking-area">
          <h2>
            New Service
          </h2>

          <div className="table-wrap">
            <form
              className="service-form"
              onSubmit={
                handleSubmit
              }
            >
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="price"
                placeholder="Price"
                value={
                  form.price
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="time"
                placeholder="Duration (30 min)"
                value={
                  form.time
                }
                onChange={
                  handleChange
                }
                required
              />

              <textarea
                rows="5"
                name="description"
                placeholder="Service Description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
              />

              <button className="book-btn">
                Add Service
              </button>
            </form>

            {msg && (
              <p
                style={{
                  marginTop:
                    "15px",
                  color:
                    "#e91e63",
                  fontWeight:
                    "600",
                }}
              >
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddService;