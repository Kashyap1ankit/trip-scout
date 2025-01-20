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

// import { model, system_prompt } from "constant";
import axios from "axios";

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

const tripType = [
  "Adventure",
  "Family-Friendly",
  "Friends-Trip",
  "Solo",
  "Partner-Trip",
];

export default function GenerateTour() {
  const { env } = useLoaderData();
  const [cityDataFake, setCityDataFake] = useState([
    { properties: { formatted: "" } },
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = searchParams.get("step");
  const [activeTripStyle, setActiveStyle] = useState();
  const data = useRemixForm<promptType>({
    mode: "onSubmit",
    resolver,
  });

  let timer: Timeout;

  async function handleGeoRequest(cityName: string) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${cityName}&apiKey=${env.GEO_API_KEY}`,
        {}
      );
      console.log("response", response);
      const allResponse = await response.data.features;
      console.log("allResponse", allResponse);
      setCityDataFake(allResponse);
    }, 2000);
  }

  const fieldValues = ["city_name", ["start_date", "end_date"], "travel_style"];

  async function handleNextStep(step: number) {
    try {
      console.log(data.getValues("start_date"));
      console.log(data.getValues("end_date"));
      const output = await data.trigger(fieldValues[step]);
      console.log("output", output);

      if (output) {
        if (currentStep !== "3") {
          const params = new URLSearchParams();
          params.set("step", String(Number(currentStep) + 1));
          setSearchParams(params, { preventScrollReset: true });
          return;
        }
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

  // [
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
  // ]

  const [activeValue, setActiveValue] = useState(0);

  return (
    <div>
      <div className="flex justify-between items-center">
        <ChevronLeft
          className="cursor-pointer w-10 h-10 hover:bg-gray-300 p-2 rounded-full"
          onClick={() => {
            if (
              currentStep &&
              Number(currentStep) > 1 &&
              Number(currentStep) <= 3
            ) {
              const params = new URLSearchParams();
              params.set("step", (Number(currentStep) - 1).toString());
              setSearchParams(params, { preventScrollReset: true });
            }
          }}
        />

        <div className=" text-gray-400 font-bold text-sm">
          Step {currentStep}/3
        </div>

        <ChevronRight
          className="cursor-pointer w-10 h-10 hover:bg-gray-300 p-2 rounded-full"
          onClick={() => {
            if (
              currentStep &&
              Number(currentStep) >= 1 &&
              Number(currentStep) < 3
            ) {
              const params = new URLSearchParams();
              params.set("step", (Number(currentStep) + 1).toString());
              setSearchParams(params, { preventScrollReset: true });
            }
          }}
        />
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
                onChangeCapture={(e) => {
                  console.log("value", e.target.key);
                }}
                onKeyDownCapture={(e) => {
                  console.log(e.key);
                  if (
                    e.key === "ArrowDown" &&
                    activeValue < cityDataFake.length - 1
                  ) {
                    return setActiveValue((prev) => prev + 1);
                  }

                  if (e.key === "ArrowUp" && activeValue > 0) {
                    return setActiveValue((prev) => prev - 1);
                  }
                }}
                value={cityDataFake[activeValue].properties.formatted}
              />

              <ul className="bg-gray-400 text-center">
                {cityDataFake.length > 0 &&
                  cityDataFake.map((e, i) => {
                    return <li key={i}>{e.properties.formatted}</li>;
                  })}
              </ul>

              {data.formState.errors.city_name && (
                <p className="text-red-500">
                  {data.formState.errors.city_name.message}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Calendar Part  */}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-transparent mt-12">
              <div>
                <Calendar
                  {...data.register("start_date")}
                  onChange={(e) =>
                    data.setValue(
                      "start_date",
                      new Date(e).toISOString().split("T")[0]
                    )
                  }
                  value={new Date().toISOString().split("T")[0]}
                  className="!w-fit !bg-transparent !border-0 shadow-none"
                  tileClassName="text-sm p-2 rounded-full hover:bg-gray-100 "
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
                  onChange={(e) =>
                    data.setValue(
                      "end_date",
                      new Date(e).toISOString().split("T")[0]
                    )
                  }
                  value={new Date().toISOString().split("T")[0]}
                  className="!w-fit !bg-transparent !border-0  shadow-none"
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
                  // minDate={
                  //   start_date_value
                  //     ? new Date(
                  //         start_date_value.getTime() + 24 * 60 * 60 * 1000
                  //       )
                  //     : new Date()
                  // }
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
            <div>
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold">
                What kind of travelling you want to do?
              </p>
              <p className="text-center text-gray-500 mt-6 ">
                Select Any one !
              </p>
            </div>

            <div className="group mt-12 grid grid-cols-3  gap-12 self-center">
              {tripType.map((e, i) => {
                return (
                  //eslint-disable-next-line
                  <div
                    onClick={() => {
                      setActiveStyle(e);
                      data.setValue("travel_style", e.toString());
                    }}
                    key={i}
                    d
                    data-active={activeTripStyle === e}
                    className={`duration-500 border-2 rounded-full p-6 text-center cursor-pointer data-[active=true]:bg-green-400`}
                  >
                    {e}
                  </div>
                );
              })}

              {data.formState.errors.travel_style && (
                <p className="text-red-500">
                  {data.formState.errors.travel_style.message}
                </p>
              )}
            </div>
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
            className={` border-0 bg-violet-700 text-white p-2 px-8 rounded-full shadow-xl cursor-pointer `}
            onClick={() => {
              handleNextStep(Number(currentStep) - 1);
            }}
          >
            Next
          </div>
        )}
      </Form>
    </div>
  );
}
