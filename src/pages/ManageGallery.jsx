import "../styles/ManageGallery.css";
import {
  useEffect,
  useState,
} from "react";

import API_BASE_URL
  from "../utils/api";

function ManageGallery() {
  const token =
    localStorage.getItem(
      "token"
    ) || "";

  const [photos, setPhotos] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [preview, setPreview] =
  useState("");

  const [msg, setMsg] =
    useState("");

  const loadPhotos = () => {
    fetch(
      `${API_BASE_URL}/gallery`
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setPhotos(data)
      );
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload =
    async (e) => {
      e.preventDefault();

      const formData =
        new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "image",
        image
      );

      const res =
        await fetch(
          `${API_BASE_URL}/gallery`,
          {
            method:
              "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await res.json();

      setMsg(
        data.message
      );

      setTitle("");
      setCategory(
        "General"
      );
      setImage(null);
      setPreview("");

      loadPhotos();
    };

  const deletePhoto =
    async (id) => {
      if (
        !window.confirm(
          "Delete photo?"
        )
      )
        return;

      await fetch(
        `${API_BASE_URL}/gallery/${id}`,
        {
          method:
            "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      loadPhotos();
    };

 return (
  <div className="manage-gallery-page">

    <div className="manage-gallery-top">
      <h1>
        Manage Gallery
      </h1>

      <p>
        Upload and manage
        salon photos
      </p>
    </div>

    <div className="upload-box">
      <form
        onSubmit={handleUpload}
        className="upload-form"
      >
        <input
          required
          placeholder="Photo title"
          value={title}
          onChange={(e)=>
            setTitle(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e)=>
            setCategory(
              e.target.value
            )
          }
        >
          <option>Bridal</option>
          <option>Hair</option>
          <option>Nails</option>
          <option>Makeup</option>
          <option>Facial</option>
          <option>General</option>
        </select>

        <input
  required
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(
        file
      )
    );
  }}
/>
{preview && (
  <img
    src={preview}
    alt="Preview"
    className="preview-img"
  />
)}

        <button className="upload-btn">
          Upload Photo
        </button>

        {msg && (
          <p className="upload-msg">
            {msg}
          </p>
        )}
      </form>
    </div>

    <div className="gallery-admin-grid">
      {photos.map((item)=>(
        <div
          key={item._id}
          className="admin-photo-card"
        >
          <img
            src={item.imageUrl}
            alt=""
          />

          <div className="admin-photo-info">
            <h4>
              {item.title}
            </h4>

            <span>
              {item.category}
            </span>

            <button
              className="delete-btn"
              onClick={()=>
                deletePhoto(
                  item._id
                )
              }
            >
              Delete Photo
            </button>
          </div>
        </div>
      ))}
    </div>

  </div>
);
}

export default
  ManageGallery;