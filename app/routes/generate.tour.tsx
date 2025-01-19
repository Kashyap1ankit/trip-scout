import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, promptType } from "~/lib/prompt.validator";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar } from "react-calendar";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
// import { model, system_prompt } from "constant";
// import axios from "axios";

// import {
//   Command,
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from "~/components/ui/command";
// import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Generate" }, { name: "Generate page for trip" }];
};

const resolver = zodResolver(promptSchema);

export const loader = async () => {
  return Response.json({
    env: {
      GEO_API_KEY: process.env.GEO_API_KEY,
    },
  });
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await getValidatedFormData<promptType>(request, resolver);
    console.log(data);
    if (data.errors) throw new Error("Validation error");

    // const prompt = system_prompt(
    //   data.data.city_name,
    //   data.data.number_of_days,
    //   data.data.start_date,
    //   data.data.end_date,
    //   data.data.travel_style
    // );

    // const result = await model.generateContent(prompt);
    // console.log("gemini", result.response.text());

    return Response.json({ message: "Success", data, status: 200 });
  } catch (error) {
    return Response.json({ status: 400, message: "Failded", data: null });
  }
}

// const cityDataFake = [
//   {
//     properties: {
//       formatted: "Patna, Bihar",
//     },
//   },
//   {
//     properties: {
//       formatted: "Patna2, Bihar2",
//     },
//   },
//   {
//     properties: {
//       formatted: "Patna3, Bihar3",
//     },
//   },
//   {
//     properties: {
//       formatted: "Patna4, Bihar4",
//     },
//   },
// ];

export default function GenerateTour() {
  // const { env } = useLoaderData();
  // const [cityData, setCityData] = useState<any>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = searchParams.get("step");

  const data = useRemixForm<promptType>({
    mode: "onSubmit",
    resolver,
  });
  const [value, onChange] = useState<Value>(new Date());
  const [endValue, endOnChange] = useState<Value>(new Date());
  // let timer: Timeout;

  // async function handleGeoRequest(cityName: string) {
  //   if (timer) clearTimeout(timer);
  //   timer = setTimeout(async () => {
  //     const response = await axios.get(
  //       `https://api.geoapify.com/v1/geocode/autocomplete?text=${cityName}&apiKey=${env.GEO_API_KEY}`,
  //       {}
  //     );
  //     console.log("response", response);
  //     const allResponse = await response.data.features;
  //     console.log("allResponse", allResponse);
  //     setCityData(allResponse);
  //   }, 2000);
  // }

  const fieldValues = ["city_name", ["start_date", "end_date"], "travel_style"];

  async function handleNextStep(step: number) {
    try {
      console.log(data.getValues("start_date"));
      const output = await data.trigger(fieldValues[step]);
      console.log("output", output);

      if (output) {
        const params = new URLSearchParams();
        params.set("step", String(Number(currentStep) + 1));
        setSearchParams(params, { preventScrollReset: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!currentStep) {
      const params = new URLSearchParams();
      params.set("step", "1");
      setSearchParams(params, { preventScrollReset: true });
    }
  }, []);

  const start_date_value = data.getValues("start_date");
  const end_date_value = data.getValues("end_date");

  return (
    <div className="border-2">
      <div className="mx-auto text-center text-gray-400 font-bold text-sm">
        Step {currentStep}/3
      </div>

      <Form
        className="flex flex-col gap-24 items-center mt-12"
        onSubmit={data.handleSubmit}
        method="POST"
      >
        {currentStep === "1" ? (
          <div className="flex flex-col gap-12">
            <div>
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold">
                Tell , where do you want to go?
              </p>
              <p className="text-center text-gray-500 mt-6 ">
                You&apos;ll get custom trip you can save and turn into an
                itinerary.
              </p>
            </div>

            <div>
              <input
                {...data.register("city_name")}
                className="border-2 border-neutral-400 p-2  outline-0 w-full rounded-full"
              />

              {data.formState.errors.city_name && (
                <p className="text-red-500">
                  {data.formState.errors.city_name.message}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {currentStep === "2" ? (
          <div>
            <div className="mx-auto text-center">
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold">
                When you are going ?
              </p>
              <p className="text-center text-gray-500 mt-6 ">
                Choose a date range of your want
              </p>
            </div>

            <div className="flex  gap-12 bg-transparent mt-12">
              <div>
                <Calendar
                  {...data.register("start_date")}
                  onChange={(e) => data.setValue("start_date", e)}
                  value={start_date_value}
                  className="!w-fit bg-white shadow-none"
                  tileClassName="text-sm p-2 rounded-full hover:bg-gray-100 transition-colors"
                  navigationLabel={({ date }) => (
                    <span className="text-lg font-medium">
                      {format(date, "MMMM yyyy")}
                    </span>
                  )}
                  prevLabel={<ChevronLeft className="h-5 w-5" />}
                  nextLabel={<ChevronRight className="h-5 w-5" />}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  tileContent={null}
                  formatShortWeekday={(locale, date) => format(date, "EEEEE")}
                  formatDay={(locale, date) => format(date, "d")}
                  minDate={new Date()}
                />

                {data.formState.errors.start_date && (
                  <p className="text-red-500">
                    {data.formState.errors.start_date.message}
                  </p>
                )}
              </div>
              <div>
                <Calendar
                  {...data.register("end_date")}
                  onChange={(e) => data.setValue("end_date", e)}
                  value={endValue}
                  className="!w-auto bg-white shadow-none"
                  tileClassName="text-sm p-2 rounded-full hover:bg-gray-100 transition-colors"
                  navigationLabel={({ date }) => (
                    <span className="text-lg font-medium">
                      {format(date, "MMMM yyyy")}
                    </span>
                  )}
                  prevLabel={<ChevronLeft className="h-5 w-5" />}
                  nextLabel={<ChevronRight className="h-5 w-5" />}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  tileContent={null}
                  formatShortWeekday={(locale, date) => format(date, "EEEEE")}
                  formatDay={(locale, date) => format(date, "d")}
                  minDate={
                    value
                      ? new Date(value.getTime() + 24 * 60 * 60 * 1000)
                      : new Date()
                  }
                />

                {data.formState.errors.end_date && (
                  <p className="text-red-500">
                    {data.formState.errors.end_date.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === "3" ? (
          <div>
            <input
              {...data.register("travel_style")}
              placeholder="travel_style"
              className="border-2 border-neutral-400 p-2 rounded-md outline-0 w-fit"
            />
            {data.formState.errors.travel_style && (
              <p>{data.formState.errors.travel_style.message}</p>
            )}
          </div>
        ) : null}
        {currentStep === "3" ? (
          <button
            type="submit"
            className="rounded-md border-0 bg-violet-700 text-white p-2"
          >
            submit
          </button>
        ) : (
          //eslint-disable-next-line
          <div
            className=" border-0 bg-violet-700 text-white p-2 px-8 rounded-full shadow-xl cursor-pointer"
            onClick={() => handleNextStep(Number(currentStep) - 1)}
          >
            Next
          </div>
        )}
      </Form>
    </div>
  );
}
