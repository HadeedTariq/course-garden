import { useFullApp } from "@/hooks/useFullApp";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { CircleChevronRight } from "lucide-react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const TeacherDashboardSidebar = () => {
  const { user } = useFullApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const dashboardHeaders = [
    {
      name: "Home",
      path: "",
    },
    {
      name: "Courses",
      path: "courses",
    },
    {
      name: "Stats",
      path: "stats",
    },
  ];
  console.log(pathname);

  if (user?.role !== "teacher") return <Navigate to={"/"} />;
  return (
    <div className="flex gap-2 w-full">
      <div className="min-w-[250px] border-r-2 h-[92.3vh]  overflow-y-scroll scrollbar-none max-[750px]:hidden">
        {dashboardHeaders?.map((header, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/teacher/dashboard/${header.path}`);
            }}
            className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer
            ${
              pathname === `/teacher/dashboard/${header.path}`
                ? "dark:bg-gray-800  bg-gray-200 scale-105"
                : ""
            }
            
            `}>
            <p
              className="font-pt-serif"
              onClick={() => {
                navigate(`/teacher/dashboard/${header.path}`);
              }}>
              {header.name}
            </p>
          </div>
        ))}
      </div>
      <div className="min-[700px]:hidden">
        <Sheet>
          <SheetTrigger className="absolute left-0 ">
            <div className="bg-black p-[8px] rounded-sm">
              <CircleChevronRight size={22} />
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="overflow-y-scroll scrollbar-none w-[250px] p-0 ">
            <SheetClose className="my-6 " />
            {dashboardHeaders?.map((header, index) => (
              <SheetClose
                asChild
                key={index}
                onClick={() => {
                  navigate(`/teacher/dashboard/${header.path}`);
                }}
                className={`w-[250px] flex items-center gap-2 border p-2 py-4 cursor-pointer
                ${
                  pathname === `/teacher/dashboard/${header.path}`
                    ? "dark:bg-gray-800  bg-gray-200 scale-105"
                    : ""
                }
            `}>
                <p className="font-pt-serif">{header.name}</p>
              </SheetClose>
            ))}
          </SheetContent>
        </Sheet>
      </div>
      <Outlet />
    </div>
  );
};

export default TeacherDashboardSidebar;
