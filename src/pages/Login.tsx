import axios from "axios";
import CustomInput from "../components/Custominput";
import { NavLink, useNavigate } from "react-router";
import { useActionState, useEffect, useState } from "react";
import Button from "../components/Button";
import { CircleAlert } from "lucide-react";

interface State {
  token?: string | null;
  error?: string | null;
}

// Updated function return type to match the interface
const loginAction = async (
  _previousData: unknown,
  formData: FormData
): Promise<State> => {
  try {
    const fde = formData.entries();
    const payload = Object.fromEntries(fde);
    const response = await axios("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });

    return { token: response.data.token };
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export default function Login() {
  const token = localStorage.getItem("token") || null;
  const [data, submitAction, isLoading] = useActionState<State, FormData>(
    loginAction,
    {
      token: token,
      error: null,
    }
  );
  const [Error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.token) {
      console.log("data", data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    }
    if (data.error) {
      setError(data.error);
    }
  }, [data, navigate]);

  return (
    <div className="login bg-gray-400">
      <div className=" flex flex-col w-90  p-4 border-2 rounded bg-gray-300 opacity-90">
        <h1 className="text-lg font-bold text-center">Login</h1>
        {Error ? (
          <div className="w-full flex items-center gap-2 border border-red-500 p-2 rounded-md">
            <CircleAlert size={16} color="red" />
            <p className="text-red-400">{Error}</p>
          </div>
        ) : null}
        <form action={submitAction} className="flex flex-col p-4 w-full gap-2">
          <CustomInput
            name="phono"
            label="Phone or Email"
            type="text"
            className="border-2 rounded p-1"
          />
          <CustomInput
            name="password"
            label="Password"
            type="password"
            className="border-2 rounded mt-2 p-1"
          />
          <Button
            label={isLoading ? "Logging in..." : "Login"}
            type="submit"
            className="bg-black text-white mt-4 rounded py-1"
          />
        </form>
        <p className="w-full mt-4 text-center">
          Don't have an account?
          <span className="ml-2 text-blue-500 hover:underline">
            <NavLink to="/register">Register</NavLink>
          </span>
        </p>
      </div>
    </div>
  );
}
