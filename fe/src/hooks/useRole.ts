// src/hooks/useUserRole.ts
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  role: string;
  exp: number;
  [key: string]: any;
}

const useUserRole = (): string => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log("decoded toke", decodedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("decoded toke 3", decodedToken);
          sessionStorage.removeItem("token");
          setRole(null);
          navigate("/login");
        } else {
          console.log("decoded toke 2", decodedToken);
          setRole(decodedToken.role);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setRole(null);
        navigate("/login");
      }
    } else {
      setRole(null);
      navigate("/login");
    }
  }, [navigate]);

  return role as string;
};

export default useUserRole;
