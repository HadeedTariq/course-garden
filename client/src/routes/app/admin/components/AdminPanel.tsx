import { useFullApp } from "@/hooks/useFullApp";
import { adminApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import AdminDashboardSidebar from "./AdminSidebar";

const AdminPanel = () => {
  const { user } = useFullApp();

  if (!user) return <Navigate to={"/"} />;

  const { error, isLoading } = useQuery({
    queryKey: ["checkAdmin"],
    queryFn: async () => {
      const { data } = await adminApi.get("/checkAdmin");
      return data;
    },
  });
  if (isLoading) return <Loader className="animate-spin h-5 w-5 mx-auto " />;
  if (error) return <Navigate to={"/"} />;
  return (
    <>
      <AdminDashboardSidebar />
    </>
  );
};

export default AdminPanel;
