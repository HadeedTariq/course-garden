import LoadingBar from "@/components/LoadingBar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFullApp } from "@/hooks/useFullApp";
import { studentApi } from "@/lib/axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import ReactPlayer from "react-player";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import ConfettiEffect from "../../components/ConfettiEffect";
import { useState } from "react";

interface ProgressType {
  loaded: number;
  loadedSeconds: number;
  played: number;
  playedSeconds: number;
}

const PaidChapterContent = () => {
  const queryClient = useQueryClient();
  const { user, paidChapters } = useFullApp();
  const [chapterStatusCode, setChapterStatusCode] = useState(0);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const chapterId = searchParams.get("chapterId");

  const chapter = paidChapters?.find((chp) => chp._id === chapterId);

  if (!courseId || !chapterId || !user || !chapter || !paidChapters)
    return <Navigate to={"/"} />;
  const chapterIndex = paidChapters.indexOf(chapter);

  const { data, isLoading } = useQuery({
    queryKey: [`${chapterId}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/course/myCompletedChapters?courseId=${courseId}`
      );

      const thisChapterId = data?.find((chp: string) => chp === chapterId);
      return thisChapterId as string;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [`completeChapter${chapterId}`],
    mutationFn: async () => {
      const { status, data } = await studentApi.put(
        `/course/completeChapter?courseId=${courseId}&chapterId=${chapterId}`
      );
      setChapterStatusCode(status);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Chapter Completed successfully",
      });
      const nextChapterId = paidChapters[chapterIndex + 1]._id;
      if (nextChapterId) {
        navigate(`?courseId=${courseId}&chapterId=${nextChapterId}`);
      } else {
        queryClient.invalidateQueries([
          `${chapterId}`,
          0,
        ] as InvalidateQueryFilters);
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
      {chapterStatusCode === 201 && <ConfettiEffect />}
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

export default PaidChapterContent;
