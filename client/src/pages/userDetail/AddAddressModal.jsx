"use client";
  
  import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function AddAddressModal({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  // console.log(loggedIn);
  const [customerAddress, setcustomerAddress] = useState({
    name: "",
    uid: user?.uid,
    phone: "",
    address: "",
    pin: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    if (user?.uid) {
      setcustomerAddress((prev) => ({
        ...prev,
        uid: user.uid,
      }));
    }
  }, [user]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setcustomerAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pin") {
      if (value.trim() === "" || !/^\d{6}$/.test(value)) {
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
            toast.error("Failed to fetch PIN data");
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
      !customerAddress.phone ||
      !customerAddress.uid ||
      !customerAddress.address ||
      !customerAddress.pin ||
      !customerAddress.district ||
      !customerAddress.state
    ) {
      toast.error("Please complete all required fields");
    } else {
      onSubmit(customerAddress);
      setcustomerAddress({
        name: "",
        uid: user.uid,
        phone: "",
        address: "",
        pin: "",
        district: "",
        state: "",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add New Address</Button>
      </DialogTrigger>

      {/* ✅ Modal Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter your full address. Fields will auto-fill when possible.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={customerAddress.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={customerAddress.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={customerAddress.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="pin">PIN Code</Label>
            <Input
              id="pin"
              name="pin"
              value={customerAddress.pin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={customerAddress.district}
                onChange={handleChange}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={customerAddress.state}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
