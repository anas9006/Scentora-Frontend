import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FiUser,
  FiLock,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiShield,
  FiPlus,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { authAPI, addressAPI } from "../services/apiServices";
import { updateUser } from "../redux/authSlice";

const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

/* shared input / select style */
const fieldCls =
  "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition placeholder:text-white/20";
const labelCls =
  "block text-[10px] sm:text-xs text-muted uppercase tracking-widest mb-1";

const PasswordField = ({ label, value, onChange, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          className={fieldCls + " pr-10"}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition"
        >
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [addressForm, setAddressForm] = useState({
    label: "Home",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const pwStrength = getStrength(passwordData.newPassword);

  useEffect(() => {
    fetchAddresses();
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setAddressDropdownOpen(false);
      }
    };

    if (addressDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [addressDropdownOpen]);

  // Update dropdown position when opened
  useEffect(() => {
    if (addressDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [addressDropdownOpen]);

  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const res = await addressAPI.getAddresses();
      const data = res.data.addresses || [];
      setAddresses(data);
      const primary = data.find((a) => a.primary);
      if (primary) {
        setSelectedAddressId(primary._id);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      if (editingAddressId) {
        await addressAPI.updateAddress(editingAddressId, addressForm);
        toast.success("Address updated");
      } else {
        await addressAPI.createAddress(addressForm);
        toast.success("Address added");
      }
      setEditingAddressId(null);
      setAddressForm({
        label: "Home",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      await fetchAddresses();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not save address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    setAddressLoading(true);
    try {
      await addressAPI.deleteAddress(id);
      await fetchAddresses();
      toast.success("Address removed");
      if (selectedAddressId === id) {
        const fallback = addresses.find((a) => a._id !== id && a.primary) || addresses.find((a) => a._id !== id);
        setSelectedAddressId(fallback?._id || null);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not remove address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetPrimary = async (id) => {
    setAddressLoading(true);
    try {
      await addressAPI.setPrimaryAddress(id);
      await fetchAddresses();
      setSelectedAddressId(id);
      toast.success("Primary address updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update primary address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setActiveTab("addresses");
    setAddressDropdownOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: "Home",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileData);
      dispatch(updateUser(res.data.user));
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await authAPI.updatePassword(passwordData);
      toast.success("Password updated");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      toast.error(e.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "details",
      label: "My Details",
      short: "Details",
      icon: <FiUser size={16} />,
    },
    {
      id: "security",
      label: "Security",
      short: "Security",
      icon: <FiShield size={16} />,
    },
    {
      id: "addresses",
      label: "Addresses",
      short: "Addresses",
      icon: <FiMapPin size={16} />,
    },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12 lg:pb-14 px-3 sm:px-6 lg:px-8 luxury-gradient">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-4xl font-bold gold-text gold-glow mb-1 sm:mb-2">
            My Account
          </h1>
          <p className="text-muted text-xs sm:text-base">
            Manage your profile, security and delivery addresses.
          </p>
        </motion.div>

        {/* Mobile tab bar */}
        <div className="flex lg:hidden surface-panel rounded-2xl p-1 gap-1 mb-4 sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-accent text-[#D4AF37]"
                  : "text-muted hover:bg-white/5 hover:text-light"
              }`}
            >
              {tab.icon}
              <span>{tab.short}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="surface-panel rounded-2xl p-3 sticky top-28 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${
                    activeTab === tab.id
                      ? "bg-accent text-[#D4AF37] font-bold"
                      : "text-muted hover:bg-white/5 hover:text-light"
                  }`}
                >
                  <span className="flex-shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* ── Details ── */}
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="surface-panel rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-light flex items-center gap-2">
                      <FiUser className="text-accent" size={16} /> Personal
                      Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-accent hover:text-accent-soft text-xs sm:text-sm transition"
                      >
                        <FiEdit2 size={13} /> Edit
                      </button>
                    )}
                  </div>

                  <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        { label: "First Name", key: "firstName", type: "text" },
                        { label: "Last Name", key: "lastName", type: "text" },
                        { label: "Email Address", key: "email", type: "email" },
                      ].map(({ label, key, type }) => (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          <input
                            type={type}
                            disabled={!isEditing}
                            value={profileData[key]}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                [key]: e.target.value,
                              })
                            }
                            className={
                              fieldCls +
                              (!isEditing
                                ? " opacity-50 cursor-not-allowed"
                                : "")
                            }
                          />
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-premium px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm"
                        >
                          <FiSave size={13} /> {loading ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              firstName: user?.firstName || "",
                              lastName: user?.lastName || "",
                              email: user?.email || "",
                              phone: user?.phone || "",
                            });
                          }}
                          className="bg-white/5 hover:bg-white/10 text-light px-4 py-2 rounded-xl flex items-center gap-1.5 transition text-xs sm:text-sm"
                        >
                          <FiX size={13} /> Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* ── Security ── */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="surface-panel rounded-2xl p-4 sm:p-6 grid justify-center"
                >
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-light flex items-center gap-2 mb-1">
                      <FiLock className="text-accent" size={16} /> Password &
                      Security
                    </h2>
                    <p className="text-muted text-xs">
                      At least 8 characters with uppercase, numbers and symbols.
                    </p>
                  </div>

                  <form
                    onSubmit={handlePasswordUpdate}
                    className="max-w-sm space-y-3 sm:space-y-4"
                  >
                    <PasswordField
                      label="Current Password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />

                    <div>
                      <PasswordField
                        label="New Password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      {passwordData.newPassword.length > 0 && (
                        <div className="mt-1.5">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                style={{
                                  background:
                                    i <= pwStrength
                                      ? strengthColor[pwStrength]
                                      : "rgba(255,255,255,0.08)",
                                }}
                              />
                            ))}
                          </div>
                          <p
                            className="text-[10px]"
                            style={{ color: strengthColor[pwStrength] }}
                          >
                            {strengthLabel[pwStrength]}
                          </p>
                        </div>
                      )}
                    </div>

                    <PasswordField
                      label="Confirm Password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium w-full py-2.5 rounded-xl text-sm"
                    >
                      {loading ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── Addresses ── */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-4"
                >
                  {/* Contact Phone Number */}
                  <div className="surface-panel rounded-2xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-light flex items-center gap-2 mb-2">
                      <FiUser className="text-accent" size={16} /> Contact Phone Number
                    </h2>
                    <p className="text-muted text-xs mb-4">
                      Please enter a phone number where we can reach you for delivery verification.
                    </p>
                    <form onSubmit={handleProfileUpdate} className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 w-full">
                        <label className={labelCls}>Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="e.g. +1 555-0199"
                          className={fieldCls}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0 flex items-center gap-1.5 w-full sm:w-auto justify-center"
                      >
                        <FiSave size={13} /> {loading ? "Saving…" : "Save Phone"}
                      </button>
                    </form>
                  </div>

                  {/* Saved addresses */}
                  <div className="surface-panel rounded-2xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-light flex items-center gap-2 mb-3 sm:mb-4">
                      <FiMapPin className="text-accent" size={16} /> Saved
                      Addresses
                    </h2>

                    {addressLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : addresses.length > 0 ? (
                        <div className="mb-4 relative max-w-2xl">
                          <button
                            ref={buttonRef}
                            type="button"
                            onClick={() => setAddressDropdownOpen((prev) => !prev)}
                            className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 border border-white/10 rounded-xl bg-[#0f0f0f] hover:border-white/20 transition"
                          >
                            <span className="truncate text-sm">
                              {addresses.find((a) => a._id === selectedAddressId)?.label || "Select address"} — {addresses.find((a) => a._id === selectedAddressId)?.address || "No address selected"}
                            </span>
                            <span className="text-xs text-muted uppercase tracking-[0.2em]">
                              Primary
                            </span>
                          </button>

                          {addressDropdownOpen && ReactDOM.createPortal(
                            <div 
                              ref={dropdownRef}
                              className="fixed rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl overflow-hidden"
                              style={{ 
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                                width: `${dropdownPosition.width}px`,
                                zIndex: 99999
                              }}
                            >
                              {addresses.map((addr) => (
                                <div
                                  key={addr._id}
                                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5 transition"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleSetPrimary(addr._id);
                                      setAddressDropdownOpen(false);
                                    }}
                                    className="flex-1 min-w-0 text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${addr.primary ? "bg-accent text-[#0d0d0d]" : "bg-white/10 text-muted"}`}>
                                        {addr.label[0]}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-light truncate">
                                          {addr.label} {addr.primary && <span className="ml-2 text-[10px] uppercase tracking-[0.2em] bg-accent/20 text-accent px-2 py-0.5 rounded-full">Primary</span>}
                                        </div>
                                        <p className="text-xs text-muted truncate">
                                          {addr.address}, {addr.city}, {addr.state} {addr.postalCode}
                                        </p>
                                      </div>
                                    </div>
                                  </button>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleEditAddress(addr)}
                                      className="p-2 rounded-lg hover:bg-white/5 transition"
                                      title="Edit address"
                                    >
                                      <FiEdit2 size={16} className="text-muted hover:text-light" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAddress(addr._id)}
                                      className="p-2 rounded-lg hover:bg-white/5 transition"
                                      title="Delete address"
                                    >
                                      <FiTrash2 size={16} className="text-muted hover:text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>,
                            document.body
                          )}
                        </div>

                    ) : (
                      <div className="text-center py-8 rounded-xl border border-dashed border-white/10">
                        <FiMapPin
                          size={30}
                          className="text-muted mx-auto mb-2 opacity-20"
                        />
                        <p className="text-muted text-xs sm:text-sm">
                          No saved addresses yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add address form */}
                  <div className="surface-panel rounded-2xl p-4 sm:p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-light flex items-center gap-2 mb-3 sm:mb-4">
                      <FiPlus className="text-accent" size={15} />
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h3>

                    <form
                      onSubmit={handleAddressSubmit}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {/* Label dropdown — dark background to fix white text issue */}
                      <div>
                        <label className={labelCls}>Label</label>
                        <select
                          value={addressForm.label}
                          onChange={(e) =>
                            setAddressForm((p) => ({
                              ...p,
                              label: e.target.value,
                            }))
                          }
                          className={fieldCls}
                          style={{ colorScheme: "dark" }}
                        >
                          <option
                            value="Home"
                            style={{ background: "#1a1a1a", color: "#f0e8d5" }}
                          >
                            Home
                          </option>
                          <option
                            value="Work"
                            style={{ background: "#1a1a1a", color: "#f0e8d5" }}
                          >
                            Work
                          </option>
                          <option
                            value="Other"
                            style={{ background: "#1a1a1a", color: "#f0e8d5" }}
                          >
                            Other
                          </option>
                        </select>
                      </div>

                      {[
                        { label: "Street Address", key: "address" },
                        { label: "City", key: "city" },
                        { label: "State", key: "state" },
                        { label: "Postal Code", key: "postalCode" },
                        { label: "Country", key: "country" },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          <input
                            type="text"
                            value={addressForm[key]}
                            onChange={(e) =>
                              setAddressForm((p) => ({
                                ...p,
                                [key]: e.target.value,
                              }))
                            }
                            required
                            placeholder={label}
                            className={fieldCls}
                          />
                        </div>
                      ))}

                      {/* Buttons — full row */}
                      <div className="sm:col-span-2 flex gap-2 pt-1 justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setAddressForm({
                              label: "Home",
                              address: "",
                              city: "",
                              state: "",
                              postalCode: "",
                              country: "",
                            })
                          }
                          className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-muted hover:bg-white/10 transition text-xs sm:text-sm"
                        >
                          Clear
                        </button>
                        <button
                          type="submit"
                          disabled={addressLoading}
                          className="btn-premium px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5"
                        >
                          <FiPlus size={13} />
                          {addressLoading
                            ? editingAddressId
                              ? "Saving…"
                              : "Adding…"
                            : editingAddressId
                            ? "Save Address"
                            : "Add Address"}
                        </button>
                        {editingAddressId && (
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-muted hover:bg-white/10 transition text-xs sm:text-sm"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;