import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { orderAPI, cartAPI, addressAPI } from "../services/apiServices";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCartSuccess } from "../redux/cartSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
    paymentMethod: "cash_on_delivery",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      toast.error("Error loading cart");
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await addressAPI.getAddresses();
      const items = res.data.addresses || [];
      setAddresses(items);

      // Prefill with primary address (or first) if available
      const primary = items.find((a) => a.primary) || items[0];
      if (primary) {
        setSelectedAddressId(primary._id);
        setFormData((prev) => ({
          ...prev,
          address: primary.address || prev.address,
          city: primary.city || prev.city,
          state: primary.state || prev.state,
          zipCode: primary.postalCode || prev.zipCode,
          country: primary.country || prev.country,
        }));
      }
    } catch (error) {
      // no-op: user may have no addresses yet
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setFormData((prev) => ({
      ...prev,
      address: address.address || prev.address,
      city: address.city || prev.city,
      state: address.state || prev.state,
      zipCode: address.postalCode || prev.zipCode,
      country: address.country || prev.country,
    }));
  };

  const handleSetPrimaryFromCheckout = async (id) => {
    try {
      await addressAPI.setPrimaryAddress(id);
      await fetchAddresses();
      toast.success("Primary address updated");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not set primary address",
      );
    }
  };

  const validItems = cart?.items?.filter((item) => item && item.product) || [];

  const subtotal = cart
    ? validItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0,
      )
    : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!cart || validItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }
      const orderData = {
        items: validItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        totalAmount: total,
      };
      const response = await orderAPI.createOrder(orderData);
      dispatch(clearCartSuccess());
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
        <LoadingSpinner />
      </div>
    );
  }

  // Shared input style — unchanged from your original
  const inputClass =
    "px-4 py-2 bg-primary border border-secondary rounded focus:outline-none w-full";

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Order Summary — top on mobile only */}
          <div className="block lg:hidden">
            <div className="glass p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3 gold-text">
                Order Summary
              </h2>

              <div className="space-y-2 mb-3 pb-3 border-b border-gray-700">
                {validItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between gap-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold gold-text shrink-0 text-sm">
                      Rs.{" "}
                      {((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Estimated Tax</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="gold-text">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Shipping Information */}
              <div className="glass p-4 sm:p-6 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 gold-text">
                  Shipping Information
                </h2>

                {/* Save Address for Future Orders card if no saved addresses */}
                {addresses.length === 0 && (
                  <div className="mb-6 p-4 rounded-xl border border-secondary/20 bg-secondary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold gold-text">Want to save your address for future purchases?</h4>
                      <p className="text-xs text-muted mt-0.5">Create and manage your luxury address book in your account profile.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/profile", { state: { activeTab: "addresses" } })}
                      className="btn-premium px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex-shrink-0"
                    >
                      Go to Profile & Save Address
                    </button>
                  </div>
                )}

                {/* Saved addresses selector */}
                {addresses.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-muted block mb-2">
                      Choose saved address
                    </label>
                    <select
                      value={selectedAddressId || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const addr = addresses.find((x) => x._id === id);
                        if (addr) handleSelectAddress(addr);
                      }}
                      className={`${inputClass} max-w-md mb-3`}
                    >
                      <option value="">Select an address</option>
                      {addresses.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.label} — {a.address}, {a.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* First / Last — stacked on mobile, side-by-side on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`${inputClass} mb-3 sm:mb-4`}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputClass} mb-3 sm:mb-4`}
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`${inputClass} mb-3 sm:mb-4`}
                />

                {/* City / State — stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                {/* ZIP / Country — stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass p-4 sm:p-6 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 gold-text">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {["Online Payment", "cash_on_delivery"].map((method) => (
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
                      <span className="capitalize text-sm sm:text-base">
                        {method.replace(/_/g, " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-3.5 sm:py-4 rounded font-bold text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </motion.button>
            </form>
          </div>

          {/* Order Summary — desktop sidebar (hidden on mobile, shown above instead) */}
          <div className="hidden lg:block glass p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-6 gold-text">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
              {validItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold gold-text">
                    Rs. {((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Estimated Tax</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10 text-light">
                <span>Total</span>
                <span className="gold-text">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
