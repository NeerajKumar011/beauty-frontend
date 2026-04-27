import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

function Booking({
  onClose,
}) {
  const [form, setForm] =
    useState({
      name: "",
      service: "",
      date: "",
      time: "",
    });

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] = useState("error");

  /* ======================
     On Load
  ====================== */
  useEffect(() => {
    loadServices();

    const storedUser =
      localStorage.getItem(
        "user"
      );

    const user =
      storedUser
        ? JSON.parse(
            storedUser
          )
        : null;

    const selectedService =
      localStorage.getItem(
        "selectedService"
      );

    setForm(
      (prev) => ({
        ...prev,
        name:
          user?.name ||
          "",
        service:
          selectedService ||
          "",
      })
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, []);

  /* ======================
     Fetch Services
  ====================== */
  const loadServices =
    async () => {
      try {
        setFetching(true);

        const res =
          await fetch(
            `${API_BASE_URL}/services`
          );

        const data =
          await res.json();

        setServices(
          Array.isArray(data)
            ? data
            : []
        );
      } catch {
        setServices([]);
      } finally {
        setFetching(false);
      }
    };

  /* ======================
     Today Min Date
  ====================== */
  const today =
    useMemo(() => {
      const d =
        new Date();

      return d
        .toISOString()
        .split("T")[0];
    }, []);

  /* ======================
     Input
  ====================== */
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

    setMessage("");
  };

  /* ======================
     Submit
  ====================== */
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const storedUser =
        localStorage.getItem(
          "user"
        );

      const user =
        storedUser
          ? JSON.parse(
              storedUser
            )
          : null;

      if (
        !form.name ||
        !form.service ||
        !form.date ||
        !form.time
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "Please fill all fields."
        );
        return;
      }

      if (!user) {
        setMessageType(
          "error"
        );

        setMessage(
          "Please login first."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/bookings`,
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  ...form,
                  name:
                    form.name.trim(),
                  userId:
                    user._id,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setMessageType(
            "error"
          );

          setMessage(
            data.message ||
              "Booking failed."
          );

          return;
        }

        setMessageType(
          "success"
        );

        setMessage(
          "Appointment booked successfully ✨"
        );

        localStorage.removeItem(
          "selectedService"
        );

        setTimeout(
          () => {
            onClose();
          },
          1400
        );
      } catch {
        setMessageType(
          "error"
        );

        setMessage(
          "Unable to connect."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Close On ESC
  ====================== */
  useEffect(() => {
    const esc = (
      e
    ) => {
      if (
        e.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      esc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        esc
      );
  }, [onClose]);

  return (
    <div
      className="booking-overlay"
      onClick={(
        e
      ) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="booking-modal">
        {/* Close */}
        <button
          className="booking-close"
          onClick={
            onClose
          }
        >
          ✕
        </button>

        {/* Header */}
        <div className="booking-top">
          <span className="booking-badge">
            Premium
            Appointment
          </span>

          <h2>
            Book Your
            Visit
          </h2>

          <p>
            Reserve your
            beauty slot
            in seconds.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`booking-msg ${
              messageType ===
              "success"
                ? "success"
                : "error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="booking-form"
        >
          {/* Name */}
          <div className="booking-field">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />
          </div>

          {/* Service */}
          <div className="booking-field">
            <label>
              Service
            </label>

            <select
              name="service"
              value={
                form.service
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                {fetching
                  ? "Loading services..."
                  : "Select service"}
              </option>

              {services.map(
                (
                  item,
                  index
                ) => (
                  <option
                    key={
                      item._id ||
                      index
                    }
                    value={
                      item.name
                    }
                  >
                    {
                      item.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* Date */}
          <div className="booking-grid">
            <div className="booking-field">
              <label>
                Date
              </label>

              <input
                type="date"
                name="date"
                min={
                  today
                }
                value={
                  form.date
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div className="booking-field">
              <label>
                Time
              </label>

              <input
                type="time"
                name="time"
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

          {/* Button */}
          <button
            type="submit"
            className="booking-submit"
            disabled={
              loading
            }
          >
            {loading ? (
              <>
                <span className="mini-spinner"></span>
                Booking...
              </>
            ) : (
              "Confirm Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;