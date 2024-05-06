import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { TeacherCourses } from "../reducer/teacherReducer";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { teacherApi } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { ServerError } from "@/types/general";
import { useNavigate } from "react-router-dom";

interface TeacherCourseCardProps {
  course: TeacherCourses;
}

const TeacherCourseCard = ({ course }: TeacherCourseCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteCourse } = useMutation({
    mutationKey: [`deleteCourse${course._id}`],
    mutationFn: async () => {
      const { data } = await teacherApi.delete(`/deleteCourse/${course._id}`);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Course deleted Successfully",
      });
      queryClient.invalidateQueries([
        "getTeacherCourses",
        0,
      ] as InvalidateQueryFilters);
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message,
        variant: "destructive",
      });
    },
  });
  return (
    <Card className="h-fit">
      <CardHeader>
        <img src={course.thumbnail} className="w-full h-[200px] object-cover" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={"app"}>{course.category}</Badge>
          <Badge variant={"destructive"}>{course.status}</Badge>
        </div>
        <CardTitle className="my-1">{course.title}</CardTitle>
        <CardDescription>{course.description.slice(0, 100)}...</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button
          variant={"destructive"}
          className="w-full flex gap-2 items-center"
          onClick={() => deleteCourse()}>
          Delete
        </Button>
        <Button
          variant={"payment"}
          className="w-full flex gap-2 items-center"
          onClick={() => navigate(`detail/${course._id}`)}>
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherCourseCard;
