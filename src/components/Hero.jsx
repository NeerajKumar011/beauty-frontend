import "../styles/Hero.css";

function Hero({
  onBookClick,
}) {
  const goServices =
    () => {
      const el =
        document.getElementById(
          "services"
        );

      if (el) {
        el.scrollIntoView(
          {
            behavior:
              "smooth",
            block:
              "start",
          }
        );
      } else {
        window.location.href =
          "/services";
      }
    };

  return (
    <section className="hero">
      {/* Background Overlay */}
      <div
        className="overlay"
        aria-hidden="true"
      ></div>

      {/* Floating Glow */}
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>

      {/* Main Content */}
      <div className="content">
        <span className="badge">
          Premium Beauty Salon
        </span>

        <h1>
          Discover Your
          <br />

          <span>
            True Beauty
          </span>
        </h1>

        <p>
          Experience
          world-class
          beauty
          treatments in
          a luxurious,
          relaxing and
          modern salon
          atmosphere.
        </p>

        <div className="buttons">
          <button
            type="button"
            className="btn-primary"
            onClick={
              onBookClick
            }
          >
            Book
            Appointment
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={
              goServices
            }
          >
            Explore
            Services
          </button>
        </div>

        {/* Trust Row */}
        <div className="hero-stats">
          <div className="stat-box">
            <strong>
              5★
            </strong>
            <span>
              Reviews
            </span>
          </div>

          <div className="stat-box">
            <strong>
              1000+
            </strong>
            <span>
              Clients
            </span>
          </div>

          <div className="stat-box">
            <strong>
              10+
            </strong>
            <span>
              Services
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;