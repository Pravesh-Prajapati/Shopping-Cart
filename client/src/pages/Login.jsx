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
import toast from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import { Loader, Loader2 } from "lucide-react";

function Login() {
  const { login } = useContext(AuthContext);
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      toast.error("Please complete all required fields");
    } else {
      setLoading(true);
      try {
        await login(input.email, input.password);
        toast.success("Login successful!");
        navigate("/");
        setInput({ email: "", password: "" });
      } catch (error) {
        toast.error("invalid email or password" );
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to continue shopping smart 🛍️
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              value={input.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              value={input.password}
            />
          </div>

          <Button
            className="w-full bg-primary text-white hover:bg-primary/90 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Separator className="w-1/4" />
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
