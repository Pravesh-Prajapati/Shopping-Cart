import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "@/features/CartSlice";

import { ChevronLeft, Trash2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Cart() {
  const [selectedItem, setSelectedItem] = useState(null); // Stores the cart item selected for deletion
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [removingItemId, setRemovingItemId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartItems(user?.uid));
  }, [user?.uid]);

  const cart = useSelector((state) => state.cart.cartItems);
  console.log(cart);

  const handleRemove = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      setRemovingItemId(selectedItem.id);
      setDialogOpen(false);
      setTimeout(() => {
        dispatch(removeFromCart(selectedItem.id));
        setSelectedItem(null);
        setRemovingItemId(null);
      }, 300);
    }
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 1) {
      dispatch(updateCartQuantity({ id, quantity: newQty }));
    }
  };

  let subtotal = cart?.reduce((total, item) => {
    const priceInINR = item.product?.price ? item.product.price * 80 : 0;
    return total + priceInINR * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-20 via-sky-50 to-emerald-100 py-12 px-3 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-5 max-w-[600px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-blue-500"
          >
            <ChevronLeft className="w-6 h-6" />
            Go Back
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-center text-indigo-700  tracking-tight">
            Your Shopping Cart
          </h1>
        </div>
        {cart.length === 0 ? (
          <div className="py-24 text-center text-xl font-medium text-gray-500">
            Your cart is empty. <span className="block text-3xl mt-2">🛒</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/90 shadow-lg rounded-xl border p-4 md:p-6 transition-all duration-300 ${
                    removingItemId === item.id
                      ? "opacity-0 -translate-x-10"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Image Section */}
                    <div className="lg:w-1/4 w-full">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Top: Title + Quantity */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <h4 className="text-xl font-semibold">
                          {item.product?.title}
                        </h4>
                        <div className="mt-2 lg:mt-0 flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border border-indigo-300"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity === 1 || loading}
                          >
                            −
                          </Button>
                          <span className="text-lg font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border border-indigo-300"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity === 5 || loading}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      {/* Middle: Details - SKU / Color / Size */}
                      <div className="mt-1  gap-2 text-sm text-gray-600">
                        <p className="mb-2 font-medium">
                          <span className="">CAT:</span>{" "}
                          {item.product?.category || "N/A"}
                        </p>
                        <p className="mb-2 font-semibold">
                          <span className="">Color:</span>{" "}
                          {item.product?.color || "Blue"}
                        </p>
                        <p className="mb-2 font-semibold">
                          <span className="font-medium">Size:</span>{" "}
                          {item.product?.size || "M"}
                        </p>
                      </div>
                      {/* Bottom: Action Buttons + Price */}
                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t pt-5">
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item)}
                          className="flex border border-red-100 items-center gap-2 text-sm font-medium text-red-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-md transition duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Remove Item</span>
                        </button>

                        {/* Price */}
                        <h5 className="text-xl font-semibold text-indigo-700 tracking-tight">
                          ₹
                          {(
                            item.product.price *
                            80 *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:w-1/2 w-full">
              <Card className=" shadow-xl border-0 rounded-xl px-7 py-8 sticky top-20">
                <h2 className="text-2xl font-bold mb-6 text-sky-800 text-center">
                  Order Summary
                </h2>
                <div className="flex justify-between text-base mb-3">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <Separator className="my-5" />
                <div className="flex justify-between text-xl font-extrabold mb-6">
                  <span>Total</span>
                  <p className="transition-all duration-300 font-semibold">
                    Subtotal: ₹{subtotal.toLocaleString("en-IN")}
                  </p>
                </div>
                <Link to={"/checkout"}>
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400 text-white font-bold text-lg py-3 rounded-xl hover:from-indigo-700 hover:to-emerald-500 shadow-xl"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the item from your cart. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmRemove}
            >
              Yes, remove it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Cart;
