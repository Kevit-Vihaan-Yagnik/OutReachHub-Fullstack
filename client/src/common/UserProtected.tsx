import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "@/app/store";

interface Props {
  children: React.ReactNode;
}

export default function UserProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userAuth);
  const [loading, setLoading] = useState(true);
  const userAuth = localStorage.getItem('userAuth');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user || !userAuth) {
          navigate("/user/login"); // 👈 redirect to user login if not authenticated
          return;
        }
      } catch (error) {
        console.error("User auth check failed:", error);
        navigate("/user/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate]);

  if (loading) return <div>Checking authentication...</div>;

  return <>{children}</>;
}
