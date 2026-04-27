import API_BASE_URL from "../utils/api";
import {
  useEffect,
  useState,
} from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/Admin.css";

function AvailabilitySettings() {
  const [form, setForm] =
    useState({
      closedDays: [],
      closedDates: [],
      openTime: "10:00",
      closeTime: "20:00",
      maxBookingsPerDay: 20,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [msg, setMsg] =
    useState("");

  const [
    msgType,
    setMsgType,
  ] = useState("success");

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");

  const token =
    localStorage.getItem(
      "token"
    ) || "";

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    loadSettings();
  }, []);

  /* ======================
     Load Settings
  ====================== */
  const loadSettings =
    async () => {
      try {
        setLoading(true);

        const res =
          await fetch(
            `${API_BASE_URL}/availability`
          );

        const data =
          await res
            .json()
            .catch(
              () => ({})
            );

        setForm({
          closedDays:
            data.closedDays ||
            [],
          closedDates:
            data.closedDates ||
            [],
          openTime:
            data.openTime ||
            "10:00",
          closeTime:
            data.closeTime ||
            "20:00",
          maxBookingsPerDay:
            data.maxBookingsPerDay ||
            20,
        });
      } catch {
        setMsgType(
          "error"
        );

        setMsg(
          "Unable to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

  /* ======================
     Day Toggle
  ====================== */
  const toggleDay = (
    day
  ) => {
    const exists =
      form.closedDays.includes(
        day
      );

    setForm({
      ...form,
      closedDays:
        exists
          ? form.closedDays.filter(
              (d) =>
                d !==
                day
            )
          : [
              ...form.closedDays,
              day,
            ],
    });
  };

  /* ======================
     Add Date
  ====================== */
  const addDate = () => {
    if (
      !selectedDate ||
      form.closedDates.includes(
        selectedDate
      )
    )
      return;

    setForm({
      ...form,
      closedDates: [
        ...form.closedDates,
        selectedDate,
      ],
    });

    setSelectedDate(
      ""
    );
  };

  /* ======================
     Remove Date
  ====================== */
  const removeDate = (
    date
  ) => {
    setForm({
      ...form,
      closedDates:
        form.closedDates.filter(
          (d) =>
            d !== date
        ),
    });
  };

  /* ======================
     Save
  ====================== */
  const saveSettings =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);

        const res =
          await fetch(
            `${API_BASE_URL}/availability`,
            {
              method:
                "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(
                form
              ),
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
              "Settings saved successfully ✨"
          );
        } else {
          setMsgType(
            "error"
          );

          setMsg(
            data.message ||
              "Failed to save settings."
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
        setSaving(false);
      }
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        {/* Header */}
        <div className="topbar">
          <div>
            <h1>
              Availability
              Settings
            </h1>

            <p>
              Control salon
              timings,
              holidays &
              booking
              capacity
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={
              loadSettings
            }
          >
            ↻ Reload
          </button>
        </div>

        {/* Body */}
        <div className="booking-area">
          <div className="section-head">
            <div>
              <h2>
                Manage
                Schedule
              </h2>

              <p>
                Premium
                booking
                controls
              </p>
            </div>
          </div>

          <div className="table-wrap luxury-form-wrap">
            {loading ? (
              <div className="loading-box">
                <div className="mini-loader"></div>
                <p>
                  Loading
                  settings...
                </p>
              </div>
            ) : (
              <form
                className="service-form premium-form"
                onSubmit={
                  saveSettings
                }
              >
                {/* Message */}
                {msg && (
                  <div
                    className={`admin-msg ${
                      msgType ===
                      "error"
                        ? "error"
                        : "success"
                    }`}
                  >
                    {msg}
                  </div>
                )}

                {/* Closed Days */}
                <div className="input-group">
                  <label>
                    Weekly
                    Closed Days
                  </label>

                  <div className="chips-wrap">
                    {weekDays.map(
                      (
                        day
                      ) => (
                        <button
                          type="button"
                          key={
                            day
                          }
                          className={`chip-btn ${
                            form.closedDays.includes(
                              day
                            )
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            toggleDay(
                              day
                            )
                          }
                        >
                          {
                            day
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Closed Dates */}
                <div className="input-group">
                  <label>
                    Special
                    Closed
                    Dates
                  </label>

                  <div className="date-row">
                    <input
                      type="date"
                      value={
                        selectedDate
                      }
                      onChange={(
                        e
                      ) =>
                        setSelectedDate(
                          e.target
                            .value
                        )
                      }
                    />

                    <button
                      type="button"
                      className="feature-btn"
                      onClick={
                        addDate
                      }
                    >
                      + Add
                    </button>
                  </div>

                  <div className="chips-wrap">
                    {form.closedDates.map(
                      (
                        date
                      ) => (
                        <button
                          key={
                            date
                          }
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            removeDate(
                              date
                            )
                          }
                        >
                          {
                            date
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Timings */}
                <div className="grid-2">
                  <div className="input-group">
                    <label>
                      Opening
                      Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.openTime
                      }
                      onChange={(
                        e
                      ) =>
                        setForm({
                          ...form,
                          openTime:
                            e
                              .target
                              .value,
                        })
                      }
                    />
                  </div>

                  <div className="input-group">
                    <label>
                      Closing
                      Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.closeTime
                      }
                      onChange={(
                        e
                      ) =>
                        setForm({
                          ...form,
                          closeTime:
                            e
                              .target
                              .value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="input-group">
                  <label>
                    Max
                    Bookings Per
                    Day
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.maxBookingsPerDay
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        maxBookingsPerDay:
                          Number(
                            e
                              .target
                              .value
                          ) ||
                          0,
                      })
                    }
                  />
                </div>

                {/* Submit */}
                <button
                  className="book-btn premium-submit"
                  disabled={
                    saving
                  }
                >
                  {saving ? (
                    <>
                      <span className="mini-loader white"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilitySettings;