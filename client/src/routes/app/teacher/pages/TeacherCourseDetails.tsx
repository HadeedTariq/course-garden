import { teacherApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { CourseRevenue } from "../../types/app";
import { DollarSign } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";

const TeacherCourseDetails = () => {
  const { id } = useParams();

  if (!id) return <Navigate to={"/"} />;
  const { data: revenueDetails } = useQuery({
    queryKey: [`getTeacherCourseDetail${id}`],
    queryFn: async () => {
      const { data } = await teacherApi.get(`/course/revenue?courseId=${id}`);

      return data as CourseRevenue;
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="w-[220px] h-[100px] p-2 border-2 gap-3">
          <div className="flex items-center justify-between">
            <h3>Total Revenue</h3>
            <DollarSign size={17} />
          </div>
          <p className="font-semibold font-lato text-2xl">
            {revenueDetails?.totalRevenue}
          </p>
        </div>
        <div className="w-[220px] h-[100px] p-2 border-2 gap-3">
          <div className="flex items-center justify-between">
            <h3>Monthly Revenue</h3>
            <DollarSign size={17} />
          </div>
          <p className="font-semibold font-lato text-2xl">
            {revenueDetails?.monthlyRevenue}
          </p>
        </div>
      </div>
      <div className="w-[450px] h-[200px] overflow-y-scroll scrollbar-none p-2 border-2 gap-3">
        {revenueDetails?.purchaserDetails.map((pDetail) => (
          <div
            key={pDetail._id}
            className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src={pDetail.purchaserDetails.avatar}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <CardTitle>{pDetail.purchaserDetails.username}</CardTitle>
                <CardDescription>
                  {pDetail.purchaserDetails.email}
                </CardDescription>
              </div>
            </div>
            <CardTitle>{pDetail.price}</CardTitle>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourseDetails;
