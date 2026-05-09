import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12 flex items-center">
      <div className="max-w-2xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <FiCheckCircle className="mx-auto text-6xl text-green-500" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 gold-text">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          <div className="bg-black rounded p-6 mb-8">
            <p className="text-gray-400 mb-2">Order ID</p>
            <p className="text-2xl font-bold gold-text font-mono">{orderId}</p>
          </div>

          <div className="space-y-4 mb-8 text-left">
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span>Status:</span>
              <span className="text-yellow-400">Processing</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span>Estimated Delivery:</span>
              <span>5-7 business days</span>
            </div>
            <div className="flex justify-between">
              <span>Email Confirmation:</span>
              <span className="text-secondary">Sent</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to={`/order/${orderId}`}
              className="block w-full btn-premium py-3 rounded font-bold text-center"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="block text-center border-2 border-secondary text-secondary px-6 py-3 rounded font-bold hover:bg-secondary hover:text-primary transition"
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
