import { CirclePause, CirclePlay } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useFullApp } from "@/hooks/useFullApp";
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const FreeChapterHeader = () => {
  const navigate = useNavigate();
  const { user, courses } = useFullApp();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const currentChapterId = searchParams.get("chapterId");
  const course = courses.find((crs) => crs._id === courseId);

  if (!user || !courseId || !course) return <Navigate to={"/"} />;
  const chapterTitles = course.courseChapters?.map((chp) => chp.title);
  return (
    <div className="flex gap-2 w-full">
      <div className="relative min-w-[250px] max-[750px]:hidden">
        <div className="w-[250px] fixed border-r-2 h-[92.3vh]  overflow-y-scroll scrollbar-none max-[750px]:hidden">
          {chapterTitles?.map((title, index) => (
            <div
              key={course.courseChapters[index]._id}
              className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer ${
                currentChapterId === course.courseChapters[index]._id
                  ? "dark:bg-gray-800  bg-gray-200 scale-105"
                  : ""
              }`}>
              {currentChapterId === course.courseChapters[index]._id ? (
                <CirclePlay />
              ) : (
                <CirclePause />
              )}
              <p
                className="font-pt-serif"
                onClick={() => {
                  navigate(
                    `/course/chapter?courseId=${course._id}&chapterId=${course.courseChapters[index]._id}`
                  );
                }}>
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="min-[750px]:hidden">
        <Sheet>
          <SheetTrigger className="min-[750px]:hidden">
            <div className="bg-black p-[8px] rounded-sm">
              <Menu size={22} color="white" />
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="overflow-y-scroll scrollbar-none w-[250px] p-0 ">
            <SheetClose className="my-6 " />
            {chapterTitles?.map((title, index) => (
              <div
                key={course.courseChapters[index]._id}
                className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer ${
                  currentChapterId === course.courseChapters[index]._id
                    ? "dark:bg-gray-800  bg-gray-200 scale-105"
                    : ""
                }`}>
                {currentChapterId === course.courseChapters[index]._id ? (
                  <CirclePlay />
                ) : (
                  <CirclePause />
                )}
                <p
                  className="font-pt-serif"
                  onClick={() => {
                    navigate(
                      `?courseId=${course._id}&chapterId=${course.courseChapters[index]._id}`
                    );
                  }}>
                  {title}
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

export default FreeChapterHeader;
