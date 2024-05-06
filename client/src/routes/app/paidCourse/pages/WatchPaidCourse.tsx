import { useFullApp } from "@/hooks/useFullApp";
import { Navigate, useSearchParams } from "react-router-dom";
import PaidCourseContent from "../components/PaidCourseContent";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/axios";
import { PublishedCourse } from "../../types/app";
import LoadingBar from "@/components/LoadingBar";
import { useDispatch } from "react-redux";
import { setPaidChapters } from "@/reducers/fullAppReducer";

const WatchPaidCourse = () => {
  const { user, courses } = useFullApp();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const courseExist = courses.find((crs) => crs._id === courseId);

  const {
    data: course,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`getPaidCourseContent${courseId}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/paidCourse/content?courseId=${courseId}`
      );
      dispatch(setPaidChapters(data[0].courseChapters));
      return data[0] as PublishedCourse;
    },
  });

  if (!user || !courseId || !courseExist) return <Navigate to={"/"} />;

  if (error) {
    return <Navigate to={"/"} />;
  }
  if (isLoading) return <LoadingBar />;
  return (
    <>
      <PaidCourseContent course={course!} />{" "}
    </>
  );
};

export default WatchPaidCourse;
