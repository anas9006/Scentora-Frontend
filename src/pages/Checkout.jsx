import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { orderAPI, cartAPI } from "../services/apiServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "credit_card",
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      toast.error("Error loading cart");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const subtotal = cart
    ? cart.items.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0,
      )
    : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!cart || cart.items.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),

        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        totalAmount: total,
      };

      const response = await orderAPI.createOrder(orderData);
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="glass p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 gold-text">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded focus:outline-none mb-4"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded focus:outline-none mb-4"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-primary border border-secondary rounded focus:outline-none mb-4"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 bg-primary border border-secondary rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 gold-text">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {["credit_card", "paypal", "cash_on_delivery"].map(
                    (method) => (
                      <label
                        key={method}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">
                          {method.replace(/_/g, " ")}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-4 rounded font-bold disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="glass p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-6 gold-text">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="gold-text font-semibold">
                    ${((item.product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold gold-text border-t border-gray-700 pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
