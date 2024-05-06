import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

export function QualificationSelector({
  form,
}: {
  form: UseFormReturn<
    {
      username: string;
      email: string;
      password: string;
      qualification: string;
      mobileNumber: string;
      country: string;
    },
    any,
    undefined
  >;
}) {
  const qualifications = [
    "Intermediate",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
  ];
  return (
    <Select>
      <SelectTrigger className="w-[100%]">
        <SelectValue placeholder="Select Qualification" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {qualifications.map((qualification, index) => (
            <SelectItem
              key={index}
              value={qualification.toLowerCase()}
              onMouseEnter={() => form.setValue("qualification", qualification)}
              onTouchStart={() =>
                form.setValue("qualification", qualification)
              }>
              {qualification}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
