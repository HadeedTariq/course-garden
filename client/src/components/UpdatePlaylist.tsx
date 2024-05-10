import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "./ui/button";
import { playlistApi } from "@/lib/axios";
import { ServerError } from "@/types/general";
import { toast } from "./ui/use-toast";

interface UpdatePlaylistProps {
  playlistId: string;
  courseId: string;
}

const UpdatePlaylist = ({ courseId, playlistId }: UpdatePlaylistProps) => {
  const queryClient = useQueryClient();
  const { mutate: updatePlaylist, isPending } = useMutation({
    mutationKey: ["createPlaylist"],
    mutationFn: async () => {
      const { data } = await playlistApi.put("/update", {
        playlistId,
        courseId,
      });
      return data;
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Playlist Updated successfully",
      });
      queryClient.invalidateQueries([
        "myPlaylists",
        0,
      ] as InvalidateQueryFilters);
    },
  });
  return (
    <Button
      className="mx-4 "
      variant={"app"}
      onClick={() => updatePlaylist()}
      disabled={isPending}>
      Add
    </Button>
  );
};

export default UpdatePlaylist;
