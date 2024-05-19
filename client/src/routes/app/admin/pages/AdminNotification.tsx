import LoadingBar from "@/components/LoadingBar";
import { adminApi } from "@/lib/axios";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ServerError } from "@/types/general";

interface NotificationData {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    qualification: string;
  };
  subject: string;
  approved: boolean;
}

const AdminNotification = () => {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data: adminNotifications,
  } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () => {
      const { data } = await adminApi.get("/teacherRequests");
      console.log(data);
      return data as NotificationData[];
    },
  });

  const { mutate: approveRequest, isPending: isApprovalPending } = useMutation({
    mutationKey: ["approveRequest"],
    mutationFn: async (userId: string) => {
      const { data } = await adminApi.put("/approveTeacher", { userId });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Request accepted",
      });
      queryClient.invalidateQueries([
        "adminNotifications",
        0,
      ] as InvalidateQueryFilters);
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: rejectRequest, isPending: isRejectionPending } = useMutation({
    mutationKey: ["rejectRequest"],
    mutationFn: async (userId: string) => {
      const { data } = await adminApi.put("/rejectTeacher", { userId });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Request rejected",
      });
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message,
        variant: "destructive",
      });
    },
  });
  if (error) return <Navigate to={"/"} />;
  if (isLoading) return <LoadingBar />;
  return (
    <Card className="w-full px-2">
      <CardHeader>
        <CardTitle>Teacher Requests</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {adminNotifications?.map((notification) => (
          <>
            <div
              className="flex items-center max-[500px]:flex-col gap-4"
              key={notification._id}>
              <Avatar className="h-9 w-9 flex">
                <AvatarImage src={notification.user.avatar} alt="Avatar" />
                <AvatarFallback>{notification.user.username}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {notification.user.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.user.email}
                </p>
                <p className="text-sm font-pt-serif">
                  {notification.user.qualification}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={"payment"}
                  disabled={isApprovalPending}
                  onClick={() => approveRequest(notification.user._id)}>
                  Approve
                </Button>
                <Button
                  variant={"destructive"}
                  disabled={isRejectionPending}
                  onClick={() => rejectRequest(notification.user._id)}>
                  Reject
                </Button>
              </div>
            </div>
          </>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminNotification;
