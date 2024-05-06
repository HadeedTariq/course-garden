import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { CourseSchema, courseValidator } from "../validators/course.validator";
import ThumbnailUploader from "../components/ThumbnailUploader";
import { teacherApi } from "@/lib/axios";
import { categories } from "@/lib/category";

export function CreateCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseValidator),
  });

  const { mutate: createCourse, isPending } = useMutation({
    mutationKey: ["createCourse"],
    mutationFn: async (course: CourseSchema) => {
      const { data } = await teacherApi.post("/createCourse", course);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Course Created Successfully",
        variant: "default",
      });
      navigate(data._id);
    },
  });

  const onSubmit = (course: CourseSchema) => {
    createCourse(course);
  };

  const quantity = form.watch("couponCode.quantity");
  console.log(quantity);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category, i) => (
                    <SelectItem value={category} key={i}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="couponCode.coupon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input placeholder="coupon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="couponCode.quantity"
            render={() => (
              <FormItem>
                <FormLabel>Coupon Code Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="quantity"
                    type="number"
                    onChange={(e) =>
                      form.setValue(
                        "couponCode.quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <Button disabled={isPending} type="submit" variant={"app"}>
          Create
        </Button>
      </form>
    </Form>
  );
}
