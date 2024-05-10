import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ListVideo, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { playlistApi } from "@/lib/axios";
import { ServerError } from "@/types/general";
import { PlaylistData } from "@/routes/app/types/app";
import UpdatePlaylist from "./UpdatePlaylist";
import { Input } from "./ui/input";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "Playlist name must be at least 4 characters.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;
type CreatePlaylistProps = {
  courseId: string;
};

const CreatePlaylist = ({ courseId }: CreatePlaylistProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const [newPlaylist, setNewPlaylist] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createPlaylist, isPending } = useMutation({
    mutationKey: ["createPlaylist"],
    mutationFn: async (playlist: FormSchemaType) => {
      const { data } = await playlistApi.post("/create", {
        name: playlist.name,
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
        title: data.message || "Playlist Crteated successfully",
      });
      setNewPlaylist(false);
      form.reset();
      queryClient.invalidateQueries([
        "myPlaylists",
        0,
      ] as InvalidateQueryFilters);
    },
  });

  const onSubmit = (form: FormSchemaType) => {
    createPlaylist(form);
  };

  const { isLoading, data: myPlaylists } = useQuery({
    queryKey: ["myPlaylists"],
    queryFn: async () => {
      const { data } = await playlistApi.get("/myPlaylists");
      return data as PlaylistData[];
    },
  });

  useEffect(() => {
    setSelectedOption("");
  }, [myPlaylists]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <ListVideo
            cursor={"pointer"}
            className="hover:text-orange-500 transition duration-300"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {!newPlaylist && (
          <AlertDialogHeader>
            <AlertDialogTitle>Add To Existing Playlist</AlertDialogTitle>
            {isLoading && <Loader className="animate-spin h-5 w-5 mx-auto " />}
            {myPlaylists?.map((playlist) => (
              <>
                <div key={playlist._id} className="gap-2 flex items-center">
                  <Input
                    type={"radio"}
                    id={playlist._id}
                    name="options"
                    value={playlist.name}
                    defaultChecked={playlist.courses.includes(courseId)}
                    checked={selectedOption === playlist.name}
                    readOnly={playlist.courses.includes(courseId)}
                    disabled={playlist.courses.includes(courseId)}
                    className="form-radio h-3 w-5 text-indigo-600 disabled:text-orange-600"
                    onClick={() => setSelectedOption(playlist.name)}
                    onChange={() => {}}
                  />
                  <label
                    htmlFor={playlist._id}
                    className="ml-2 text-[18px] font-ubuntu cursor-pointer dark:text-gray-300 disabled:cursor-not-allowed">
                    {playlist.name}
                  </label>
                  {selectedOption === playlist.name && (
                    <UpdatePlaylist
                      courseId={courseId}
                      playlistId={playlist._id}
                    />
                  )}
                </div>
              </>
            ))}
          </AlertDialogHeader>
        )}
        {newPlaylist && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Playlist</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="playlist name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                Create
              </Button>
            </form>
          </Form>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setNewPlaylist(false)}>
            Cancel
          </AlertDialogCancel>
          {!newPlaylist && (
            <Button onClick={() => setNewPlaylist(true)}>Create New</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreatePlaylist;
