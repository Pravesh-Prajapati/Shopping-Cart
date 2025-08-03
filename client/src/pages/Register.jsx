import React, { useContext, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

function Register() {
  const { register } = useContext(AuthContext);
  const [input, setInput] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(input);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed: " + err.message);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
    //   <Card className="w-full max-w-md shadow-xl">
    //     <CardHeader>
    //       <CardTitle className="text-2xl text-center font-bold">
    //         Create Account
    //       </CardTitle>
    //       <CardDescription className="text-center">
    //         Join us and start shopping smarter 💳
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent className="space-y-4">
    //       <div className="space-y-2">
    //         <Label htmlFor="name">Full Name</Label>
    //         <Input
    //           id="name"
    //           name="name"
    //           type="text"
    //           value={input.name}
    //           placeholder="John Doe"
    //           onChange={handleChange}
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor="email">Email</Label>
    //         <Input
    //           id="email"
    //           type="email"
    //           name="email"
    //           value={input.email}
    //           placeholder="you@example.com"
    //           onChange={handleChange}
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor="password">Password</Label>
    //         <Input
    //           id="password"
    //           type="password"
    //           name="password"
    //           value={input.password}
    //           placeholder="••••••••"
    //           onChange={handleChange}
    //         />
    //       </div>

    //       <Button
    //         className="w-full bg-primary text-white hover:bg-primary/90 transition"
    //         onClick={handleSubmit}
    //       >
    //         Sign Up
    //       </Button>

    //       <p className="text-sm text-center text-gray-500 dark:text-gray-400">
    //         Already have an account?{" "}
    //         <Link
    //           to="/login"
    //           className="text-primary font-medium hover:underline"
    //         >
    //           Login
    //         </Link>
    //       </p>
    //     </CardContent>

    //     <CardFooter className="flex justify-center">
    //       <Separator className="w-1/4" />
    //     </CardFooter>
    //   </Card>
    // </div>
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-xl mt-24 px-4">
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-base">
              Join us and start shopping smarter 💳
            </CardDescription>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-md px-6 py-4 mt-6 text-sm text-center leading-relaxed">
              <strong>For Demo Purposes</strong><br />
              You can skip registration and use the demo login on the{" "}
              <Link to="/login" className="underline font-medium text-yellow-800 dark:text-yellow-200">
                Login page
              </Link>
              <br />
              This gives you full access to the cart, orders, checkout, and address features.
              <br />
              <span className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
                (No data will be saved permanently)
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={input.name}
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={input.email}
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={input.password}
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 transition"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Separator className="w-1/4" />
          </CardFooter>
        </Card>
      </div>
    </div>

  );
}

export default Register;
