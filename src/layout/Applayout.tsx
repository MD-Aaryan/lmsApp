import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import { Outlet } from "react-router";
import { LogOut } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  phono: string;
  iat: number;
  exp: number;
}
// library management system layout
export default function AppLayout() {
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (token) {
      const decodedToken: UserInfo = jwtDecode(token);
      setUserInfo(decodedToken);
    }
  }, [token]);
  const useNavigate = ({ to }: { to: string }) => {
    if (token) {
      window.location.href = to;
    }
  };
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden items-center">
      <nav className="flex w-full items-center justify-between bg-yellow-100 p-2">
        {userInfo && (
          <Avatar
            name={userInfo.name}
            email={userInfo.email}
            src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg"
          />
        )}

        <h1 className="text-2xl font-bold">Library Management System</h1>
        <div className="flex items-center gap-2">
          <LogOut
            className="cursor-pointer mx-20"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
        </div>
      </nav>
      <div className="flex w-full h-full">
        <aside className=" flex  h-full w-[150px] bg-amber-100">
          <div className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold">Sidebar</h2>
            <h2
              onClick={() => useNavigate({ to: "/" })}
              className=" mx-5 font-bold cursor-pointer"
            >
              Home
            </h2>
            <h2
              onClick={() => useNavigate({ to: "/members" })}
              className="  mx-5 font-bold cursor-pointer"
            >
              Member
            </h2>
            <h2
              onClick={() => useNavigate({ to: "/book" })}
              className=" mx-5 font-bold cursor-pointer"
            >
              Book
            </h2>
            <h2
              onClick={() => useNavigate({ to: "/transaction" })}
              className=" mx-5 font-bold cursor-pointer"
            >
              Transaction
            </h2>
          </div>
        </aside>
        <div className="w-[600px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
