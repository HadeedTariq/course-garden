import { ChapterSchema } from "../validators/course.validator";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { LoaderCircle, Video } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactPlayer from "react-player";

interface VideoUploaderProps {
  form: UseFormReturn<ChapterSchema, any, undefined>;
}
const VideoUploader = ({ form }: VideoUploaderProps) => {
  const [video, setVideo] = useState<null | string>(form.getValues("video"));
  const { mutate: uploadVideo, isPending } = useMutation({
    mutationKey: ["video"],
    mutationFn: async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files?.length < 1) return;
      const file = e.target.files[0];
      const FileForm = new FormData();
      FileForm.append("file", file);
      FileForm.append("cloud_name", "lmsproject");
      FileForm.append("upload_preset", "ogypr3xk");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/lmsproject/video/upload",
        FileForm
      );
      setVideo(data.secure_url);
      console.log(data.secure_url);
      form.setValue("video", data.secure_url);
    },
  });

  return (
    <>
      {video ? (
        <ReactPlayer width={390} url={video} height={390} controls />
      ) : isPending ? (
        <div className="border-2  border-gray-400 w-full h-[200px] flex items-center justify-center gap-2">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <label
          htmlFor="videoUpload"
          className="border-2  border-gray-400 w-full h-[200px] flex items-center justify-center gap-2">
          <Video />
          <Input
            onChange={(e) => uploadVideo(e)}
            type="file"
            accept="video/*"
            id="videoUpload"
            className="hidden"
          />
        </label>
      )}
    </>
  );
};

export default VideoUploader;
