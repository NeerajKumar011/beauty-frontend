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

  const [msg, setMsg] =
    useState("");

  const token =
  localStorage.getItem("token") || "";

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
    loadSettings();
  }, []);

  const loadSettings =
    async () => {
      const res =
        await fetch(
  `${API_BASE_URL}/availability`
)

      const data =
  await res.json().catch(
    () => ({})
  );

      setForm(data);
    };

  const toggleDay =
    (day) => {
      if (
        form.closedDays.includes(
          day
        )
      ) {
        setForm({
          ...form,
          closedDays:
            form.closedDays.filter(
              (d) =>
                d !== day
            ),
        });
      } else {
        setForm({
          ...form,
          closedDays: [
            ...form.closedDays,
            day,
          ],
        });
      }
    };

  const addDate =
    (date) => {
      if (
        !date ||
        form.closedDates.includes(
          date
        )
      )
        return;

      setForm({
        ...form,
        closedDates: [
          ...form.closedDates,
          date,
        ],
      });
    };

  const removeDate =
    (date) => {
      setForm({
        ...form,
        closedDates:
          form.closedDates.filter(
            (d) =>
              d !== date
          ),
      });
    };

  const saveSettings =
    async (e) => {
      e.preventDefault();

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
        await res.json();

      setMsg(
        data.message
      );
    };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <div className="main-content">
        <div className="topbar">
          <div>
            <h1>
              Availability
              Settings
            </h1>
            <p>
              Control open /
              closed salon
              schedule
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <form
            className="service-form"
            onSubmit={
              saveSettings
            }
          >
            <h3>
              Weekly Closed
              Days
            </h3>

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >
              {weekDays.map(
                (day) => (
                  <button
                    type="button"
                    key={day}
                    className={
                      form.closedDays.includes(
                        day
                      )
                        ? "delete-btn"
                        : "feature-btn"
                    }
                    onClick={() =>
                      toggleDay(
                        day
                      )
                    }
                  >
                    {day}
                  </button>
                )
              )}
            </div>

            <h3>
              Add Closed
              Date
            </h3>

            <input
              type="date"
              onChange={(e) =>
                addDate(
                  e.target
                    .value
                )
              }
            />

            <div>
              {form.closedDates.map(
                (date) => (
                  <button
                    key={date}
                    type="button"
                    className="delete-btn"
                    style={{
                      marginRight:
                        "8px",
                      marginTop:
                        "8px",
                    }}
                    onClick={() =>
                      removeDate(
                        date
                      )
                    }
                  >
                    {date}
                  </button>
                )
              )}
            </div>

            <h3>
              Opening Time
            </h3>

            <input
              type="time"
              value={
                form.openTime
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  openTime:
                    e.target
                      .value,
                })
              }
            />

            <h3>
              Closing Time
            </h3>

            <input
              type="time"
              value={
                form.closeTime
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  closeTime:
                    e.target
                      .value,
                })
              }
            />

            <h3>
              Max Bookings
              Per Day
            </h3>

            <input
              type="number"
              value={
                form.maxBookingsPerDay
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  maxBookingsPerDay:
  Number(
    e.target.value
  ) || 0,
                })
              }
            />

            <button className="book-btn">
              Save Settings
            </button>

            {msg && (
              <p>
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AvailabilitySettings;