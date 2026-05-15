import React from "react";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { wishlistAPI } from "../services/apiServices";
import { useDispatch } from "react-redux";
import { setWishlist } from "../redux/wishlistSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = React.useState(false);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProductId = (item) =>
    item?._id || item?.product?._id || item?.product || item;
  const isWishlisted = wishlistItems.some(
    (item) => String(getProductId(item)) === String(product._id),
  );

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (isTogglingWishlist) return;
    setIsTogglingWishlist(true);
    try {
      if (isWishlisted) {
        const res = await wishlistAPI.removeFromWishlist(product._id);
        dispatch(setWishlist({ products: res.data.wishlist.products }));
        toast.success("Removed from wishlist");
      } else {
        const res = await wishlistAPI.addToWishlist({ productId: product._id });
        dispatch(setWishlist({ products: res.data.wishlist.products }));
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const WishlistIcon = () => {
    if (isTogglingWishlist) {
      return (
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }
    return (
      <>
        <FiHeart
          size={13}
          className="sm:hidden"
          fill={isWishlisted ? "currentColor" : "none"}
        />
        <FiHeart
          size={15}
          className="hidden sm:block"
          fill={isWishlisted ? "currentColor" : "none"}
        />
      </>
    );
  };

  const WishlistIconLg = () => {
    if (isTogglingWishlist) {
      return (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      );
    }
    return <FiHeart size={20} fill={isWishlisted ? "currentColor" : "none"} />;
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-primary border border-secondary rounded-lg overflow-hidden group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-800 h-36 sm:h-44 lg:h-52 flex-shrink-0">
        <img
          src={product.images?.[0]?.url || "/no-image.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-secondary text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Desktop Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition hidden md:flex items-center justify-center gap-4">
          {/* Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={async (e) => {
              e.stopPropagation();
              setIsAddingToCart(true);
              await onAddToCart();
              setIsAddingToCart(false);
            }}
            disabled={isAddingToCart}
            className="bg-secondary text-primary p-3 rounded-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <FiShoppingCart size={20} />
            )}
          </motion.button>

          {/* Wishlist Toggle */}
          <motion.button
            whileHover={{ scale: isTogglingWishlist ? 1 : 1.1 }}
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            className={`p-3 rounded-full transition disabled:cursor-not-allowed ${
              isWishlisted
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-secondary text-primary hover:bg-yellow-400"
            }`}
          >
            <WishlistIconLg />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <p className="text-secondary text-[10px] sm:text-xs mb-0.5 sm:mb-1 truncate">
          {product.brand}
        </p>

        <h3 className="text-white font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center mb-1.5 sm:mb-2">
          <div className="flex text-yellow-400 text-xs sm:text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className="text-gray-400 text-[10px] sm:text-xs ml-1 sm:ml-2">
            ({product.rating ? Number(product.rating).toFixed(1) : "0.0"})
          </span>
        </div>

        {/* Price + Mobile Actions */}
        <div className="flex items-center justify-between gap-1 mt-auto">
          <div className="flex flex-col xs:flex-row xs:items-center gap-0.5 xs:gap-1.5 min-w-0">
            <span className="text-secondary font-bold text-xs sm:text-sm leading-tight">
              Rs.{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-gray-500 text-[10px] sm:text-xs line-through leading-tight">
                Rs.{product.price}
              </span>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:hidden flex-shrink-0">
            {/* Cart */}
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setIsAddingToCart(true);
                await onAddToCart();
                setIsAddingToCart(false);
              }}
              disabled={isAddingToCart}
              className="bg-secondary text-primary p-1.5 sm:p-2 rounded-full hover:bg-yellow-400 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <FiShoppingCart size={13} className="sm:hidden" />
                  <FiShoppingCart size={15} className="hidden sm:block" />
                </>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              disabled={isTogglingWishlist}
              className={`p-1.5 sm:p-2 rounded-full transition active:scale-95 disabled:cursor-not-allowed ${
                isWishlisted
                  ? "bg-red-600 text-white"
                  : "bg-[#111111] border border-secondary/20 text-gray-300"
              }`}
            >
              <WishlistIcon />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
