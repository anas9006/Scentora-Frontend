import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiStar,
} from "react-icons/fi";
import { orderAPI } from "../services/apiServices";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewModal from "../components/ReviewModal";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewProduct, setReviewProduct] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await orderAPI.getOrderById(id);
      setOrder(res.data.order);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiPackage className="text-gray-400" />;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-24 sm:pt-32">
        <LoadingSpinner />
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen pt-24 sm:pt-32 text-center px-4">
        Order not found.
      </div>
    );

  return (
    <div className="min-h-screen pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 luxury-gradient">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-secondary hover:text-white transition mb-6 sm:mb-10 group text-sm sm:text-base"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Acquisitions
        </button>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">
          {/* ── Main Content ── */}
          <div className="lg:w-2/3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-secondary/10"
            >
              {/* Order title + status */}
              <div className="flex flex-col xs:flex-row xs:flex-wrap justify-between items-start gap-3 sm:gap-6 mb-5 sm:mb-8">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    Acquisition Details
                  </h1>
                  <p className="text-xs sm:text-sm font-mono text-muted break-all">
                    ID: #{order._id.toUpperCase()}
                  </p>
                </div>
                <div
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold uppercase text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 self-start ${
                    order.orderStatus === "delivered"
                      ? "bg-green-500/10 text-green-400"
                      : order.orderStatus === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 sm:space-y-4 sm:space-y-6">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start sm:items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 transition"
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 bg-primary">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "/placeholder-perfume.jpg"
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-light truncate">
                          {item.product?.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted mb-1 sm:mb-2">
                          {item.product?.brand}
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-sm sm:text-lg font-bold text-secondary">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {order.orderStatus === "delivered" && (
                          <button
                            onClick={() => setReviewProduct(item.product)}
                            className="text-[10px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 border border-secondary text-secondary hover:bg-secondary hover:text-primary rounded-lg transition flex items-center gap-1 sm:gap-2"
                          >
                            <FiStar size={11} className="sm:hidden" />
                            <FiStar size={13} className="hidden sm:block" />
                            <span className="hidden xs:inline">
                              Write a Review
                            </span>
                            <span className="xs:hidden">Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="surface-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6">
                Financial Summary
              </h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>
                    Rs.{" "}
                    {(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>Rs. {(order.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Tax</span>
                  <span>Rs. 0.00</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl md:text-2xl font-bold gold-text pt-3 sm:pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>Rs. {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-1/3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="surface-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FiMapPin className="text-secondary flex-shrink-0" />{" "}
                Destination
              </h2>
              <div className="text-muted text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-light mb-1 sm:mb-2">
                  {order.shippingAddress?.fullName}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-3 sm:mt-4 flex items-center gap-2">
                  <FiTruck className="flex-shrink-0" /> Method: Premium Express
                </p>
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="surface-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-secondary/10"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <FiCreditCard className="text-secondary flex-shrink-0" />{" "}
                Payment
              </h2>
              <div className="text-muted text-xs sm:text-sm uppercase tracking-widest">
                <p className="font-bold text-light mb-1 normal-case">
                  {order.paymentMethod?.replace("_", " ")}
                </p>
                <p className="text-[10px] sm:text-xs break-all">
                  Transaction ID: {order.paymentStatus?.toUpperCase()}
                </p>
              </div>
            </motion.div>

            {/* Help Card */}
            <div className="bg-secondary/10 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] border border-secondary/20">
              <h3 className="text-base sm:text-lg font-bold text-secondary mb-2 sm:mb-4">
                Need Assistance?
              </h3>
              <p className="text-xs text-muted leading-relaxed mb-4 sm:mb-6">
                Our olfactive concierges are available to help with tracking or
                modifications to your order.
              </p>
              <Link
                to="/contact"
                className="text-xs sm:text-sm font-bold text-white underline hover:text-secondary transition"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={!!reviewProduct}
        onClose={() => setReviewProduct(null)}
        product={reviewProduct}
      />
    </div>
  );
};

export default OrderDetails;
