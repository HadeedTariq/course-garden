import { toast } from "@/components/ui/use-toast";
import { studentApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const PaymentSuccessFull = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  if (!id || !courseId) return <Navigate to={"/"} />;
  const { data, isError } = useQuery({
    queryKey: ["paymentSuccessfull"],
    queryFn: async () => {
      const { data } = await studentApi.post("/course/paymentSucceed", {
        courseId,
        id,
      });
      return data;
    },
  });
  if (isError) {
    toast({
      title: "Something went wrong",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-8">Thank you for your payment.</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => navigate("/")}>
        Continue Purchasing
      </button>
    </div>
  );
};

export default PaymentSuccessFull;
