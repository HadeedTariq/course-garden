import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { studentApi } from "@/lib/axios";
import { ServerError } from "@/types/general";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";

const formSchema = z.object({
  coupon: z.string().min(10, {
    message: "Coupon Code must be at least 10 characters.",
  }),
});
type CouponSchema = z.infer<typeof formSchema>;

interface CouponCodeCheckerProps {
  courseId: string;
  price: string;
}

const priceDecreaser = (price: string, data: string | undefined) => {
  if (!data) {
    return price;
  }
  const realPrice = Number(price.split(" ")[1]);
  const discPrice = Math.floor(realPrice / 2);
  return `$${discPrice}`;
};

const CouponCodeChecker = ({ courseId, price }: CouponCodeCheckerProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [`getCoupon${courseId}`],
    queryFn: async () => {
      const { data } = await studentApi.get(
        `/course/checkCoupon?courseId=${courseId}`
      );
      return data ? (data as string) : undefined;
    },
    refetchOnWindowFocus: false,
  });
  const form = useForm<CouponSchema>({
    resolver: zodResolver(formSchema),
    values: {
      coupon: data || "",
    },
  });

  const { mutate: applyCoupon, isPending } = useMutation({
    mutationKey: ["couponCodeApplier"],
    mutationFn: async (coupon: string) => {
      const { data } = await studentApi.post("/course/applyCouponCode", {
        courseId,
        coupon,
      });
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message || "Coupon Code applied",
      });
    },
    onError: (err: ServerError) => {
      toast({
        title: err.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
  const onSubmit = ({ coupon }: CouponSchema) => {
    applyCoupon(coupon);
  };

  const { mutate: buyCourse } = useMutation({
    mutationKey: ["purchaseCourse"],
    mutationFn: async (crsPrice: string) => {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
      );
      const { data: session } = await studentApi.post("/course/purchase", {
        price: crsPrice,
        courseId,
        coupon: data,
      });

      stripe?.redirectToCheckout({
        sessionId: session.id,
      });
    },
  });

  const purchaseCourse = async (price: string) => {
    buyCourse(price);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="coupon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="couponCode"
                  {...field}
                  readOnly={data ? true : false}
                />
              </FormControl>
              <FormDescription>
                This will decrease the course price 50%
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          {data ? (
            <Button disabled>Applied</Button>
          ) : (
            <Button type="submit" disabled={isPending || isLoading}>
              Submit
            </Button>
          )}
          <Button
            type="button"
            className="font-pt-serif"
            onClick={() => purchaseCourse(priceDecreaser(price, data))}>
            Enroll In Course In {priceDecreaser(price, data)}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponCodeChecker;
