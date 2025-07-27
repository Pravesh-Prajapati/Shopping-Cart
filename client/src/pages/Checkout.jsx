import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { emptyCart, getCartItems } from "../features/CartSlice";
import { loadRazorpay } from "@/utils/loadRazorpay";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { API } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const [cartItems, setcartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const getCartItem = useSelector((state) => state.cart.cartItems);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const { loggedIn, user } = useContext(AuthContext);

  const [customerAddress, setcustomerAddress] = useState({
    name: "",
    uid: user?.uid,
    phone: "",
    address: "",
    pin: "",
    district: "",
    state: "",
  });

  const subtotal = getCartItem.reduce((total, item) => {
    const priceInINR = item.product.price * 80;
    return total + priceInINR * item.quantity;
  }, 0);

  useEffect(() => {
    if (user) {
      dispatch(getCartItems(user.uid));
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    setcartItems(getCartItem);
  }, [getCartItem]);

  const getAddress = async () => {
    try {
      const res = await axios.get(`${API.ADDRESS}?uid=${user?.uid}`);
      setSavedAddresses(res.data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };
  useEffect(() => {
    if (user?.uid) {
      getAddress();
    }
  }, [user]);

  const chooseSavedAddress = (address, index) => {
    setSelectedAddressIndex(index);
  };

  const handleAddAddress = () => {
    setSelectedAddressIndex(null);
    setShowAddressModal(true);
    setcustomerAddress({
      name: "",
      uid: user?.uid,
      phone: "",
      address: "",
      pin: "",
      district: "",
      state: "",
    });
  };

  // 🧠 Input Handler
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setcustomerAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pin") {
      if (value === "") {
        setcustomerAddress((prev) => ({
          ...prev,
          district: "",
          state: "",
        }));
      } else {
        if (/^\d{6}$/.test(value)) {
          try {
            const res = await axios.get(
              `https://pinlookup.in/api/pincode?pincode=${value}`
            );
            const data = res?.data?.data;
            if (data) {
              setcustomerAddress((prev) => ({
                ...prev,
                district: data.district_name,
                state: data.state_name,
              }));
            } else {
              setcustomerAddress((prev) => ({
                ...prev,
                district: "",
                state: "",
              }));
            }
          } catch (err) {
            console.error("Failed to fetch PIN data", err);
            setcustomerAddress((prev) => ({
              ...prev,
              district: "",
              state: "",
            }));
          }
        } else {
          setcustomerAddress((prev) => ({
            ...prev,
            district: "",
            state: "",
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(customerAddress);
    if (
      !customerAddress.name ||
      !customerAddress.uid ||
      !customerAddress.phone ||
      !customerAddress.address ||
      !customerAddress.pin ||
      !customerAddress.district ||
      !customerAddress.state
    ) {
      toast.error("Please complete all required fields");
    } else {
      try {
        const res = await axios.post(`${API.ADDRESS}`, customerAddress);
        if (res.status === 201) {
          toast.success("Address added successfully");
          getAddress();
          setSelectedAddressIndex(savedAddresses.length);
          setShowAddressModal(false);
        } else {
          toast.error("Failed to add address");
        }
      } catch (error) {
        console.error("Failed to save address:", error);
        alert("Something went wrong. Try again.");
      }
    }
  };
  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };
  // console.log(cartItems[0])

  const handleBuyNow = async () => {
    if (selectedAddressIndex === null) {
      toast.error("Please select an address");
      setShake(true);
      setTimeout(() => setShake(false), 1000);
      return;
    }
    if (paymentMethod === null) {
      toast.error("Please select a payment method");
      return;
    }
    setIsPaying(true);

    const selectedAddress = savedAddresses[selectedAddressIndex];
    const formattedDate = format(new Date(), "dd MMMM yyyy, hh:mm a");
    const cartSummary = cartItems.map((item) => ({
      productId: item.product.id,
      title: item.product.title,
      image: item.product.images[0],
      quantity: item.quantity,
      price: item.product.price * 80,
      category: item.product.category,
      warranty: item.product.warrantyInformation,
    }));

    const orderData = {
      uid: user.uid,
      cartItems: cartSummary,
      totalAmount: subtotal,
      paymentMethod,
      deliveryAddress: selectedAddress,
      orderDate: formattedDate,
    };

    if (paymentMethod === "razorpay") {
      const res = await loadRazorpay();
      if (!res) {
        alert(
          "Failed to load Razorpay. Please check your internet connection."
        );
        return;
      }
      const options = {
        key: "rzp_test_pbiu76YWhDogo0",
        amount: Math.round(subtotal * 100),
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        image: "/logo.svg",
        handler: async function (response) {
          try {
            const finalOrder = {
              ...orderData,
              razorpayPaymentId: response.razorpay_payment_id,
            };
            await axios.post(
              "http://localhost:4000/orders",
              finalOrder
            );
            toast.success("Payment successful! Order placed.");
            setIsPaying(false);
            dispatch(emptyCart(user.uid));
            navigate("/order-success");
          } catch (err) {
            console.error("Error saving order:", err);
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: selectedAddress.email,
          contact: selectedAddress.phone,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled by user.");
            setIsPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function () {
        toast.error("Payment failed");
        setIsPaying(false);
      });
    } else {
      try {
        const res = await axios.post(`${API.ORDERS}`, orderData);
        if (res.status === 201) {
          toast.success("Order placed with Cash on Delivery!");
          setIsPaying(false);
          dispatch(emptyCart(user.uid));
          navigate("/order-success");
        } else {
          setIsPaying(false);
          toast.error("Failed to place order. Please try again.");
        }
        // clearCart();
      } catch (err) {
        console.error("Failed to place COD order:", err);
        toast.error("Failed to place order. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-500"><ChevronLeft className="w-6 h-6" />Go Back</button>
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-10">
        Checkout
      </h1>

      {/* === GRID LAYOUT: LEFT = Address/Shipping, RIGHT = Summary === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION: Address + Shipping Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Address Block */}
          {savedAddresses.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Choose a Saved Address
              </h2>
              <div className="space-y-3">
                {savedAddresses.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      chooseSavedAddress(address, index);
                    }}
                    className={`border p-4 rounded-md cursor-pointer transition-all duration-300 ease-in-out
                      ${selectedAddressIndex === index
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400"
                      }
                        ${shake && selectedAddressIndex === null
                        ? "border-red-600"
                        : ""
                      }
                       `}
                  >
                    <p className="font-medium">{address.name}</p>
                    <p className="text-sm text-gray-600">
                      {address.address}, {address.district}, {address.state} -{" "}
                      {address.pin}
                    </p>
                    <p className="text-sm text-gray-600">📞 {address.phone}</p>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={handleAddAddress}
                >
                  + Add Another Address
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                No saved address found
              </h2>
              <Button variant="default" onClick={handleAddAddress}>
                + Add New Address
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="divide-y space-y-3 max-h-[400px] overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center gap-3 w-2/3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                    <div>
                      <p className="text-sm font-medium truncate w-40">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 w-1/3 text-right">
                    ₹
                    {(item.product.price * 80 * item.quantity).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
          <hr className="my-4" />
          {/* ============================ */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between font-semibold text-gray-900 text-base">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment Method (optional for now) */}
          {/* Payment Method Selection */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Payment Method
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="razorpay"
                  name="paymentMethod"
                  onChange={handlePayment}
                />
                <span className="text-sm text-gray-800">
                  Razorpay (UPI / Card / Wallet)
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  name="paymentMethod"
                  type="radio"
                  value="cod"
                  onChange={handlePayment}
                />
                <span className="text-sm text-gray-800">
                  Cash on Delivery (COD)
                </span>
              </label>
            </div>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-semibold transition"
            disabled={cartItems.length === 0 || isPaying}
          >
            {isPaying ? "Processing..." : " Proceed to Pay"}
          </button>
        </div>
      </div>
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Please enter your address details.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder="Full Name"
              value={customerAddress.name}
              onChange={handleChange}
              required
            />

            <Input
              name="phone"
              placeholder="Phone"
              value={customerAddress.phone}
              onChange={handleChange}
              required
            />
            <Textarea
              name="address"
              placeholder="Full Address"
              value={customerAddress.address}
              onChange={handleChange}
              required
            />
            <Input
              name="pin"
              placeholder="PIN Code"
              value={customerAddress.pin}
              onChange={handleChange}
              required
            />
            <Input
              name="district"
              placeholder="District"
              value={customerAddress.district}
              onChange={handleChange}
              disabled
            />
            <Input
              name="state"
              placeholder="State"
              value={customerAddress.state}
              onChange={handleChange}
              disabled
            />
            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
