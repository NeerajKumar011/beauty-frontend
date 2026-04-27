import {
  useEffect,
  useState,
} from "react";

import API_BASE_URL
  from "../utils/api";

import "../styles/Gallery.css";

function Gallery() {
  const [photos, setPhotos] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [selected, setSelected] =
    useState(null);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/gallery`
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setPhotos(data))
      .catch(console.log);
  }, []);

  const categories = [
    "All",
    ...new Set(
      photos.map(
        (p) =>
          p.category
      )
    ),
  ];

  const filtered =
    filter === "All"
      ? photos
      : photos.filter(
          (p) =>
            p.category ===
            filter
        );

  return (
    <div className="gallery-page">

      <div className="gallery-hero">
        <h1>
          Beauty Gallery ✨
        </h1>

        <p>
          Real results,
          beautiful moments,
          happy clients.
        </p>
      </div>

      <div className="gallery-filters">
        {categories.map(
          (cat) => (
            <button
              key={cat}
              className={
                filter === cat
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(cat)
              }
            >
              {cat}
            </button>
          )
        )}
      </div>

      <div className="gallery-grid">
        {filtered.map(
          (item) => (
            <div
              key={item._id}
              className="gallery-card"
              onClick={() =>
                setSelected(item)
              }
            >
              <img
                src={
                  item.imageUrl
                }
                alt={
                  item.title
                }
              />

              <div className="overlay">
                <h4>
                  {item.title}
                </h4>

                <span>
                  {
                    item.category
                  }
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {selected && (
        <div
          className="lightbox"
          onClick={() =>
            setSelected(
              null
            )
          }
        >
          <div className="lightbox-box">
            <img
              src={
                selected.imageUrl
              }
              alt=""
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