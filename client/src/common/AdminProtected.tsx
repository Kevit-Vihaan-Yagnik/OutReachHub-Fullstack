// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "@/app/store";

interface Props {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { admin } = useSelector((state: RootState) => state.adminAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!admin) {
          navigate("/admin/login");
          return;
        }

      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [admin, navigate]);

  if (loading) return <div>Checking authentication...</div>;

  return <>{children}</>;
}
