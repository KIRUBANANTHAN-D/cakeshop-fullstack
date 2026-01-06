import { useEffect, useState } from "react";
import "../styles/contact.css";

function Contact() {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/branches/")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <section className="contact-section">
        <h1>OUR BRANCHES</h1>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search branch or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>

        <div className="branches">
          {branches
            .filter((branch) =>
              `${branch.name} ${branch.location}`
                .toLowerCase()
                .includes(search)
            )
            .map((branch) => (
              <div
                key={branch.id}
                className={`branch-card ${
                  branch.is_main ? "main-branch" : ""
                }`}
              >
                {branch.is_main && (
                  <div className="main-badge">MAIN BRANCH</div>
                )}

                <h3>{branch.name}</h3>
                <p>📍 {branch.location}</p>

                <div className="branch-actions">
                  {branch.map_url && (
                    <>
                      <a
                        href={branch.map_url}
                        target="_blank"
                        rel="noreferrer"
                        className="action-btn"
                      >
                        🗺 Shop location
                      </a>
                      <p>
                        Open {branch.open_time} – Close {branch.close_time}
                      </p>
                    </>
                  )}

                  <a href={`tel:${branch.phone}`} className="action-btn">
                    📞 Call
                  </a>

                  <a
                    href={`https://wa.me/91${branch.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            ))}

          {branches.length === 0 && <p>No branches available.</p>}
        </div>
      </section>

      <footer
        style={{
          background: "#fffff",
          color: "#000",
          textAlign: "center",
          padding: "20px",
          marginTop: "40px",
        }}
      >
        <p>© 2025 FB CAKES | Fresh & Delicious Cakes Delivered Free & Fast</p>
      </footer>
    </>
  );
}

export default Contact;
