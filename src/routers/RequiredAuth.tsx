import { Navigate, Outlet, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import { getUserInfor } from "../services/apiUser1";

interface RequireAuthAndRoleProps {
  allowedRoles?: string[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthAndRoleProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token && !isTokenExpired(token)) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await getUserInfor(config);
          setUser(response.data);

          // Lưu thông tin người dùng vào localStorage với key là "user"
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRoles = user.roles || [];
    const hasPermission = userRoles.some((role: string) => allowedRoles.includes(role));

    if (!hasPermission) {
      return <Navigate to="/authorize" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}
