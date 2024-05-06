import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PublishSchema,
  publishValidator,
} from "../validators/course.validator";
import ChapterCreator from "./ChapterCreator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { teacherApi } from "@/lib/axios";
import { CourseType, ServerError } from "@/types/general";
import { useToast } from "@/components/ui/use-toast";

const PublishCourse = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: course, refetch } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const { data } = await teacherApi.get(`/course/${id}`);
      return data as CourseType;
    },
  });
  const form = useForm<PublishSchema>({
    resolver: zodResolver(publishValidator),
    values: {
      chapters: course?.chapters || [],
      status: course?.status || "free",
      totalChapters: (course && course.totalChapters) || 0,
      price: course?.price || "",
    },
  });
  const { mutate: publishCourse, isPending } = useMutation({
    mutationKey: ["publishCourse"],
    mutationFn: async (publishAbleCourse: PublishSchema) => {
      const { data } = await teacherApi.post("/course/publish", {
        ...publishAbleCourse,
        courseId: id,
      });
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Course Published successfully",
      });
      navigate("/");
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message || "Something went wrong",
      });
    },
  });

  const onSubmit = (publisableCourse: PublishSchema) => {
    if (course?.chapters.length === totalChapters) {
      publishCourse(publisableCourse);
    } else {
      toast({
        title: "Please fill all the chapter fields",
      });
    }
  };

  const totalChapters = form.watch("totalChapters") as number;
  const status = form.watch("status");

  // console.log(form.formState.errors);

  if (!id) return <Navigate to={"/"} />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
        <FormField
          control={form.control}
          name="totalChapters"
          render={() => (
            <FormItem>
              <FormLabel>Total Chapters</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="total Chapters"
                  value={totalChapters}
                  onChange={(e) => {
                    form.setValue("totalChapters", Number(e.target.value));
                    refetch();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: totalChapters }).map((_, index) => (
            <ChapterCreator
              chapter={course?.chapters[index] || undefined}
              totalChapters={totalChapters}
              key={index}
              courseId={id}
              publishForm={form}
              chapterNumber={index + 1}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {status === "paid" && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Select course price in $"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          variant={"app"}
          disabled={isPending || course?.isPublish}>
          {course?.isPublish ? "Publihed" : "Publish"}
        </Button>
      </form>
    </Form>
  );
};

export default PublishCourse;
