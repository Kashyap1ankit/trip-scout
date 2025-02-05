import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, promptType } from "~/lib/prompt.validator";
import { useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar } from "react-calendar";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, History, Search } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { tripType, system_prompt } from "constant";
import axios from "axios";

export const meta: MetaFunction = () => {
  return [{ title: "Generate" }, { name: "Generate page for trip" }];
};

export const loader = async () => {
  return Response.json({
    env: {
      GEO_API_KEY: process.env.GEO_API_KEY,
    },
  });
};
const resolver = zodResolver(promptSchema);

export async function action({ request }: ActionFunctionArgs) {
  try {
    const data = await getValidatedFormData<promptType>(request, resolver);
    if (data.errors) throw new Error("Validation error");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = system_prompt(
      data.data.city_name,
      data.data.start_date,
      data.data.end_date,
      data.data.travel_style
    );

    const result = await model.generateContent(prompt);
    console.log("gemini", result.response.text());

    return Response.json({ message: "Success", data, status: 200 });
  } catch (error) {
    return Response.json({ status: 400, message: "Failded", data: null });
  }
}

export default function GenerateTour() {
  const navigate = useNavigate();
  const {
    env,
  }: {
    env: {
      GEO_API_KEY: string;
    };
  } = useLoaderData();
  const [citySearchQuery, setCitySearchQuery] = useState<string>();
  const [cityData, setCityData] = useState<any>([]); //eslint-disable-line
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = searchParams.get("step");
  const [ddActiveIndex, setDDActiveIndex] = useState<number>(-1);
  const [activeTripStyle, setActiveStyle] = useState<string | null>();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const data = useRemixForm<promptType>({
    mode: "onSubmit",
    resolver,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function handleGeoRequest(cityName: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (cityName.trim() === "") {
        setCityData([]);
        return;
      }

      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${cityName}&apiKey=${env.GEO_API_KEY}`,
        {}
      );

      const allResponse = await response.data.features;
      setCityData(allResponse);
    }, 2000);
  }

  //eslint-disable-next-line
  const fieldValues: any = [
    "city_name",
    ["start_date", "end_date"],
    "travel_style",
  ];

  async function handleNextStep(step: number) {
    try {
      const output = await data.trigger(fieldValues[step]);

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
              <div className="flex items-center gap-4 border-2 border-neutral-400 p-2  outline-0 w-full rounded-full">
                <Search />
                <input
                  {...data.register("city_name")}
                  className="w-full bg-transparent outline-0 border-0"
                  onChange={(e) => {
                    setCitySearchQuery(e.target.value);
                    handleGeoRequest(e.target.value);
                  }}
                  onKeyDownCapture={(e) => {
                    if (
                      e.key === "ArrowDown" &&
                      ddActiveIndex < cityData.length - 1
                    ) {
                      setDDActiveIndex((prev) => {
                        const newValue = prev + 1;
                        setCitySearchQuery(
                          cityData[newValue].properties.formatted
                        );
                        return newValue;
                      });
                    }

                    if (e.key === "ArrowUp" && ddActiveIndex > 0) {
                      setDDActiveIndex((prev) => {
                        const newValue = prev - 1;
                        setCitySearchQuery(
                          cityData[newValue].properties.formatted
                        );
                        return newValue;
                      });
                    }
                  }}
                  value={citySearchQuery}
                />
              </div>
              {cityData.length > 0 && (
                <ul className="mt-2 bg-white py-4 flex flex-col gap-4 px-12 rounded-md duration-300">
                  {cityData.map(
                    (
                      e: {
                        properties: {
                          formatted: string;
                        };
                      },
                      i: number
                    ) => {
                      return (
                        //eslint-disable-next-line
                        <div
                          key={i}
                          className="flex gap-4 items-center bg-tranparent cursor-pointer hover:bg-gray-300 p-4 rounded-full"
                          onClick={() => {
                            setCitySearchQuery(e.properties.formatted);
                            data.setValue("city_name", e.properties.formatted);
                            navigate("/generate/tour?step=2");
                          }}
                        >
                          <History className="size-4 text-gray-400" />
                          <li>{e.properties.formatted}</li>
                        </div>
                      );
                    }
                  )}
                </ul>
              )}

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

            <div className="grid grid-cols-1 md:grid-cols-2  gap-12 bg-transparent mt-12">
              <div>
                <Calendar
                  {...data.register("start_date")}
                  onChange={(
                    e: any //eslint-disable-line
                  ) => {
                    setStartDate(e);
                    data.setValue(
                      "start_date",
                      new Date(e).toISOString().split("T")[0]
                    );
                  }}
                  value={
                    startDate
                      ? startDate
                      : new Date().toISOString().split("T")[0]
                  }
                  className="!w-11/12 !bg-transparent !border-0 !mx-auto shadow-none"
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
                    endDate
                      ? new Date(
                          new Date(endDate).getTime() - 24 * 60 * 60 * 1000
                        )
                      : new Date()
                  }
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
                  onChange={(
                    e: any //eslint-disable-line
                  ) => {
                    setEndDate(e);
                    data.setValue(
                      "end_date",
                      new Date(e).toISOString().split("T")[0]
                    );
                  }}
                  value={
                    endDate ? endDate : new Date().toISOString().split("T")[0]
                  }
                  className="!w-11/12 !bg-transparent !border-0 !mx-auto shadow-none"
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
                    startDate
                      ? new Date(
                          new Date(startDate).getTime() + 24 * 60 * 60 * 1000
                        )
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
            <div>
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold">
                What kind of travelling you want to do?
              </p>
              <p className="text-center text-gray-500 mt-6 ">
                Select Any one !
              </p>
            </div>

            <div>
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
                      data-active={activeTripStyle === e}
                      className={`duration-500 border-2 rounded-full p-6 text-center cursor-pointer data-[active=true]:bg-green-400`}
                    >
                      {e}
                    </div>
                  );
                })}
              </div>

              {data.formState.errors.travel_style && (
                <p className="text-red-500 text-center mt-4">
                  {data.formState.errors.travel_style.message}
                </p>
              )}
            </div>
          </div>
        ) : null}
        {currentStep === "3" ? (
          <button
            type="submit"
            className=" border-0 bg-violet-700 text-white p-2 px-8 rounded-full shadow-xl cursor-pointer"
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
