import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { API } from "@/api/api";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ChevronLeft, Loader2, MoreHorizontal, Phone, ReceiptText,
  Package,
  Calendar,
  MapPin,
  ShoppingCart,
  PackageCheck,
  Truck,
  CreditCard,
  Eye,
  Box,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const getOrders = async (uid) => {
    try {
      const res = await axios.get(`${API.ORDERS}?uid=${uid}`);
      console.log(res.data);
      setOrders(res.data);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getOrders(user?.uid);
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
        <p className="text-gray-500">
          Looks like you haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    
    <div className="max-w-7xl mx-auto px-4 py-10"> {/* Increased max-width */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 mb-8 hover:bg-blue-50">
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Go Back</span>
      </Button>

      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-24 h-24 mx-auto text-gray-400 mb-6" />
          <p className="text-xl text-gray-600 font-semibold">No orders found.</p>
          <p className="text-md text-gray-500 mt-2">Start shopping to see your orders here!</p>
          <Button asChild className="mt-6">
            <Link to="/">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8"> {/* Grid for better spacing of multiple orders */}
          {orders.map((order) => (
            <Card key={order.id} className="shadow-lg border border-gray-100 rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 p-6 border-b border-gray-100">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Box className="w-6 h-6 text-gray-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Order ID: <span className="text-blue-600">{order.id}</span></h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ordered on: {order.orderDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="uppercase text-sm px-3 py-1 bg-blue-100 text-blue-700">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {order.paymentMethod}
                    </Badge>
                    <span className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                      <Tag className="w-5 h-5 text-green-600" />
                      Total: <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Delivery Address:</p>
                      <p className="text-gray-600">
                        <span className="font-medium">{order.deliveryAddress.name}</span><br />
                        {order.deliveryAddress.address}, {order.deliveryAddress.district}, {order.deliveryAddress.state} - {order.deliveryAddress.pin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-700">Contact Number:</p>
                      <p className="text-gray-600">{order.deliveryAddress.phone.trim()}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="items" className="border rounded-md">
                    <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-md">
                      <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <Package className="w-5 h-5" />
                        View {order.cartItems.length} Item(s)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                      <div className="space-y-4">
                        {order.cartItems.map((item, idx) => (
                          <Link to={`/products/product-detail?id=${item.productId}`} key={idx} className="block hover:bg-gray-50 rounded-md transition-colors p-2 -mx-2">
                            <div className="flex gap-4 items-center">
                              <img
                                src={item.image || "https://via.placeholder.com/100"}
                                alt={item.title}
                                className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-sm"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-base">{item.title}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Qty: <span className="font-medium">{item.quantity}</span> | Warranty: <span className="font-medium">{item.warranty || "N/A"}</span>
                                </p>
                                <p className="text-md font-bold mt-2 text-green-700">
                                  ₹{item.price?.toFixed(2) ?? "0.00"}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>



  );
};

export default OrdersPage;
