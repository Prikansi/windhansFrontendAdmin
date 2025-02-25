import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LoginImage from "../../images/LoginImage.png";
import { FaKey } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import LoginBackground from "../../images/login_background.jpg";
import axios from "axios";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

function Login() {
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault() // Prevent page refresh
    const { email, password } = formData

    if (email !== "" && password !== "") {
      try {
        const response = await axios.post(
          "http://localhost:4000/login",
          { email, password },
          { withCredentials: true }, // Ensure cookies are sent
        )

        console.log(response.data)

        if (response.data.message === "Login successful") {
          // Save token if necessary (not needed for HTTP-only cookies)
          sessionStorage.setItem("token", response.data.token)

          // Redirect to dashboard after successful login
          navigate("/Dashboard")
        } else {
          setError(true)
          setErrorText("Login failed. Please try again.")
        }
      } catch (error) {
        console.error("Login error:", error)
        setError(true)
        setErrorText("Login failed. Please try again.")
      }
    }
  }

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        background: `url(${LoginBackground}) no-repeat`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="flex items-center shadow-xl bg-[#F4F4F4] gap-8 py-10 px-7">
        <div>
          <img src={LoginImage} alt="Login" className="h-96" />
        </div>
        <div>
          <Card className="w-[28rem]">
            <p className="font-medium text-[20px]">Welcome To</p>
            <p className="font-[900] text-[30px] text-[#6358DC]">
              CollabHub Admin
            </p>
            <div>{error && <h1 className="text-red-500">{errorText}</h1>}</div>

            <form onSubmit={handleLogin}>
              <div className="py-7">
                <Label htmlFor="email">Your Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  prefix={<IoMail className="text-gray-800" />}
                  className="rounded-md"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Label htmlFor="password">Your Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  prefix={<FaKey className="text-gray-800" />}
                  className="rounded-md"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <div className="flex justify-between mt-3">
                  <p>Forget Password?</p>
                </div>

                <div className="flex items-center justify-center my-5">
                  <Button
                    type="submit"
                    className="h-10 w-72 bg-[#6358DC] text-white"
                  >
                    Login
                  </Button>
                </div>
                <div className="flex items-center justify-center my-2">
                  <p>Don’t have an account? Register</p>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
