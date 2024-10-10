import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const PrivateRoutes = () => {
  const token = sessionStorage.getItem("token");

  const isTokenValid = (token: string | null) => {
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      console.log("decoded", decodedToken);
      const isExpired = decodedToken.exp < Date.now() / 1000;
      return !isExpired;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };
  const auth = isTokenValid(token);

  return auth ? <Outlet /> : <Navigate to="/login" />;
};
