import { studentApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { PublishedCourse } from "../types/app";
import LoadingBar from "@/components/LoadingBar";
import CourseCard from "../components/CourseCard";
import { useDispatch } from "react-redux";
import { setCourses } from "@/reducers/fullAppReducer";

const Home = () => {
  const dispatch = useDispatch();
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await studentApi.get(`/`);
      dispatch(setCourses(data));
      return data as PublishedCourse[];
    },
  });

  if (isLoading) return <LoadingBar />;
  return (
    <div className="grid grid-cols-3 gap-4 p-2 max-[870px]:grid-cols-2 max-[650px]:grid-cols-1">
      {courses?.map((course) => (
        <CourseCard course={course} key={course._id} />
      ))}
    </div>
  );
};

export default Home;
