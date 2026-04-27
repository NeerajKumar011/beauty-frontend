import API_BASE_URL from "../utils/api";
import { useEffect, useState } from "react";
import "../styles/services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Services", icon: "✨" },
    { id: "hair", name: "Hair", icon: "✂️" },
    { id: "facial", name: "Facials", icon: "🧖‍♀️" },
    { id: "makeup", name: "Makeup", icon: "💄" },
    { id: "nail", name: "Nails", icon: "💅" },
    { id: "spa", name: "Spa", icon: "🕯️" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
  `${API_BASE_URL}/services`
);
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(
  Array.isArray(data)
    ? data
    : []
);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (serviceName) => {
    localStorage.setItem(
  "selectedService",
  serviceName || ""
);
    window.dispatchEvent(new Event("openBookingModal"));
  };

  const getIcon = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("hair")) return "✂️";
    if (n.includes("facial")) return "✨";
    if (n.includes("makeup")) return "💄";
    if (n.includes("nail")) return "💅";
    if (n.includes("spa")) return "🧖‍♀️";
    if (n.includes("bridal")) return "👰";
    if (n.includes("threading")) return "🪡";
    if (n.includes("waxing")) return "🕯️";
    return "💇‍♀️";
  };

  const getCategory = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("hair")) return "hair";
    if (n.includes("facial")) return "facial";
    if (n.includes("makeup")) return "makeup";
    if (n.includes("nail")) return "nail";
    if (n.includes("spa")) return "spa";
    return "other";
  };

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => getCategory(s.name) === selectedCategory);

  if (loading) {
    return (
      <div className="services-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading our beautiful services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <div className="error-container">
          <span className="error-icon">😔</span>
          <h3>{error}</h3>
          <button onClick={fetchServices} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <div className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="badge">✨ Premium Beauty Care ✨</span>
          <h1>Indulge in Luxury</h1>
          <p>Discover our signature treatments designed to enhance your natural beauty</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="categories-container">
        <div className="categories-wrapper">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-container">
        {filteredServices.length === 0 ? (
          <div className="no-services">
            <span>🔍</span>
            <h3>No services found</h3>
            <p>Try a different category</p>
          </div>
        ) : (
          <>
            <div className="services-stats">
              <p>Showing {filteredServices.length} premium services</p>
            </div>
            <div className="services-grid">
              {filteredServices.map((service, index) => (
                <div className="service-card" key={service._id || index}>
                  <div className="card-badge">Popular</div>
                  <div className="service-icon">{getIcon(service.name)}</div>
                  <h3>{service.name}</h3>
                  <p className="service-desc">
                    {service.description || "Professional beauty treatment for ultimate relaxation"}
                  </p>
                  <div className="service-meta">
                    <span className="duration">⏱ {service.time}</span>
                  </div>
                  <div className="card-bottom">
                    <span className="price">{service.price}</span>
                    <button className="book-now-btn" onClick={() => openBooking(service.name)}>
                      Book Now <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trust Badges */}
      <div className="trust-section">
        <div className="trust-item">
          <span>💎</span>
          <h4>Premium Products</h4>
          <p>Luxury brands only</p>
        </div>
        <div className="trust-item">
          <span>👑</span>
          <h4>Expert Stylists</h4>
          <p>10+ years experience</p>
        </div>
        <div className="trust-item">
          <span>✨</span>
          <h4>Hygiene First</h4>
          <p>Sterilized equipment</p>
        </div>
        <div className="trust-item">
          <span>🎯</span>
          <h4>100% Satisfaction</h4>
          <p>Money-back guarantee</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bottom-cta">
        <div className="cta-content">
          <h2>Ready For Your Transformation?</h2>
          <p>Book your appointment today and experience the difference</p>
          <button onClick={() => window.dispatchEvent(new Event("openBookingModal"))}>
            Book Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;