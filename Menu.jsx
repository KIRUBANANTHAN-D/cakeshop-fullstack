import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/menu.css";

function Menu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <section className="menu">
      <h1>OUR CAKES</h1>

      {categories.map(cat => (
        <div key={cat.id}>
          <h2>{cat.name}</h2>

          <div className="cake-row">
            {cat.cakes.map(cake => (
              <div className="cake-card" key={cake.id}>
                <div className="cake-img">
                  <img src={cake.image} alt={cake.name} />
                  <Link to={`/cake/${cake.id}`} className="buy-now">
                    BUY NOW
                  </Link>
                </div>

                <h3>{cake.name}</h3>
                <p>Rs. {cake.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Menu;
