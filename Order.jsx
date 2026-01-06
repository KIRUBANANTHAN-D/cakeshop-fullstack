import { useEffect, useState } from "react";
import "../styles/order.css";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  // 🔹 Fetch orders from Django API (WITH JWT)
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/orders/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log("Error fetching orders", err);
      });
  }, []);

  // 🔹 Cancel order (PATCH request WITH JWT)
  const cancelOrder = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    axios
      .patch(
        `http://127.0.0.1:8000/api/orders/${id}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then(() => {
        // update UI without reload
        setOrders(
          orders.map((order) =>
            order.id === id
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      })
      .catch((err) => console.log("Cancel error", err));
  };

  // 🔹 No orders case
  if (orders.length === 0) {
    return (
      <>
        <h2>Your Orders</h2>
        <p>No orders found</p>
      </>
    );
  }

  return (
    <>
      <h2>Your Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          {/* 🔹 SHORT DETAILS */}
          <p>
            <b>Order No:</b> {order.order_no}
          </p>
          <p>
            <b>Cake:</b> {order.cake_name}
          </p>
          <p>
            <b>Weight:</b> {order.weight} KG
          </p>
          <p>
            <b>Total:</b> ₹{order.total}
          </p>

          {/* 🔹 STATUS */}
          <p className={`status ${order.status}`}>
            Status: {order.status}
          </p>

          {/* 🔹 VIEW / HIDE DETAILS */}
          <button
            onClick={() =>
              setOpenId(openId === order.id ? null : order.id)
            }
          >
            {openId === order.id ? "Hide Details" : "View Details"}
          </button>

          {/* 🔹 CANCEL BUTTON */}
          {order.status !== "cancelled" && (
            <button
              className="cancel-btn"
              onClick={() => cancelOrder(order.id)}
            >
              Cancel Order
            </button>
          )}

          {/* 🔹 CANCELLED MESSAGE */}
          {order.status === "cancelled" && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Order already cancelled
            </p>
          )}

          {/* 🔹 FULL DETAILS */}
          {openId === order.id && (
            <div className="order-details">
              <p>
                <b>Name:</b> {order.name}
              </p>
              <p>
                <b>Phone:</b> {order.phone}
              </p>
              <p>
                <b>Egg Type:</b> {order.egg_type}
              </p>
              <p>
                <b>Delivery:</b> {order.delivery_type}
              </p>

              {order.address && (
                <p>
                  <b>Address:</b> {order.address}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default Orders;
