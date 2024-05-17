import { useFullApp } from "@/hooks/useFullApp";
import { Navigate, useSearchParams } from "react-router-dom";

import FreeCourseContent from "../components/FreeCourseContent";
import FeedbackHandler from "../student/components/FeedbackHandler";
import Feedbacks from "../student/components/Feedbacks";

const WatchCourse = () => {
  const { user, courses } = useFullApp();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const course = courses.find((crs) => crs._id === courseId);

  if (!user || !courseId || !course) return <Navigate to={"/"} />;
  return (
    <div className="flex flex-col gap-4 w-full">
      <FreeCourseContent course={course} />
      <FeedbackHandler courseId={courseId} />
      <Feedbacks courseId={courseId} />
    </div>
  );
};

export default WatchCourse;
