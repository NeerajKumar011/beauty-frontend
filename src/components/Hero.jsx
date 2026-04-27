import "../styles/Hero.css";

function Hero({ onBookClick }) {
  return (
    <section className="hero">
      <div
            className="overlay"
            aria-hidden="true"
          ></div>

      <div className="content">
        <span className="badge">Premium Beauty Salon</span>

        <h1>
          Discover Your <br />
          <span>True Beauty</span>
        </h1>

        <p>
          Experience world-class beauty treatments in a luxurious and relaxing
          environment.
        </p>

        <div className="buttons">
         <button
              type="button"
              className="btn-primary"
              onClick={onBookClick}
            >
            Book Appointment
          </button>

          <button
            type="button"
            className="btn-outline"
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;