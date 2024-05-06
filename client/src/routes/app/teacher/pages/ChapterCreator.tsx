import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  ChapterSchema,
  PublishSchema,
  chapterValidator,
} from "../validators/course.validator";

import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import ThumbnailUploader from "../components/ThumbnailUploader";
import VideoUploader from "../components/VideoUploader";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { chapterApi } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { ChapterType, ServerError } from "@/types/general";

interface ChapterCreatorProps {
  chapter: ChapterType | undefined;
  courseId: string;
  publishForm: UseFormReturn<PublishSchema, any, undefined>;
  chapterNumber: number;
  totalChapters: number;
}

const ChapterCreator = ({
  chapterNumber,
  courseId,
  totalChapters,
  chapter,
}: ChapterCreatorProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<ChapterSchema>({
    resolver: zodResolver(chapterValidator),
    values: {
      chapterNumber: chapterNumber,
      courseId: courseId,
      description: chapter?.description || "",
      thumbnail: chapter?.thumbnail || "",
      title: chapter?.title || "",
      video: chapter?.video || "",
    },
  });

  const { mutate: createChapter, isPending } = useMutation({
    mutationKey: ["uploadChapter"],
    mutationFn: async (chapter: ChapterSchema) => {
      const { data } = await chapterApi.post("/create", {
        ...chapter,
        totalChapters: totalChapters,
      });
      return data.chapterId;
    },
    onSuccess: () => {
      toast({
        title: "Chapter created successfully",
      });
      queryClient.invalidateQueries([courseId, 0] as InvalidateQueryFilters);
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (chapter: ChapterSchema) => {
    createChapter(chapter);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Chapter {chapterNumber}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[400px] overflow-y-scroll scrollbar-none">
        <DialogHeader>
          <DialogTitle>Chapter {chapterNumber}</DialogTitle>
          <DialogDescription>
            Create the chapter. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <FormLabel
                className={`${
                  form.formState.errors.thumbnail ? "text-red-400" : ""
                }`}>
                Thumbnail
              </FormLabel>
              <ThumbnailUploader form={form} />
              {form.formState.errors.thumbnail && (
                <p className="text-red-400 text-[14px] font-bold">
                  {form.formState.errors.thumbnail.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <FormLabel
                className={`${
                  form.formState.errors.video ? "text-red-400" : ""
                }`}>
                Video
              </FormLabel>
              <VideoUploader form={form} />
            </div>
            <Button
              type="submit"
              variant={"app"}
              disabled={isPending || chapter !== undefined}>
              {chapter ? "Created" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterCreator;
