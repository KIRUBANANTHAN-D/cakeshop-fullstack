import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/cakedetails.css";
import axios from "axios";

function CakeDetails() {
  const { id } = useParams();

  const [cake, setCake] = useState(null);
  const [branches, setBranches] = useState([]);

  const weights = [0.5, 1, 1.5, 2];
  const [selectedWeight, setSelectedWeight] = useState(1);

  const [eggType, setEggType] = useState("egg");
  const [deliveryType, setDeliveryType] = useState("pickup");

  const [message, setMessage] = useState("");
  const [paymentType, setPaymentType] = useState("cod");

  const [step, setStep] = useState(1);

  /* Customer details */
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");

  /* Address */
  const [address, setAddress] = useState("");

  /* Fetch cake */
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cakes/${id}/`)
      .then(res => res.json())
      .then(data => setCake(data))
      .catch(err => console.error(err));
  }, [id]);

  /* Fetch branches */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/branches/")
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.error(err));
  }, []);

  if (!cake) return <h2>Loading...</h2>;

  /* Price calculation */
  const basePrice = Number(cake.price);
  const finalCakePrice = basePrice * selectedWeight;
  const deliveryCharge = deliveryType === "delivery" ? 60 : 0;
  const totalAmount = finalCakePrice + deliveryCharge;

  /* Place Order */
  function placeOrder() {
    const orderData = {
      name: customerName,
      phone: phone,
      cake: cake.id,
      weight: selectedWeight,
      egg_type: eggType,
      delivery_type: deliveryType,
      address: address,
      total: totalAmount,
    };

    axios
      .post("http://127.0.0.1:8000/api/orders/", orderData)
      .then(res => {
        alert("Order placed! Order No: " + res.data.order_no);
      })
      .catch(err => {
        console.error(err);
        alert("Order failed");
      });
  }

  return (
    <div className="cake-details-container">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="cake-left">
            <img
              src={`http://127.0.0.1:8000${cake.image}`}
              alt={cake.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-cake.jpg";
              }}
            />
          </div>

          <div className="cake-right">
            <h2>{cake.name}</h2>
            <p className="offer-text">{cake.description}</p>
            <p><b>Base Price:</b> Rs. {cake.price} / KG</p>

            <h4>Select Weight</h4>
            <div className="option-row">
              {weights.map(w => (
                <button
                  key={w}
                  className={selectedWeight === w ? "active" : ""}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w} KG
                </button>
              ))}
            </div>

            <h4>Egg Type</h4>
            <div className="option-row">
              <button
                className={eggType === "egg" ? "active" : ""}
                onClick={() => setEggType("egg")}
              >
                Egg
              </button>
              <button
                className={eggType === "eggless" ? "active" : ""}
                onClick={() => setEggType("eggless")}
              >
                Eggless
              </button>
            </div>

            <input
              placeholder="Message on cake (optional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <h4>Delivery Type</h4>
            <div className="option-row">
              <button
                className={deliveryType === "pickup" ? "active" : ""}
                onClick={() => setDeliveryType("pickup")}
              >
                Pickup
              </button>
              <button
                className={deliveryType === "delivery" ? "active" : ""}
                onClick={() => setDeliveryType("delivery")}
              >
                Delivery
              </button>
            </div>

            {deliveryType === "pickup" && (
              <select>
                <option>Select Branch</option>
                {branches.map(b => (
                  <option key={b.id}>{b.name}</option>
                ))}
              </select>
            )}

            {deliveryType === "delivery" && (
              <textarea
                placeholder="Enter delivery address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            )}

            <h3>Total Amount: Rs. {totalAmount}</h3>

            <button className="next-btn" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="cake-right">
          <h2>Customer Details</h2>

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />

          <input
            placeholder="Mobile Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <input
            placeholder="Additional Number (optional)"
            value={altPhone}
            onChange={e => setAltPhone(e.target.value)}
          />

          <button className="next-btn" onClick={() => setStep(3)}>
            Proceed to Payment
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="cake-right">
          <h3>Order Summary</h3>

          <div className="payment-section">
            <label className="payment-card">
              <input
                type="radio"
                checked={paymentType === "cod"}
                onChange={() => setPaymentType("cod")}
              />
              <span className="icon">💵</span>
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when you receive</p>
              </div>
            </label>

            <label className="payment-card">
              <input
                type="radio"
                checked={paymentType === "online"}
                onChange={() => setPaymentType("online")}
              />
              <span className="icon">💳</span>
              <div>
                <strong>Online Payment</strong>
                <p>UPI / Card / NetBanking</p>
              </div>
            </label>
          </div>

          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}

      {/* BACK BUTTON */}
      {step > 1 && (
        <div className="back-wrapper">
          <button className="back-btn" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

export default CakeDetails;
