import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/axios";
import { ServerError } from "@/types/general";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

interface TeacherRequestHandlerProps {
  userId: string;
}

export default function TeacherRequestHandler({
  userId,
}: TeacherRequestHandlerProps) {
  const subjectRef = useRef<HTMLInputElement>(null);
  const { mutate: requestTeacher, isPending } = useMutation({
    mutationKey: ["requestForTeacher"],
    mutationFn: async () => {
      if (subjectRef.current?.value === "")
        return toast({
          title: "Subject is required",
        });
      const { data } = await adminApi.post("/requestForTeacher", {
        userId,
        subject: subjectRef.current?.value,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Request sended",
      });
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message,
        variant: "destructive",
      });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="payment">Request Teacher</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request To Become A Teacher</DialogTitle>
          <DialogDescription>
            Here You can request to become a teacher and admin can further do
            next task
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Subject
            </Label>
            <Input className="col-span-3" ref={subjectRef} />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            variant={"app"}
            className="font-ubuntu"
            onClick={() => requestTeacher()}>
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
