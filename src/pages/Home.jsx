import API_BASE_URL from "../utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [services, setServices] =
    useState([]);
  const [reviews, setReviews] =
    useState([]);
  const [stats, setStats] =
    useState(null);

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

  const [showReview, setShowReview] =
    useState(false);

  const [msg, setMsg] =
    useState("");

  const [reviewForm, setReviewForm] =
    useState({
      name: "",
      rating: 5,
      message: "",
    });

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

  useEffect(() => {
    loadServices();
    loadReviews();
    loadStats();
    loadConfig();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/services`
      );
      const data =
        await res.json();

      setServices(
        Array.isArray(data)
          ? data
          : []
      );
    } catch {}
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/reviews`
      );
      const data =
        await res.json();

      setReviews(
        Array.isArray(data)
          ? data
          : []
      );
    } catch {}
  };

  const loadStats = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public-stats`
      );
      const data =
        await res.json();

      setStats(data);
    } catch {}
  };

  const loadConfig = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public-config`
      );

      if (!res.ok) return;

      const data =
        await res.json();

      setConfig(data);
    } catch {}
  };

  const handleReview = async (
    e
  ) => {
    e.preventDefault();

    const res = await fetch(
      `${API_BASE_URL}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          ...reviewForm,
          name: reviewForm.name.trim(),
        }),
      }
    );

    if (res.ok) {
      setMsg(
        "Review submitted ❤️"
      );

      loadReviews();

      setTimeout(() => {
        setShowReview(false);
        setMsg("");
      }, 1800);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge">
            Premium Beauty Experience
          </span>

          <h1>
            Confidence Starts
            <br />
            With Self Care
          </h1>

          <p>
            Elegant salon
            services,
            expert styling,
            relaxing
            atmosphere &
            beautiful results.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() =>
                openBooking()
              }
            >
              Book Appointment
            </button>

            <Link
              to="/services"
              className="btn-outline"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <h3>
              Today's Popular
            </h3>
            <p>
              Bridal Makeup 💄
            </p>
            <span>
              Loved by our
              clients
            </span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-box">
          <h2>
            {stats?.avgRating ||
              "5.0"}
            ★
          </h2>
          <p>
            Rated by Clients
          </p>
        </div>

        <div className="stat-box">
          <h2>
            {stats?.happyCustomers ||
              0}
            +
          </h2>
          <p>
            Happy Customers
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

      <section
        id="contact"
        className="contact-section"
      >
        <div className="section-title">
          <span>
            Contact
          </span>
          <h2>
            Visit Our Parlour
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
    </div>
  );
}

export default Home;