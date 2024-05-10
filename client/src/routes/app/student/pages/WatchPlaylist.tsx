import { useFullApp } from "@/hooks/useFullApp";
import { Navigate, useParams } from "react-router-dom";
import CourseCard from "../../components/CourseCard";

const WatchPlaylist = () => {
  const { playlistId } = useParams();

  const { courses, playlists } = useFullApp();
  const playlistExist = playlists.find((pl) => pl._id === playlistId);

  if (!playlistId || playlistId.length < 23 || !playlistExist)
    return <Navigate to={"/"} />;
  const playlistCourses = courses.filter((crs) =>
    playlistExist.courses.includes(crs._id)
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-2 max-[870px]:grid-cols-1 max-[650px]:grid-cols-1">
      {playlistCourses?.map((course) => (
        <CourseCard course={course} key={course._id} />
      ))}
    </div>
  );
};

export default WatchPlaylist;
