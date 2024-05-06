import { Input } from "@/components/ui/input";
import axios from "axios";
import { ImageUp, LoaderCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
// import { ChapterSchema, CourseSchema } from "../validators/course.validator";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface ThumbnailUploaderProps {
  form: UseFormReturn<any, any, undefined>;
}

const ThumbnailUploader = ({ form }: ThumbnailUploaderProps) => {
  const { mutate: uploadImage, isPending } = useMutation({
    mutationKey: ["thumbnail"],
    mutationFn: async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files?.length < 1) return;
      const file = e.target.files[0];
      const FileForm = new FormData();
      FileForm.append("file", file);
      FileForm.append("cloud_name", "lmsproject");
      FileForm.append("upload_preset", "ogypr3xk");
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/lmsproject/image/upload",
        FileForm
      );
      setThumbnail(data.secure_url);
      form.setValue("thumbnail", data.secure_url);
    },
  });
  const [thumbnail, setThumbnail] = useState<null | string>(
    form.getValues("thumbnail")
  );

  return (
    <>
      {thumbnail ? (
        <img
          className="border-2  border-gray-400 w-full h-[300px] flex items-center justify-center gap-2"
          src={thumbnail}
        />
      ) : isPending ? (
        <div className="border-2  border-gray-400 w-full h-[200px] flex items-center justify-center gap-2">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : (
        <label
          htmlFor="imgUpload"
          className="border-2  border-gray-400 w-full h-[200px] flex items-center justify-center gap-2">
          <ImageUp />
          <Input
            onChange={(e) => uploadImage(e)}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            id="imgUpload"
            className="hidden"
          />
        </label>
      )}
    </>
  );
};

export default ThumbnailUploader;
