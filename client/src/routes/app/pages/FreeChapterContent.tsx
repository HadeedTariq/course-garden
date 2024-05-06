import LoadingBar from "@/components/LoadingBar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFullApp } from "@/hooks/useFullApp";
import { studentApi } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

import ReactPlayer from "react-player";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

interface ProgressType {
  loaded: number;
  loadedSeconds: number;
  played: number;
  playedSeconds: number;
}

const FreeChapterContent = () => {
  const { user, courses } = useFullApp();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  const course = courses.find((crs) => crs._id === courseId);
  const chapter = course?.courseChapters.find((chp) => chp._id === chapterId);

  if (!courseId || !chapterId || !course || !user || !chapter)
    return <Navigate to={"/"} />;
  const chapterIndex = course?.courseChapters.indexOf(chapter);

  const { data, isLoading } = useQuery({
    queryKey: [`${chapterId}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/course/myCompletedChapters?courseId=${courseId}`
      );
      const thisChapterId = data.find((chp: string) => chp === chapterId);
      return thisChapterId as string;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["completeChapter"],
    mutationFn: async () => {
      const { data } = await studentApi.put(
        `/course/completeChapter?courseId=${courseId}&chapterId=${chapterId}`
      );

      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: data.message || "Chapter Completed successfully",
      });
      const chapterId = course.courseChapters[chapterIndex + 1]._id;

      if (chapterId) {
        navigate(`?courseId=${courseId}&chapterId=${chapterId}`);
      }
    },
  });

  const completeChapter = () => {
    const videoProgress = JSON.parse(
      localStorage.getItem(`${chapterId}`) as any
    ) as ProgressType;

    if (videoProgress.loadedSeconds === videoProgress.playedSeconds) {
      mutate();
    } else {
      toast({
        title: "Please watch the full video",
      });
    }
  };

  const handleProgress = (progress: ProgressType) => {
    localStorage.setItem(
      `${chapterId}`,
      JSON.stringify({
        courseId: courseId,
        chapterId: chapterId,
        ...progress,
      })
    );
  };

  if (isLoading) return <LoadingBar />;
  return (
    <div className="flex flex-col gap-y-3">
      <ReactPlayer
        url={chapter.video}
        controls
        width={"100%"}
        height={600}
        onProgress={handleProgress}
      />
      {data !== undefined ? (
        <Button variant={"app"} disabled>
          Chapter Completed
        </Button>
      ) : (
        <Button variant={"app"} disabled={isPending} onClick={completeChapter}>
          Complete Chapter
        </Button>
      )}
    </div>
  );
};

export default FreeChapterContent;
