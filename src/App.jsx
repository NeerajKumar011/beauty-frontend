import API_BASE_URL from "./utils/api";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import BookingCalendar from "./pages/BookingCalendar";
import AdminDashboard from "./pages/AdminDashboard";
import AddService from "./pages/AddService";
import ManageServices from "./pages/ManageServices";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
import ManageReviews from "./pages/ManageReviews";
import Analytics from "./pages/Analytics";
import AvailabilitySettings from "./pages/AvailabilitySettings";
import Services from "./components/Services";
import Gallery from "./pages/Gallery";
import ManageGallery
from "./pages/ManageGallery";

function AppContent() {
  const [showBooking, setShowBooking] = useState(false);
  const [services, setServices] = useState([]);
  const [msg, setMsg] = useState("");
  const [availability, setAvailability] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [form, setForm] = useState({ name: "", service: "", date: "", time: "" });

  const storedUser =
  localStorage.getItem("user");

const user = storedUser
  ? JSON.parse(storedUser)
  : null;
  const token =
  localStorage.getItem("token") || "";
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(console.log);

    fetch(`${API_BASE_URL}/availability`)
      .then((res) => res.json())
      .then((data) => setAvailability(data))
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (availability) {
      const result = [];
      const [sh, sm] = availability.openTime.split(':').map(Number);
      const [eh, em] = availability.closeTime.split(':').map(Number);
      let current = sh * 60 + sm;
      const end = eh * 60 + em;
      const step = Number(availability.slotMinutes || 30);
      while (current < end) {
        result.push(`${String(Math.floor(current/60)).padStart(2,'0')}:${String(current%60).padStart(2,'0')}`);
        current += step;
      }
      setSlots(result);
    }
  }, [availability]);

  useEffect(() => {
    const openBooking = () => {
      const selectedService = localStorage.getItem("selectedService");
      if (selectedService) {
        setForm((prev) => ({ ...prev, service: selectedService }));
      }
      setShowBooking(true);
    };

    window.addEventListener("openBookingModal", openBooking);
    return () => window.removeEventListener("openBookingModal", openBooking);
  }, []);

  const loadBookedSlots = async (date) => {
    if (!date || !token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/date/${date}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBookedSlots(Array.isArray(data) ? data.map((b) => b.time) : []);
    } catch {
      setBookedSlots([]);
    }
  };

  const isClosedDate = (selectedDate) => {
    if (!availability || !selectedDate) return false;
    const dayName = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    if (availability.closedDays?.includes(dayName)) return "Salon closed on this day";
    if (availability.closedDates?.includes(selectedDate)) return "Salon closed on selected date";
    return false;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first");

    const closed = isClosedDate(form.date);
    if (closed) {
      setBookingError(closed);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  ...form,
  name: form.name.trim(),
}),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Booking Confirmed 💄");
        localStorage.removeItem("selectedService");
        setTimeout(() => {
          setShowBooking(false);
          setMsg("");
          setBookingError("");
          setForm({ name: "", service: "", date: "", time: "" });
        }, 1800);
      } else {
        setMsg(data.message || "Booking failed");
      }
    } catch {
      setMsg("Server error");
    }
  };

  const AdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") return <Navigate to="/login" />;
    return children;
  };

  const today = new Date().toISOString().split("T")[0];

  const getAvailableSlots = () => {
    return slots.filter((slot) => {
      if (bookedSlots.includes(slot)) return false;
      if (form.date === today) {
        const now = new Date();
        const minsNow = now.getHours() * 60 + now.getMinutes();
        const [h, m] = slot.split(":").map(Number);
        const slotMins = h * 60 + m;
        if (slotMins <= minsNow) return false;
      }
      return true;
    });
  };

  const availableSlots = getAvailableSlots();

  const adminPaths = ["/dashboard","/add-service","/manage-services","/manage-users","/manage-bookings","/manage-reviews","/analytics","/booking-calendar","/availability-settings"];
  const hideNavbar = adminPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />}
        
     />
      <Route
          path="/manage-gallery"
          element={
            <AdminRoute>
              <ManageGallery />
            </AdminRoute>
          }
        />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/add-service" element={<AdminRoute><AddService /></AdminRoute>} />
        <Route path="/manage-services" element={<AdminRoute><ManageServices /></AdminRoute>} />
        <Route path="/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/manage-bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
        <Route path="/manage-reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
        <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/booking-calendar" element={<AdminRoute><BookingCalendar /></AdminRoute>} />
        <Route path="/availability-settings" element={<AdminRoute><AvailabilitySettings /></AdminRoute>} />

        <Route path="*" element={<Home />} />
      </Routes>

      {showBooking && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <button className="close-btn" onClick={() => setShowBooking(false)}>✖</button>
            <h2>Book Appointment</h2>

            {availability && (
              <p style={{ marginBottom: 10, color: '#666' }}>
                Booking Hours: {availability?.openTime} - {availability?.closeTime}</p>
            )}

            <form onSubmit={handleBooking}>
              <input type="text" required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

              <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                <option value="">Select Service</option>
                {services.map((service, index) => (
                  <option key={index} value={service.name}>{service.name}</option>
                ))}
              </select>

              <input type="date" required value={form.date} onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, date: value });
                const closed = isClosedDate(value);
                setBookingError(closed || "");
                loadBookedSlots(value);
              }} />

              {bookingError && <p style={{ color: 'red', marginBottom: 10 }}>{bookingError}</p>}

              <select required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="">Select Time</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>

              {form.date && availableSlots.length === 0 && (
                <p style={{ color: 'red', marginBottom: 10 }}>
                  No slots available for this date
                </p>
              )}

              <button className="btn-primary">Confirm Booking</button>
            </form>

            {msg && <p style={{ marginTop: 15 }}>{msg}</p>}
          </div>
        </div>
      )}
        </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
