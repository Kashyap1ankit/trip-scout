import { z } from "zod";

export const promptSchema = z.object({
  city_name: z
    .string()
    .min(2, { message: "City name cannot be smaller than this" }),
  travel_style: z.string({ message: "Style" }),
  number_of_days: z
    .number()
    .min(1, { message: "Trip cannot be less than 1days" }),
  start_date: z.string({ message: "invalid" }).date(),
  end_date: z.string({ message: "invalid" }).date(),
});

export type promptType = z.infer<typeof promptSchema>;
