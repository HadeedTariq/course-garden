import LoadingBar from "@/components/LoadingBar";
import { studentApi } from "@/lib/axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface StudentNotificationsData {
  user: string;
  message: string;
  read: boolean;
  _id: string;
}

const StudentNotifications = () => {
  const queryClient = useQueryClient();

  const { data: studentNotifications, isLoading } = useQuery({
    queryKey: ["studentNotifications"],
    queryFn: async () => {
      const { data } = await studentApi.get("/notifications");
      return data as StudentNotificationsData[];
    },
  });

  const { isPending, mutate: readNotification } = useMutation({
    mutationKey: ["readNotification"],
    mutationFn: async (notificationId: string) => {
      const { data } = await studentApi.post("/notification/read", {
        notificationId,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Notification readed",
      });
      queryClient.invalidateQueries([
        "studentNotifications",
        0,
      ] as InvalidateQueryFilters);
    },
  });

  if (isLoading) return <LoadingBar />;
  return (
    <>
      {studentNotifications?.map((notification, index) => (
        <Card className="col-span-2 w-full" key={notification._id}>
          <CardHeader className="pb-3 w-full">
            <CardTitle>Notification({index + 1})</CardTitle>
            <CardDescription className="w-full text-balance leading-relaxed">
              {notification.message}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              disabled={notification.read || isPending}
              onClick={() => readNotification(notification._id)}>
              {notification.read ? "Readed" : "Read"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default StudentNotifications;
