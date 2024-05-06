import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CountryFlag from "react-country-flag";
import { UseFormReturn } from "react-hook-form";

export function CountrySelector({
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
  const countries = [
    { name: "Pakistan", code: "PK" },
    { name: "United Kingdom", code: "GB" },
    { name: "India", code: "IN" },
    { name: "Canada", code: "CA" },
    { name: "Germany", code: "DE" },
    { name: "Australia", code: "AU" },
    { name: "Japan", code: "JP" },
    { name: "China", code: "CN" },
    { name: "Brazil", code: "BR" },
    { name: "Russia", code: "RU" },
    { name: "South Africa", code: "ZA" },
  ];

  return (
    <Select>
      <SelectTrigger className="w-[100%]">
        <SelectValue placeholder="Select your country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {countries.map((country, index) => (
            <SelectItem
              key={index}
              value={country.code}
              onMouseEnter={() => form.setValue("country", country.code)}
              onTouchStart={() => form.setValue("country", country.code)}>
              {country.name}
              <CountryFlag countryCode={country.code} svg />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
