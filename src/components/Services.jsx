import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import "../styles/Services.css";

function Services() {
  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const categories = [
    {
      id: "all",
      name: "All Services",
      icon: "✨",
    },
    {
      id: "hair",
      name: "Hair",
      icon: "✂️",
    },
    {
      id: "facial",
      name: "Facials",
      icon: "🧖‍♀️",
    },
    {
      id: "makeup",
      name: "Makeup",
      icon: "💄",
    },
    {
      id: "nail",
      name: "Nails",
      icon: "💅",
    },
    {
      id: "spa",
      name: "Spa",
      icon: "🕯️",
    },
  ];

  useEffect(() => {
    fetchServices();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchServices =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/services`
          );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch"
          );
        }

        const data =
          await res.json();

        setServices(
          Array.isArray(data)
            ? data
            : []
        );

        setError("");
      } catch {
        setError(
          "Unable to load services right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  const openBooking = (
    service = ""
  ) => {
    localStorage.setItem(
      "selectedService",
      service
    );

    window.dispatchEvent(
      new Event(
        "openBookingModal"
      )
    );
  };

  const getCategory = (
    name = ""
  ) => {
    const n =
      name.toLowerCase();

    if (
      n.includes("hair")
    )
      return "hair";

    if (
      n.includes(
        "facial"
      )
    )
      return "facial";

    if (
      n.includes(
        "makeup"
      ) ||
      n.includes(
        "bridal"
      )
    )
      return "makeup";

    if (
      n.includes("nail")
    )
      return "nail";

    if (
      n.includes("spa")
    )
      return "spa";

    return "other";
  };

  const getIcon = (
    name = ""
  ) => {
    const n =
      name.toLowerCase();

    if (
      n.includes("hair")
    )
      return "✂️";

    if (
      n.includes(
        "facial"
      )
    )
      return "✨";

    if (
      n.includes(
        "makeup"
      )
    )
      return "💄";

    if (
      n.includes("nail")
    )
      return "💅";

    if (
      n.includes("spa")
    )
      return "🧖‍♀️";

    if (
      n.includes(
        "bridal"
      )
    )
      return "👰";

    return "💇‍♀️";
  };

  const filteredServices =
    useMemo(() => {
      if (
        selectedCategory ===
        "all"
      ) {
        return services;
      }

      return services.filter(
        (item) =>
          getCategory(
            item.name
          ) ===
          selectedCategory
      );
    }, [
      services,
      selectedCategory,
    ]);

  if (loading) {
    return (
      <div className="services-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>
            Loading premium
            services...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <div className="error-container">
          <span className="error-icon">
            😔
          </span>

          <h3>{error}</h3>

          <button
            className="retry-btn"
            onClick={
              fetchServices
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* Hero */}
      <section className="services-hero">
        <div className="hero-content">
          <span className="badge">
            Luxury Beauty
            Care
          </span>

          <h1>
            Premium
            Services For
            Your Glow
          </h1>

          <p>
            Discover our
            professional
            treatments
            designed to
            elevate your
            confidence and
            beauty.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="categories-container">
        <div className="categories-wrapper">
          {categories.map(
            (cat) => (
              <button
                key={
                  cat.id
                }
                className={`category-btn ${
                  selectedCategory ===
                  cat.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    cat.id
                  )
                }
              >
                <span className="category-icon">
                  {
                    cat.icon
                  }
                </span>

                <span>
                  {
                    cat.name
                  }
                </span>
              </button>
            )
          )}
        </div>
      </section>

      {/* Cards */}
      <section className="services-container">
        <div className="services-stats">
          <p>
            Showing{" "}
            {
              filteredServices.length
            }{" "}
            Services
          </p>
        </div>

        {filteredServices.length ===
        0 ? (
          <div className="no-services">
            <span>
              🔍
            </span>
            <h3>
              No services
              found
            </h3>
            <p>
              Try another
              category
            </p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item._id ||
                    index
                  }
                  className="service-card"
                >
                  <div className="card-badge">
                    Popular
                  </div>

                  <div className="service-icon">
                    {getIcon(
                      item.name
                    )}
                  </div>

                  <h3>
                    {
                      item.name
                    }
                  </h3>

                  <p className="service-desc">
                    {item.description ||
                      "Professional treatment for a luxurious beauty experience."}
                  </p>

                  <div className="service-meta">
                    <span className="duration">
                      ⏱{" "}
                      {
                        item.time
                      }
                    </span>
                  </div>

                  <div className="card-bottom">
                    <span className="price">
                      {
                        item.price
                      }
                    </span>

                    <button
                      className="book-now-btn"
                      onClick={() =>
                        openBooking(
                          item.name
                        )
                      }
                    >
                      Book
                      Now →
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Trust */}
      <section className="trust-section">
        <div className="trust-item">
          <span>
            💎
          </span>
          <h4>
            Premium
            Products
          </h4>
          <p>
            Luxury brands
            only
          </p>
        </div>

        <div className="trust-item">
          <span>
            👑
          </span>
          <h4>
            Expert Team
          </h4>
          <p>
            Skilled
            professionals
          </p>
        </div>

        <div className="trust-item">
          <span>
            ✨
          </span>
          <h4>
            Hygiene First
          </h4>
          <p>
            Sanitized
            tools always
          </p>
        </div>

        <div className="trust-item">
          <span>
            🎯
          </span>
          <h4>
            Satisfaction
          </h4>
          <p>
            Happy clients
            guaranteed
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bottom-cta">
        <div className="cta-content">
          <h2>
            Ready For
            Your
            Transformation?
          </h2>

          <p>
            Book today and
            experience the
            premium touch.
          </p>

          <button
            onClick={() =>
              openBooking()
            }
          >
            Book
            Appointment
          </button>
        </div>
      </section>
    </div>
  );
}

export default Services;