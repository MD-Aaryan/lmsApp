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

export default function AppLayout() {
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (token) {
      const decodedToken: UserInfo = jwtDecode(token);
      setUserInfo(decodedToken);
    }
  }, [token]);
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

        <h1 className="text-2xl font-bold">TODO App</h1>
        <div className="flex items-center gap-4">
          <LogOut
            className="cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
        </div>
      </nav>
      {/* <div className="flex w-full h-full"> */}
      {/* <aside className="h-full w-[600px] bg-amber-200">Sidebar</aside> */}
      <div className="w-[600px] mx-auto">
        <Outlet />
      </div>
      {/* </div> */}
    </div>
  );
}
