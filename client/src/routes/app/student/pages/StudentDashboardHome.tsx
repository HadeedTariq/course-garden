import LoadingBar from "@/components/LoadingBar";
import { useFullApp } from "@/hooks/useFullApp";
import { studentApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import TeacherRequestHandler from "../components/TeacherRequestHandler";

interface Points {
  totalPoints: number;
}

const StudentDashboardHome = () => {
  const { user } = useFullApp();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentCoursePoints"],
    queryFn: async () => {
      const { data } = await studentApi.get("/courses/allPoints");
      return data as Points;
    },
  });

  if (isLoading) return <LoadingBar />;
  if (isError) return <Navigate to={"/"} />;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between  items-center border-b-2 w-full py-2">
        <div className="flex items-center max-[500px]:hidden gap-2">
          <img src={user?.avatar} className="w-12 h-12 rounded-full" />
          <p className="font-roboto-mono capitalize text-xl">
            {user?.username}
          </p>
        </div>
        <p className="font-ubuntu text-xl text-orange-500">
          <span className="font-pt-serif text-[19px] dark:text-white text-black">
            Total Points:
          </span>{" "}
          {data?.totalPoints}
        </p>
        <TeacherRequestHandler userId={user?.id as string} />
      </div>
    </div>
  );
};

export default StudentDashboardHome;
