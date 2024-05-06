import { CirclePause, CirclePlay } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { useFullApp } from "@/hooks/useFullApp";
import { studentApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const PaidChapterHeader = () => {
  const navigate = useNavigate();
  const { user, courses } = useFullApp();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const course = courses.find((crs) => crs._id === courseId);
  const currentChapterId = searchParams.get("chapterId");
  if (!user || !courseId || !course) return <Navigate to={"/"} />;

  const { data: chapters } = useQuery({
    queryKey: [`getPaidCourseChaptersTitles${courseId}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/paidCourse/${course._id}/chapterTitles`
      );

      return (data as { _id: string; title: string }[]) || [];
    },
  });
  return (
    <div className="flex gap-2 w-full">
      <div className="min-w-[250px] border-r-2 h-[92.3vh]  overflow-y-scroll scrollbar-none max-[750px]:hidden">
        {chapters?.map((chapter) => (
          <div
            key={chapter._id}
            className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer ${
              currentChapterId === chapter._id
                ? "dark:bg-gray-800  bg-gray-200 scale-105"
                : ""
            }`}>
            {currentChapterId === chapter._id ? (
              <CirclePlay />
            ) : (
              <CirclePause />
            )}
            <p
              className="font-pt-serif"
              onClick={() => {
                navigate(
                  `/paidCourse/chapter?courseId=${course._id}&chapterId=${chapter._id}`
                );
              }}>
              {chapter.title}
            </p>
          </div>
        ))}
      </div>
      <div className="min-[700px]:hidden">
        <Sheet>
          <SheetTrigger className="absolute right-0 top-[12.5px]">
            <div className="bg-black p-[8px] rounded-sm">
              <Menu size={22} />
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="overflow-y-scroll scrollbar-none w-[250px] p-0 ">
            <SheetClose className="my-6 " />
            {chapters?.map((chapter) => (
              <div
                key={chapter._id}
                className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer ${
                  currentChapterId === chapter._id
                    ? "dark:bg-gray-800  bg-gray-200 scale-105"
                    : ""
                }`}>
                {currentChapterId === chapter._id ? (
                  <CirclePlay />
                ) : (
                  <CirclePause />
                )}
                <p
                  className="font-pt-serif"
                  onClick={() => {
                    navigate(
                      `/paidCourse/chapter?courseId=${course._id}&chapterId=${chapter._id}`
                    );
                  }}>
                  {chapter.title}
                </p>
              </div>
            ))}
          </SheetContent>
        </Sheet>
      </div>
      <Outlet />
    </div>
  );
};

export default PaidChapterHeader;
