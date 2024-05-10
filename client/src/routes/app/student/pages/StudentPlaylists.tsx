import { playlistApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { PlaylistData } from "../../types/app";
import LoadingBar from "@/components/LoadingBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlaylists } from "@/reducers/fullAppReducer";

const StudentPlaylists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, data: myPlaylists } = useQuery({
    queryKey: ["myPlaylists"],
    queryFn: async () => {
      const { data } = await playlistApi.get("/myPlaylists");
      dispatch(setPlaylists(data));
      return data as PlaylistData[];
    },
  });

  if (isLoading) return <LoadingBar />;
  return (
    <div className="grid grid-cols-3 gap-4 mx-8 max-[550px]:grid-cols-2">
      {myPlaylists?.map((playlist) => (
        <div
          key={playlist._id}
          className="flex flex-col cursor-pointer"
          onClick={() => navigate(`watch/${playlist._id}`)}>
          <div className="relative">
            <img src={playlist.thumbnail} className="rounded-md" />
            <p className="text-[17px] font-lato absolute bottom-0 rounded-md bg-slate-800 w-full text-center text-white p-1">
              {playlist.courses.length}
            </p>
          </div>
          <p className="text-[19px] font-ubuntu">{playlist.name}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentPlaylists;
