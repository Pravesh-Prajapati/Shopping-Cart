import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API } from "@/api/api";
import { ChevronLeft } from "lucide-react";

export default function EditAddressPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/addresses/${id}`);
        if (res.data.uid !== user?.uid) {s
          toast.error("Unauthorized access");
          navigate("/");
        } else {
          setAddress(res.data);
        }
      } catch (err) {
        toast.error("Failed to fetch address");
      }
    };
    fetchAddress();
  }, [id, user]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pin") {
      if (value.trim() === "" || !/^\d{6}$/.test(value)) {
        setAddress((prev) => ({
          ...prev,
          district: "",
          state: "",
        }));
        return;
      }

      try {
        const res = await axios.get(
          `https://pinlookup.in/api/pincode?pincode=${value}`
        );
        const data = res?.data?.data;

        if (data) {
          setAddress((prev) => ({
            ...prev,
            district: data.district_name,
            state: data.state_name,
          }));
        } else {
          setAddress((prev) => ({
            ...prev,
            district: "",
            state: "",
          }));
        }
      } catch (err) {
        toast.error("PIN fetch failed");
        setAddress((prev) => ({
          ...prev,
          district: "",
          state: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !address.name ||
      !address.phone ||
      !address.uid ||
      !address.address ||
      !address.pin ||
      !address.district ||
      !address.state
    ) {
      toast.error("Please complete all required fields");
    } else {
      try {
         const res = await axios.put(`${API.ADDRESS}/${id}`, address);
        if (res.status === 200 || res.status === 204) {
          toast.success("Address updated");
          navigate("/addresses");
        }
      } catch (err) {
        toast.error("Failed to update");
      }
    }
  };

  if (!address) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-blue-500"><ChevronLeft className="w-6 h-6" />Go Back</button>
      <h2 className="text-xl font-bold">Edit Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={address.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <Input
          name="phone"
          value={address.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <Textarea
          name="address"
          value={address.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <Input
          name="pin"
          value={address.pin}
          onChange={handleChange}
          placeholder="PIN Code"
          required
        />
        <Input
          name="district"
          value={address.district}
          onChange={handleChange}
          placeholder="District"
          disabled
        />
        <Input
          name="state"
          value={address.state}
          onChange={handleChange}
          placeholder="State"
          disabled
        />
        <Button type="submit" className="w-full">
          Update Address
        </Button>
      </form>
    </div>
  );
}
