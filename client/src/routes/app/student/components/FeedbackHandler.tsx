import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { feedbackApi } from "@/lib/axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { ServerError } from "@/types/general";

const FormSchema = z.object({
  content: z.string().min(12, {
    message: "Feedback must be 12 characters long",
  }),
});
type FormSchemaType = z.infer<typeof FormSchema>;

interface FeedbackHandlerProps {
  courseId: string;
}

function FeedbackHandler({ courseId }: FeedbackHandlerProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });
  const { mutate: postFeedback, isPending } = useMutation({
    mutationKey: ["postFeedback"],
    mutationFn: async (feedback: FormSchemaType) => {
      const { data } = await feedbackApi.post("/create", {
        content: feedback.content,
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
        title: data.message || "Feedback Crteated successfully",
      });
      form.reset();
      queryClient.invalidateQueries(["feedbacks", 0] as InvalidateQueryFilters);
    },
  });

  const onSubmit = (form: FormSchemaType) => {
    postFeedback(form);
  };
  return (
    <>
      <form
        className="flex w-full px-2 items-center gap-3"
        onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          type="text"
          className={`${
            form.formState.errors.content?.message ? "outline-red-400" : ""
          }`}
          placeholder="Feedback"
          {...form.register("content")}
        />
        <Button type="submit" disabled={isPending}>
          Post
        </Button>
      </form>
      <p className="mx-3 text-red-500 font-ubuntu">
        {form.formState.errors.content?.message}
      </p>
    </>
  );
}

export default FeedbackHandler;
