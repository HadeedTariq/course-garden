import { teacherApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  TeacherCourses as TeacherCoursesType,
  setTeacherCourses,
} from "../reducer/teacherReducer";
import TeacherCourseCard from "../components/TeacherCourseCard";

const TeacherCourses = () => {
  const dispatch = useDispatch();
  const { data: courses } = useQuery({
    queryKey: ["getTeacherCourses"],
    queryFn: async () => {
      const { data } = await teacherApi.get("/course/myCourses");
      dispatch(setTeacherCourses(data));
      return data as TeacherCoursesType[];
    },
  });
  return (
    <div className="grid grid-cols-3 gap-4 p-2 max-[870px]:grid-cols-2 max-[650px]:grid-cols-1">
      {courses?.map((course) => (
        <TeacherCourseCard course={course} key={course._id} />
      ))}
    </div>
  );
};

export default TeacherCourses;
