import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-primary pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 flex items-center justify-center px-4">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass p-6 sm:p-8 md:p-12 rounded-xl text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mb-4 sm:mb-6"
          >
            <FiCheckCircle className="mx-auto text-5xl sm:text-6xl text-green-500" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gold-text leading-tight">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-sm mx-auto">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          {/* Order ID Box */}
          <div className="bg-black rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 uppercase tracking-widest">
              Order ID
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold gold-text font-mono break-all">
              {orderId}
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left text-sm sm:text-base">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-300">Status</span>
              <span className="text-yellow-400 font-medium">Processing</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-gray-300">Estimated Delivery</span>
              <span className="text-right">5–7 business days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Email Confirmation</span>
              <span className="text-secondary font-medium">Sent</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to={`/order/${orderId}`}
              className="flex-1 btn-premium py-3 rounded-lg font-bold text-center text-sm sm:text-base transition"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="flex-1 text-center border-2 border-secondary text-secondary px-4 sm:px-6 py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-secondary hover:text-primary transition"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
