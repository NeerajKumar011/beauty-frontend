import API_BASE_URL from "../utils/api";
import { useState, useEffect } from "react";

function Booking({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch services
  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit (UPDATED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // 🚨 Basic validation
    if (!form.name || !form.service || !form.date || !form.time) {
      alert("Please fill all fields ❌");
      return;
    }

    if (!user) {
      alert("Please login first ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
name: form.name.trim(),
userId: user._id, // ✅ connect booking to user
        }),
      });

      const data = await res.json();

      alert("Booking Confirmed ✅");

      // ✅ Reset form
      setForm({
        name: "",
        service: "",
        date: "",
        time: "",
      });

      onClose(); // close modal after booking

    } catch (error) {
      alert("Booking failed. Please try again ❌");
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
        }}
      >
        <button onClick={onClose}>❌</button>

        <h2>Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
          >
            <option value="">Select Service</option>
            {services.map((s, index) => (
              <option key={index} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;