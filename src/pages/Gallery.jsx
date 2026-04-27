import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API_BASE_URL from "../utils/api";
import "../styles/Gallery.css";

function Gallery() {
  const [photos, setPhotos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [selected, setSelected] =
    useState(null);

  useEffect(() => {
    loadGallery();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* ======================
     Fetch Gallery
  ====================== */
  const loadGallery =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/gallery`
          );

        if (!res.ok) {
          throw new Error(
            "Failed"
          );
        }

        const data =
          await res.json();

        setPhotos(
          Array.isArray(data)
            ? data
            : []
        );

        setError("");
      } catch {
        setError(
          "Unable to load gallery right now."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Categories
  ====================== */
  const categories =
    useMemo(() => {
      return [
        "All",
        ...new Set(
          photos
            .map(
              (item) =>
                item.category
            )
            .filter(
              Boolean
            )
        ),
      ];
    }, [photos]);

  /* ======================
     Filtered
  ====================== */
  const filteredPhotos =
    useMemo(() => {
      if (
        filter === "All"
      ) {
        return photos;
      }

      return photos.filter(
        (item) =>
          item.category ===
          filter
      );
    }, [photos, filter]);

  /* ======================
     Close Lightbox ESC
  ====================== */
  useEffect(() => {
    const closeEsc = (
      e
    ) => {
      if (
        e.key ===
        "Escape"
      ) {
        setSelected(
          null
        );
      }
    };

    window.addEventListener(
      "keydown",
      closeEsc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        closeEsc
      );
  }, []);

  /* ======================
     Loading
  ====================== */
  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-loading">
          <div className="loading-spinner"></div>
          <p>
            Loading
            beautiful
            moments...
          </p>
        </div>
      </div>
    );
  }

  /* ======================
     Error
  ====================== */
  if (error) {
    return (
      <div className="gallery-page">
        <div className="gallery-error">
          <span>
            😔
          </span>

          <h3>{error}</h3>

          <button
            onClick={
              loadGallery
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Hero */}
      <section className="gallery-hero">
        <span className="gallery-badge">
          Luxury Results
        </span>

        <h1>
          Beauty Gallery
          ✨
        </h1>

        <p>
          Real clients,
          real glow,
          beautiful
          transformations.
        </p>
      </section>

      {/* Filters */}
      <section className="gallery-filters">
        {categories.map(
          (cat) => (
            <button
              key={cat}
              className={
                filter ===
                cat
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(
                  cat
                )
              }
            >
              {cat}
            </button>
          )
        )}
      </section>

      {/* Stats */}
      <section className="gallery-topbar">
        <p>
          Showing{" "}
          {
            filteredPhotos.length
          }{" "}
          Photos
        </p>
      </section>

      {/* Grid */}
      <section className="gallery-grid">
        {filteredPhotos.length ===
        0 ? (
          <div className="gallery-empty">
            <span>
              📷
            </span>
            <h3>
              No photos
              found
            </h3>
            <p>
              Try another
              category
            </p>
          </div>
        ) : (
          filteredPhotos.map(
            (item) => (
              <div
                key={
                  item._id
                }
                className="gallery-card"
                onClick={() =>
                  setSelected(
                    item
                  )
                }
              >
                <img
                  src={
                    item.imageUrl
                  }
                  alt={
                    item.title
                  }
                  loading="lazy"
                />

                <div className="overlay">
                  <h4>
                    {
                      item.title
                    }
                  </h4>

                  <span>
                    {
                      item.category
                    }
                  </span>
                </div>
              </div>
            )
          )
        )}
      </section>

      {/* CTA */}
      <section className="gallery-cta">
        <h2>
          Want Your Own
          Glow-Up?
        </h2>

        <p>
          Book your
          appointment and
          become our next
          success story.
        </p>

        <button
          onClick={() =>
            window.dispatchEvent(
              new Event(
                "openBookingModal"
              )
            )
          }
        >
          Book Now
        </button>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="lightbox"
          onClick={() =>
            setSelected(
              null
            )
          }
        >
          <div
            className="lightbox-box"
            onClick={(
              e
            ) =>
              e.stopPropagation()
            }
          >
            <button
              className="close-lightbox"
              onClick={() =>
                setSelected(
                  null
                )
              }
            >
              ✕
            </button>

            <img
              src={
                selected.imageUrl
              }
              alt={
                selected.title
              }
            />

            <div className="lightbox-info">
              <h3>
                {
                  selected.title
                }
              </h3>

              <p>
                {
                  selected.category
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;