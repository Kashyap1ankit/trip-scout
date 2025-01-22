import { z } from "zod";

export const promptSchema = z
  .object({
    city_name: z
      .string()
      .min(2, { message: "City name cannot be smaller than this" }),
    travel_style: z.string({ message: "Travel style must be given" }),
    start_date: z.string({ message: "Invalid start date" }).date(),
    end_date: z.string({ message: "Invalid end date" }).date(),
  })
  .superRefine((data, ctx) => {
    if (data.end_date <= data.start_date) {
      console.log(data);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End Date Must be 1 day after start date",
        path: ["start_date", "end_date"],
      });
    }
  });

export type promptType = z.infer<typeof promptSchema>;
