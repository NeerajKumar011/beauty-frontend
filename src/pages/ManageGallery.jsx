import "../styles/ManageGallery.css";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import API_BASE_URL from "../utils/api";

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

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [msg, setMsg] =
    useState("");

  const [msgType, setMsgType] =
    useState("success");

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const categories = [
    "Bridal",
    "Hair",
    "Nails",
    "Makeup",
    "Facial",
    "General",
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    loadPhotos();
  }, []);

  /* ======================
     Load Photos
  ====================== */
  const loadPhotos =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/gallery`
          );

        const data =
          await res.json();

        setPhotos(
          Array.isArray(
            data
          )
            ? data
            : []
        );
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Unable to load gallery."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Upload
  ====================== */
  const handleUpload =
    async (e) => {
      e.preventDefault();

      if (!image) {
        setMsgType(
          "error"
        );

        setMsg(
          "Please choose image."
        );
        return;
      }

      try {
        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          title.trim()
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
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

        const data =
          await res
            .json()
            .catch(
              () => ({})
            );

        if (
          res.ok
        ) {
          setMsgType(
            "success"
          );

          setMsg(
            data.message ||
              "Photo uploaded successfully ✨"
          );

          setTitle("");
          setCategory(
            "General"
          );
          setImage(
            null
          );
          setPreview(
            ""
          );

          loadPhotos();
        } else {
          setMsgType(
            "error"
          );

          setMsg(
            data.message ||
              "Upload failed."
          );
        }
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Server error."
        );
      } finally {
        setUploading(false);
      }
    };

  /* ======================
     Delete
  ====================== */
  const deletePhoto =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this photo?"
        );

      if (!ok)
        return;

      try {
        setDeletingId(
          id
        );

        await fetch(
          `${API_BASE_URL}/gallery/${id}`,
          {
            method:
              "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        loadPhotos();
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Delete failed."
        );
      } finally {
        setDeletingId(
          ""
        );
      }
    };

  /* ======================
     Filter
  ====================== */
  const filteredPhotos =
    useMemo(() => {
      if (!search)
        return photos;

      return photos.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.category
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      photos,
      search,
    ]);

  return (
    <div className="manage-gallery-page">
      {/* Header */}
      <div className="manage-gallery-top">
        <div>
          <h1>
            Manage
            Gallery
          </h1>

          <p>
            Upload and
            manage salon
            showcase
            photos
          </p>
        </div>

        <input
          type="text"
          className="gallery-search"
          placeholder="Search photos..."
          value={
            search
          }
          onChange={(
            e
          ) =>
            setSearch(
              e.target
                .value
            )
          }
        />
      </div>

      {/* Upload Box */}
      <div className="upload-box">
        <form
          onSubmit={
            handleUpload
          }
          className="upload-form"
        >
          <div className="section-head">
            <div>
              <h2>
                Upload
                Photo
              </h2>

              <p>
                Add fresh
                portfolio
                content
              </p>
            </div>
          </div>

          {msg && (
            <div
              className={`upload-msg ${
                msgType ===
                "error"
                  ? "error"
                  : "success"
              }`}
            >
              {msg}
            </div>
          )}

          <input
            required
            placeholder="Photo title"
            value={
              title
            }
            onChange={(
              e
            ) =>
              setTitle(
                e.target
                  .value
              )
            }
          />

          <select
            value={
              category
            }
            onChange={(
              e
            ) =>
              setCategory(
                e.target
                  .value
              )
            }
          >
            {categories.map(
              (
                item
              ) => (
                <option
                  key={
                    item
                  }
                >
                  {item}
                </option>
              )
            )}
          </select>

          <input
            required
            type="file"
            accept="image/*"
            onChange={(
              e
            ) => {
              const file =
                e.target
                  .files[0];

              if (
                !file
              )
                return;

              setImage(
                file
              );

              setPreview(
                URL.createObjectURL(
                  file
                )
              );
            }}
          />

          {preview && (
            <img
              src={
                preview
              }
              alt="Preview"
              className="preview-img"
            />
          )}

          <button
            className="upload-btn"
            disabled={
              uploading
            }
          >
            {uploading
              ? "Uploading..."
              : "Upload Photo"}
          </button>
        </form>
      </div>

      {/* Grid */}
      <div className="gallery-admin-grid">
        {loading ? (
          <div className="empty-gallery">
            Loading
            gallery...
          </div>
        ) : filteredPhotos.length ===
          0 ? (
          <div className="empty-gallery">
            No photos
            found.
          </div>
        ) : (
          filteredPhotos.map(
            (
              item
            ) => (
              <div
                key={
                  item._id
                }
                className="admin-photo-card"
              >
                <img
                  src={
                    item.imageUrl
                  }
                  alt={
                    item.title
                  }
                />

                <div className="admin-photo-info">
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

                  <button
                    className="delete-btn"
                    disabled={
                      deletingId ===
                      item._id
                    }
                    onClick={() =>
                      deletePhoto(
                        item._id
                      )
                    }
                  >
                    {deletingId ===
                    item._id
                      ? "Deleting..."
                      : "Delete Photo"}
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default ManageGallery;