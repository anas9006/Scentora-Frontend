import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { wishlistAPI, cartAPI } from "../services/apiServices";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { setWishlist as setReduxWishlist } from "../redux/wishlistSlice";
import { setCart } from "../redux/cartSlice";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist);
      dispatch(setReduxWishlist({ products: response.data.wishlist.products }));
    } catch (error) {
      toast.error("Error loading wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      fetchWishlist();
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await cartAPI.addToCart({ productId: product._id, quantity: 1 });
      dispatch(setCart(res.data.cart));
      toast.success("Added to cart!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const validProducts = wishlist?.products?.filter((product) => product) || [];

  if (!wishlist || validProducts.length === 0) {
    return (
      <div className="min-h-screen bg-primary pt-20 sm:pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-16 sm:py-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">
            Save your favorite fragrances to your wishlist
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="btn-premium px-6 sm:px-8 py-2.5 sm:py-3 rounded font-bold text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            My <span className="gold-text">Wishlist</span>
          </h1>
          <span className="text-xs sm:text-sm text-gray-400">
            {validProducts.length}{" "}
            {validProducts.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-start">
          {validProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // ↓ This is the key fix: equal height + flex column so all cards stretch uniformly
              className="relative flex flex-col h-full"
            >
              {/* Wrapper forces ProductCard to fill the column height */}
              <div className="flex flex-col h-full [&>*]:flex [&>*]:flex-col [&>*]:h-full [&_img]:h-36 [&_img]:sm:h-44 [&_img]:md:h-52 [&_img]:object-cover [&_img]:w-full">
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleRemoveItem(product._id)}
                />
              </div>

              {/* Remove button */}
              <button
                onClick={() => handleRemoveItem(product._id)}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-red-600 text-white p-1.5 sm:p-2 rounded hover:bg-red-700 active:bg-red-800 transition z-10"
                aria-label="Remove from wishlist"
              >
                <FiTrash2 size={14} className="sm:hidden" />
                <FiTrash2 size={16} className="hidden sm:block" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;