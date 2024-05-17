import { feedbackApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Feedback } from "../../types/app";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RepliesHandler from "./RepliesHandler";

interface FeedbacksProps {
  courseId: string;
}

const Feedbacks = ({ courseId }: FeedbacksProps) => {
  const { isLoading, data: feedbacks } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const { data } = await feedbackApi.get(`?courseId=${courseId}`);
      return data as Feedback[];
    },
  });
  if (isLoading) return <Loader className="animate-spin h-5 w-5 mx-auto " />;
  return (
    <div className="flex flex-col gap-2">
      {feedbacks?.map((feed) => (
        <div key={feed._id} className="py-4 px-2">
          <div className="flex items-center mb-2">
            <img
              src={feed.user.avatar}
              alt={feed.user.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-semibold">{feed.user.username}</span>
          </div>
          <p>{feed.content}</p>
          <Accordion type="single" collapsible>
            <AccordionItem value="replies">
              <AccordionTrigger>Replies</AccordionTrigger>
              <AccordionContent>
                <RepliesHandler commentId={feed._id} />
              </AccordionContent>
              {feed.replies?.map(
                (reply) =>
                  reply?._id && (
                    <AccordionContent key={reply?._id}>
                      <div className="flex items-center mb-2">
                        <img
                          src={reply?.user.avatar}
                          alt={reply?.user.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-semibold">
                          {reply?.user.username}
                        </span>
                      </div>
                      <p>{reply?.content}</p>
                    </AccordionContent>
                  )
              )}
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default Feedbacks;
