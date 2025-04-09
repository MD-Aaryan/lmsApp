import axios from "axios";
import CustomInput from "../components/Custominput";
import { NavLink, useNavigate } from "react-router-dom";
import { useActionState, useEffect, useState } from "react";
import Button from "../components/Button";
import { CircleAlert } from "lucide-react";

interface State {
  token?: string | null;
  error?: string | null;
}

const RegisterAction = async (_previousData: unknown, formData: FormData) => {
  try {
    const fde = formData.entries();
    const payload = Object.fromEntries(fde);
    const response = await axios("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    });
    return { token: response.data.token };
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || "something went wrong",
    };
  }
};
export default function Register() {
  const token = localStorage.getItem("token") || null;
  const [data, submitAction, isLoading] = useActionState<State, FormData>(
    RegisterAction,
    {
      token: token,
      error: null,
    }
  );
  const [Error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      navigate("/");
    }
    if (data.error) {
      setError(data.error);
    }
  }, [data, navigate]);
  return (
    <div className=" register bg-gray-400">
      <div className="flex flex-col    w-90 bg-gray-300 p-4 rounded shadow-md">
        <h1 className="text-lg font-bold text-center ">Register</h1>
        {Error ? (
          <div className="w-full flex items-center gap-2 border border-red-500 p-2 rounded-md">
            <CircleAlert size={16} color="red" />
            <p className="text-red-400">{Error}</p>
          </div>
        ) : null}
        <form action={submitAction} className="flex flex-col p-4 w-full gap-2">
          <CustomInput required name="name" label="Name" type="text" />
          <CustomInput required name="email" label="Email" type="email" />
          <CustomInput required name="phno" label="Phone" type="tel" />
          <CustomInput
            required
            name="password"
            label="Password"
            type="password"
          />
          <p className="text-red-400"></p>
          <Button
            type="submit"
            className="bg-black text-white mt-4 rounded py-1"
            label={isLoading ? "Registering..." : "Register"}
          />
          <p className="w-full mt-4 text-center">
            Already have an account?
            <span className="ml-2 text-blue-500 hover:underline">
              <NavLink to="/login">Login</NavLink>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
