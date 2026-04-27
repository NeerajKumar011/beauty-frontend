import API_BASE_URL from "../utils/api";
import {
  useEffect,
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
      category: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [msg, setMsg] =
    useState("");

  const [
    msgType,
    setMsgType,
  ] = useState("success");

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

  /* ======================
     Input Change
  ====================== */
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    if (msg)
      setMsg("");
  };

  /* ======================
     Submit
  ====================== */
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!token) {
        setMsgType(
          "error"
        );

        setMsg(
          "Admin login required."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/services`,
            {
              method:
                "POST",
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
            "Service added successfully ✨"
          );

          setForm({
            name: "",
            price: "",
            time: "",
            description:
              "",
            category:
              "",
          });
        } else {
          setMsgType(
            "error"
          );

          setMsg(
            data.message ||
              "Failed to add service."
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
        setLoading(false);
      }
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>
              Add
              Service
            </h1>

            <p>
              Create new
              salon
              services for
              your
              customers.
            </p>
          </div>

          <div className="admin-badge">
            Premium
            Dashboard
          </div>
        </div>

        {/* Form Area */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                New
                Service
              </h2>

              <p>
                Fill all
                details
                carefully.
              </p>
            </div>
          </div>

          <div className="table-wrap luxury-form-wrap">
            {/* Message */}
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
              {/* Name */}
              <div className="input-group">
                <label>
                  Service
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Bridal Makeup"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              {/* Price */}
              <div className="grid-2">
                <div className="input-group">
                  <label>
                    Price
                  </label>

                  <input
                    type="text"
                    name="price"
                    placeholder="₹1999"
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="time"
                    placeholder="60 min"
                    value={
                      form.time
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="input-group">
                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  required
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

              {/* Description */}
              <div className="input-group">
                <label>
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  placeholder="Describe this service..."
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              {/* Submit */}
              <button
                className="book-btn premium-submit"
                disabled={
                  loading
                }
              >
                {loading ? (
                  <>
                    <span className="mini-loader white"></span>
                    Adding...
                  </>
                ) : (
                  "Add Service"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddService;