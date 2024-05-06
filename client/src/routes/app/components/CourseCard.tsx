import { Badge } from "@/components/ui/badge";
import { PublishedCourse } from "../types/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFullApp } from "@/hooks/useFullApp";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Strikethrough } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/axios";

interface CourseCardProps {
  course: PublishedCourse;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { user } = useFullApp();
  const navigate = useNavigate();

  const { data: myPurchasedCourses } = useQuery({
    queryKey: [`getUserPurchasedCourse${course._id}`],
    queryFn: async () => {
      const { data } = await studentApi.get("/course/myPurchasedCourses");
      console.log(data);

      return (data as string[]) || undefined;
    },
  });

  const watchCourse = () => {
    if (!user) {
      toast({ title: "Please authenticate to watch this course" });
      return;
    }
    if (course.status === "paid" && !myPurchasedCourses?.includes(course._id)) {
      toast({
        title: "Please purchase this course to watch",
        variant: "destructive",
      });
      return;
    }
    if (course.status === "paid" && myPurchasedCourses?.includes(course._id)) {
      navigate(`/paidCourse?courseId=${course._id}`);
    } else {
      navigate(`/course?courseId=${course._id}`);
    }
  };
  return (
    <Card>
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
        <div className="flex items-center gap-2">
          <img
            src={course.teacher.avatar}
            className="w-[25px] h-[25px] rounded-full"
          />
          <p>{course.teacher.username.toUpperCase()}</p>
        </div>
        <Button
          variant={"app"}
          className="w-full flex gap-2 items-center"
          onClick={watchCourse}>
          {course.status === "paid" &&
            !myPurchasedCourses?.includes(course._id) && (
              <Lock size={15} fontWeight={200} />
            )}
          Watch
        </Button>
        {course.status === "paid" &&
          !myPurchasedCourses?.includes(course._id) && (
            <Button
              variant={"payment"}
              className="w-full flex gap-2 items-center"
              onClick={() =>
                navigate(`/course/purchase?courseId=${course._id}`)
              }>
              <Strikethrough />
              Pay
            </Button>
          )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
