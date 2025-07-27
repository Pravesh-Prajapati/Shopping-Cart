import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Building, ChevronLeft, Edit, Home, MapPin, Pencil, Phone, Plus, PlusCircle, Trash2, User } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import AddAddressModal from "./AddAddressModal";
import toast from "react-hot-toast";
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
import { API } from "@/api/api";

export default function AddressPage() {
  const [addresses, setaddresses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  let getUserAddress = async () => {
    let res = await axios.get(`${API.ADDRESS}?uid=${user?.uid}`);
    setaddresses(res.data);
  };
  useEffect(() => {
    getUserAddress();
  }, [user?.uid]);

  const handleAddAddress = async (address) => {
    console.log(address);
    try {
      const res = await axios.post(`${API.ADDRESS}`, address);
      if (res.status === 201) {
        toast.success("Address added successfully");
        getUserAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (item) => {
    setSelectedItem(item.id);
    setDialogOpen(true);
  };

  const confirmRemove = async () => {
    try {
      // const res = await axios.delete(API.DELETE_ADDRESS(selectedItem));
      const res = await axios.delete(`${API.ADDRESS}/${selectedItem}`);
      if (res.status === 200) {
        toast.success("Address deleted successfully");
        setDialogOpen(false);
        setSelectedItem(null);
        getUserAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (


    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>

        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Saved Addresses</h1>
          <AddAddressModal onSubmit={handleAddAddress} />
        </header>

        {addresses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-16">
            No saved addresses found.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    {address.name}
                  </h2>

                  <p className="text-gray-700 flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <span>
                      {address.address}, {address.district}, {address.state} -{" "}
                      {address.pin}
                    </span>
                  </p>

                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {address.phone}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Link
                    to={`/edit-address/${address.id}`}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleRemove(address)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the address. This action cannot be
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
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    
  );
}
