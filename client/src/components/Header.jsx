"use client";

import { use, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ShoppingCart,
  Menu,
  User2,
  MapPinHouse,
  ShoppingBag,
  MapPin,
  Package,
} from "lucide-react";
import { SearchContext } from "@/context/searchContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "@/features/CartSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AuthContext } from "@/context/AuthContext";
import shopsphere from "../assets/shopsphere.png";

export default function Header({ cartCount = 0 }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { handleSearch } = useContext(SearchContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };
  const handleLogout = () => {
    setMobileNavOpen(false);
    logout(navigate);
  };
  useEffect(() => {
    dispatch(getCartItems(user?.uid));
  }, [user?.uid]);

  const cart = useSelector((state) => state.cart.cartItems);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 bg-gradient-to-r from-indigo-50 via-white to-pink-50">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-20 py-4">
        <Link
          to="/" >
          <div className="text-sm bg-none object-cover">
            <img src={shopsphere} alt="" className="md:h-12 md:w-full h-8 w-full object-cover" />
          </div>
        </Link>

        {/* Center: Search (Desktop & Tablet) */}
        {location.pathname === "/" && (
          <div className="hidden sm:flex flex-1 justify-center px-4">
            <Input
              placeholder="Search for products..."
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleChange}
            />
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop View (md breakpoint and up) */}
          <div className="hidden md:flex items-center gap-2">
            {user?.uid ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="rounded-full p-2 border me-1 cursor-pointer hover:bg-muted">
                      <User2 className="h-5 w-5" />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64 p-2">
                    {/* User Info Section */}
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>

                    <div className="border-t my-2" />

                    {/* Menu Items */}
                    <DropdownMenuItem asChild>
                      <Link
                        to="/addresses"
                        className="flex items-center gap-2 w-full"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Saved Addresses</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 w-full"
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* </Link> */}
                <Link to="/cart">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="rounded-md bg-red-500 hover:bg-red-600 hover:text-white text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="rounded-md">
                  <Link to={"/login"}>Login</Link>
                </Button>
                <Button
                  variant="default"
                  className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Link to={"/register"}>Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile View: Hamburger menu only (below md breakpoint) */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[75vw] sm:w-[50vw] max-w-xs flex flex-col gap-0 py-6 px-4"
            >
              {user?.uid ? (
                // <>
                //   <Link to="/profile" onClick={() => setMobileNavOpen(false)}>
                //     <Button
                //       variant="ghost"
                //       className="justify-start w-full rounded-md"
                //     >
                //       <User2 className="h-5 w-5 me-2" /> Profile
                //     </Button>
                //   </Link>
                //   <Link to="/addresses" onClick={() => setMobileNavOpen(false)}>
                //     <Button
                //       variant="ghost"
                //       className="justify-start w-full rounded-md"
                //     >
                //       <MapPinHouse className="h-5 w-5 me-2" />
                //       Addresses
                //     </Button>
                //   </Link>
                //   <Link to="/orders" onClick={() => setMobileNavOpen(false)}>
                //     <Button
                //       variant="ghost"
                //       className="justify-start w-full rounded-md"
                //     >
                //       <ShoppingBag className="h-5 w-5 me-2" /> Orders
                //     </Button>
                //   </Link>
                //   <Link to="/cart" onClick={() => setMobileNavOpen(false)}>
                //     <Button
                //       variant="outline"
                //       size="icon"
                //       className="relative rounded-full ms-3 mt-2"
                //     >
                //       <ShoppingCart className="h-5 w-5" />
                //       {cart.length > 0 && (
                //         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                //           {cart.length}
                //         </span>
                //       )}
                //     </Button>
                //   </Link>
                //   <Button
                //     variant="ghost"
                //     onClick={handleLogout}
                //     className="ms-4 mt-2 w-max rounded-md bg-red-500 hover:bg-red-600 text-white"
                //   >
                //     Logout
                //   </Button>
                // </>
                <>
                  {/* User Info Block */}
                  <div className="flex items-center gap-3 p-4 mb-2 bg-gray-100 rounded-md">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        {user.name || "User"}
                      </span>
                      <span className="text-xs text-gray-600 truncate max-w-[140px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link to="/addresses" onClick={() => setMobileNavOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full rounded-md">
                      <MapPinHouse className="h-5 w-5 me-2" />
                      Addresses
                    </Button>
                  </Link>

                  <Link to="/orders" onClick={() => setMobileNavOpen(false)}>
                    <Button variant="ghost" className="justify-start w-full rounded-md">
                      <ShoppingBag className="h-5 w-5 me-2" />
                      Orders
                    </Button>
                  </Link>

                  <Link to="/cart" onClick={() => setMobileNavOpen(false)}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative rounded-full ms-3 mt-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="ms-4 mt-4 w-max rounded-md bg-red-500 hover:bg-red-600 text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="m-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="justify-start px-6 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="m-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Button
                      variant="default"
                      className="justify-start rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                  {/* Cart icon for non-logged in users on mobile, common for e-commerce */}
                  <Link to="/cart" onClick={() => setMobileNavOpen(false)}>
                    <Button
                      variant="ghost"
                      className="justify-start w-full relative rounded-md"
                    >
                      <ShoppingCart className="h-5 w-5 me-2" /> Cart
                      {cartCount > 0 && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Input (below md breakpoint, as a separate row for space) */}
      {location.pathname === "/" && (
        <div className="flex sm:hidden justify-center px-4 pb-3">
          <Input
            placeholder="Search..."
            className="w-full rounded-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleChange}
          />
        </div>
      )}
    </header>
  );
}
