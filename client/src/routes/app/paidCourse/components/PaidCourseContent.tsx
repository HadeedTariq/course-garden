import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/axios";
import LoadingBar from "@/components/LoadingBar";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { PublishedCourse } from "../../types/app";

interface FreeCourseContentProps {
  course: PublishedCourse;
}

interface FreeCourseContentPoints {
  courseId: string;
  chapters: string[];
  user: string;
  _id: string;
  points: number;
}

const PaidCourseContent = ({ course }: FreeCourseContentProps) => {
  const navigate = useNavigate();
  const { isLoading, data } = useQuery({
    queryKey: [`coursePoints${course._id}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/course/coursePoints?courseId=${course._id}`
      );

      return data ? (data as FreeCourseContentPoints) : undefined;
    },
  });

  const continueToCourse = () => {
    if (data) {
      const lastWatchedChapter = data.chapters.reverse()[0];
      if (lastWatchedChapter) {
        navigate(
          `chapter?courseId=${course._id}&chapterId=${lastWatchedChapter}`
        );
      } else {
        navigate(
          `chapter?courseId=${course._id}&chapterId=${course.courseChapters[0]._id}`
        );
      }
    }
  };

  const { isPending, mutate: enrollInCourse } = useMutation({
    mutationKey: ["enrollInPaidCourse"],
    mutationFn: async () => {
      const { data } = await studentApi.post(
        `/course/enroll/paidCourse?courseId=${course._id}`
      );
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Successfully enrolled in your purchased course",
      });
      navigate(
        `chapter?courseId=${course._id}&chapterId=${course.courseChapters[0]._id}`
      );
    },
  });

  if (isLoading) return <LoadingBar />;
  return (
    <div className="w-full flex flex-col gap-3">
      <img src={course.thumbnail} className="w-full h-[500px] object-cover " />
      <h2 className="font-roboto-mono text-[25px] font-semibold">
        {course.title}
      </h2>
      <p className="font-lato text-[16px]">{course.description}</p>
      {data === undefined ? (
        <Button
          className="font-ubuntu font-semibold"
          onClick={() => enrollInCourse()}
          disabled={isPending}>
          Start Watching
        </Button>
      ) : (
        <Button
          className="font-ubuntu font-semibold"
          onClick={continueToCourse}>
          Continue Watching
        </Button>
      )}
    </div>
  );
};

export default PaidCourseContent;
