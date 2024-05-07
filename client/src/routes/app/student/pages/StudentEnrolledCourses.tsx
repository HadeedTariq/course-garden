import LoadingBar from "@/components/LoadingBar";
import { useFullApp } from "@/hooks/useFullApp";
import { studentApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";

const StudentEnrolledCourses = () => {
  const { courses } = useFullApp();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["getEnrolledCourses"],
    queryFn: async () => {
      const { data } = await studentApi.get("/courses/all");
      const courseIds = data.map((points: any) => points.courseId);
      return courseIds as string[];
    },
  });
  if (isError) return <Navigate to={"/"} />;
  if (isLoading) return <LoadingBar />;
  const enrollCourses = courses.filter((crs) => data?.includes(crs._id) && crs);

  console.log(enrollCourses);

  return (
    <div className="grid grid-cols-2 gap-4 p-2 max-[870px]:grid-cols-1 max-[650px]:grid-cols-1">
      {enrollCourses?.map((course) => (
        <CourseCard course={course} key={course._id} />
      ))}
    </div>
  );
};

export default StudentEnrolledCourses;
