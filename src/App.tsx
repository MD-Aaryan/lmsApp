import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { jwtDecode } from "jwt-decode";
import AppLayout from "./layout/Applayout";
import Lmsapp from "./pages/Lmsapp";

interface DecodedToken {
  exp: number;
  id: number;
  // Add other properties of the decoded token if needed
}

export default function App() {
  const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decodedToken.exp < currentTime || !decodedToken.id) {
        // Token is expired or user_id is not present
        localStorage.removeItem("token");
        return <Navigate to="/login" />;
      }
    }
    return token ? <AppLayout /> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<Lmsapp />} />
      </Route>
    </Routes>
  );
}
