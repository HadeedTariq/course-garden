import { useFullApp } from "@/hooks/useFullApp";
import { Navigate, useSearchParams } from "react-router-dom";
import CouponCodeChecker from "../components/CouponCodeChecker";

const PurchaseCourse = () => {
  const { courses, user } = useFullApp();

  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");

  const course = courses?.find((crs) => crs._id === courseId);

  if (!courseId || !course || !user) return <Navigate to={"/"} />;

  return (
    <div className="flex  gap-x-2 max-[795px]:flex-col">
      <div className="flex flex-col gap-2 w-[70%] max-[795px]:w-full p-2">
        <img src={course.thumbnail} className="w-full h-[500px] object-cover" />
        <h2 className="font-pt-serif text-2xl font-semibold">{course.title}</h2>
        <p className="font-pt-serif text-[18px] font-semibold">
          {course.description}
        </p>
      </div>
      <div className="w-[300px] max-[795px]:w-full max-[795px]:dark:bg-zinc-800  bg-[#5230db] text-white flex flex-col justify-center gap-3 p-2  rounded-md h-[500px]">
        <h4 className="text-2xl font-lato text-center">
          Have a coupon code Apply Here
        </h4>

        <CouponCodeChecker courseId={courseId} price={course?.price} />
      </div>
    </div>
  );
};

export default PurchaseCourse;
