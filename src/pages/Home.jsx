import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [services, setServices] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [showReview, setShowReview] =
    useState(false);

  const [msg, setMsg] =
    useState("");

  const [config, setConfig] =
    useState({
      phone:
        "+919199364185",
      email:
        "nehabeautyparlourofficial@gmail.com",
      address:
        "Suryapura Rohtas Bihar",
      whatsapp:
        "919199364185",
    });

  const [reviewForm, setReviewForm] =
    useState({
      name: "",
      rating: 5,
      message: "",
    });

  /* ======================
     Open Booking
  ====================== */
  const openBooking = (
    service = ""
  ) => {
    if (service) {
      localStorage.setItem(
        "selectedService",
        service
      );
    }

    window.dispatchEvent(
      new Event(
        "openBookingModal"
      )
    );
  };

  /* ======================
     Load Data
  ====================== */
  useEffect(() => {
    loadServices();
    loadReviews();
    loadStats();
    loadConfig();

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }, []);

  const loadServices =
    async () => {
      try {
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
      } catch {}
    };

  const loadReviews =
    async () => {
      try {
        const res =
          await fetch(
            `${API_BASE_URL}/reviews`
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
      } catch {}
    };

  const loadStats =
    async () => {
      try {
        const res =
          await fetch(
            `${API_BASE_URL}/public-stats`
          );

        const data =
          await res.json();

        setStats(data);
      } catch {}
    };

  const loadConfig =
    async () => {
      try {
        const res =
          await fetch(
            `${API_BASE_URL}/public-config`
          );

        if (!res.ok)
          return;

        const data =
          await res.json();

        setConfig(data);
      } catch {}
    };

  /* ======================
     Submit Review
  ====================== */
  const handleReview =
    async (e) => {
      e.preventDefault();

      const res =
        await fetch(
          `${API_BASE_URL}/reviews`,
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...reviewForm,
              name:
                reviewForm.name.trim(),
            }),
          }
        );

      if (res.ok) {
        setMsg(
          "Review submitted ❤️"
        );

        setReviewForm({
          name: "",
          rating: 5,
          message:
            "",
        });

        loadReviews();

        setTimeout(() => {
          setShowReview(
            false
          );
          setMsg("");
        }, 1800);
      }
    };

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero modern-hero">
        <div className="hero-left">
          <span className="hero-badge">
            Premium Beauty
            Experience
          </span>

          <h1>
            Confidence
            Starts
            <br />
            With Self
            Care
          </h1>

          <p>
            Elegant salon
            services,
            expert styling,
            relaxing
            atmosphere &
            beautiful
            results.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() =>
                openBooking()
              }
            >
              Book
              Appointment
            </button>

            <Link
              to="/services"
              className="btn-outline"
            >
              View
              Services
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <h3>
              Today's
              Popular
            </h3>

            <p>
              Bridal
              Makeup 💄
            </p>

            <span>
              Loved by
              our clients
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="services-section"
      >
        <div className="section-title">
          <span>
            Featured
            Services
          </span>

          <h2>
            Beauty
            Services You
            Deserve
          </h2>
        </div>

        <div className="services-grid">
          {services
            .slice(0, 4)
            .map(
              (
                item,
                i
              ) => (
                <div
                  key={
                    i
                  }
                  className="service-card"
                >
                  <h3>
                    {
                      item.name
                    }
                  </h3>

                  <p>
                    Duration:{" "}
                    {
                      item.time
                    }
                  </p>

                  <div className="service-footer">
                    <span>
                      {
                        item.price
                      }
                    </span>

                    <button
                      onClick={() =>
                        openBooking(
                          item.name
                        )
                      }
                    >
                      Book →
                    </button>
                  </div>
                </div>
              )
            )}
        </div>

        <div className="center-btn">
          <Link
            to="/services"
            className="btn-primary"
          >
            View All
            Services
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>
            {stats?.avgRating ||
              "5.0"}
            ★
          </h2>

          <p>
            Rated by
            Clients
          </p>
        </div>

        <div className="stat-box">
          <h2>
            {stats?.happyCustomers ||
              0}
            +
          </h2>

          <p>
            Happy
            Customers
          </p>
        </div>

        <div className="stat-box">
          <h2>
            {stats?.satisfaction ||
              100}
            %
          </h2>

          <p>
            Satisfaction
          </p>
        </div>

        <div className="stat-box">
          <h2>
            {stats?.openDays ||
              7}{" "}
            Days
          </h2>

          <p>
            Open Weekly
          </p>
        </div>
      </section>

      {/* REVIEWS */}
      <section
        id="reviews"
        className="reviews-section"
      >
        <div className="section-title">
          <span>
            Testimonials
          </span>

          <h2>
            What Our
            Clients Say
          </h2>
        </div>

        <div className="review-grid">
          {reviews
            .slice(0, 3)
            .map(
              (
                r,
                i
              ) => (
                <div
                  key={
                    i
                  }
                  className="review-card"
                >
                  <p>
                    "
                    {
                      r.message
                    }
                    "
                  </p>

                  <strong>
                    {
                      r.name
                    }
                  </strong>

                  <div className="stars">
                    {"⭐".repeat(
                      r.rating
                    )}
                  </div>
                </div>
              )
            )}
        </div>

        <div className="center-btn">
          <button
            className="btn-primary"
            onClick={() =>
              setShowReview(
                true
              )
            }
          >
            Write
            Review
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>
          Ready For
          Your Glow Up?
        </h2>

        <p>
          Book your next
          appointment
          today.
        </p>

        <button
          className="btn-primary"
          onClick={() =>
            openBooking()
          }
        >
          Book Now
        </button>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="contact-section"
      >
        <div className="section-title">
          <span>
            Contact
          </span>

          <h2>
            Visit Our
            Parlour
          </h2>
        </div>

        <div className="contact-box">
          <p>
            📍{" "}
            {
              config.address
            }
          </p>

          <p>
            📞{" "}
            {
              config.phone
            }
          </p>

          <p>
            ✉️{" "}
            {
              config.email
            }
          </p>

          <a
            href={`https://wa.me/${config.whatsapp}`}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Us
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2026 Neha
        Beauty Parlour.
        All rights
        reserved.
      </footer>

      {/* REVIEW MODAL */}
      {showReview && (
        <div className="modal-overlay">
          <div className="booking-modal">
            <button
              className="close-btn"
              onClick={() =>
                setShowReview(
                  false
                )
              }
            >
              ✖
            </button>

            <h2>
              Write
              Review
            </h2>

            <form
              onSubmit={
                handleReview
              }
            >
              <input
                required
                placeholder="Your Name"
                value={
                  reviewForm.name
                }
                onChange={(
                  e
                ) =>
                  setReviewForm(
                    {
                      ...reviewForm,
                      name:
                        e
                          .target
                          .value,
                    }
                  )
                }
              />

              <select
                value={
                  reviewForm.rating
                }
                onChange={(
                  e
                ) =>
                  setReviewForm(
                    {
                      ...reviewForm,
                      rating:
                        Number(
                          e
                            .target
                            .value
                        ),
                    }
                  )
                }
              >
                <option value="5">
                  5 Star
                </option>

                <option value="4">
                  4 Star
                </option>

                <option value="3">
                  3 Star
                </option>
              </select>

              <textarea
                rows="4"
                required
                placeholder="Write feedback..."
                value={
                  reviewForm.message
                }
                onChange={(
                  e
                ) =>
                  setReviewForm(
                    {
                      ...reviewForm,
                      message:
                        e
                          .target
                          .value,
                    }
                  )
                }
              />

              <button className="btn-primary">
                Submit
              </button>
            </form>

            {msg && (
              <p className="review-msg">
                {msg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;