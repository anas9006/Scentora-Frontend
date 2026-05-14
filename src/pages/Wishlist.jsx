import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { wishlistAPI, cartAPI } from "../services/apiServices";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
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
      const res = await cartAPI.addToCart({
        productId: product._id,
        quantity: 1,
      });

      dispatch(setCart(res.data.cart));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data);

      const message = error.response?.data?.message || "Failed to add to cart";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-400 mb-8">
            Save your favorite fragrances to your wishlist
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="btn-premium px-8 py-3 rounded font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">
          My <span className="gold-text">Wishlist</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleRemoveItem(product._id)}
              />
              <button
                onClick={() => handleRemoveItem(product._id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
