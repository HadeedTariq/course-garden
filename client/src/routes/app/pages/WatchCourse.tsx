import { useFullApp } from "@/hooks/useFullApp";
import { Navigate, useSearchParams } from "react-router-dom";

import FreeCourseContent from "../components/FreeCourseContent";

const WatchCourse = () => {
  const { user, courses } = useFullApp();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const course = courses.find((crs) => crs._id === courseId);

  if (!user || !courseId || !course) return <Navigate to={"/"} />;
  return (
    <>
      <FreeCourseContent course={course} />
    </>
  );
};

export default WatchCourse;
