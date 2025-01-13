import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, promptType } from "~/lib/prompt.validator";
import { model, system_prompt } from "constant";
import axios from "axios";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { useEffect, useState } from "react";

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

    const prompt = system_prompt(
      data.data.city_name,
      data.data.number_of_days,
      data.data.start_date,
      data.data.end_date,
      data.data.travel_style
    );

    // const result = await model.generateContent(prompt);
    // console.log("gemini", result.response.text());

    return Response.json({ message: "Success", data, status: 200 });
  } catch (error) {
    return Response.json({ status: 400, message: "Failded", data: null });
  }
}

const cityDataFake = [
  {
    properties: {
      formatted: "Patna, Bihar",
    },
  },
  {
    properties: {
      formatted: "Patna2, Bihar2",
    },
  },
  {
    properties: {
      formatted: "Patna3, Bihar3",
    },
  },
  {
    properties: {
      formatted: "Patna4, Bihar4",
    },
  },
];

export default function GenerateTour() {
  const { env } = useLoaderData();

  const [cityData, setCityData] = useState<any>([]);

  const data = useRemixForm<promptType>({
    mode: "onSubmit",
    resolver,
  });

  let timer: Timeout;

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

  return (
    <div>
      <Form
        className="flex flex-col gap-4 items-center mt-12"
        onSubmit={data.handleSubmit}
        method="POST"
      >
        <Command>
          <CommandInput
            placeholder="Type a command or search..."
            onChangeCapture={(e) => {
              data.setValue("city_name", e.target.value);
              handleGeoRequest(e.target.value);
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {cityDataFake.map((e, i) => {
                return (
                  <CommandItem
                    key={i}
                    onClickCapture={(e) => {
                      data.setValue("city_name", e.target.innerText);
                    }}
                  >
                    {e.properties.formatted}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>

        {data.formState.errors.city_name && (
          <p>{data.formState.errors.city_name.message}</p>
        )}
        <input
          {...data.register("number_of_days", { valueAsNumber: true })}
          placeholder="Enter number of days "
          className="border-2 border-neutral-400 p-2 rounded-md outline-0 w-fit"
        />
        {data.formState.errors.number_of_days && (
          <p>{data.formState.errors.number_of_days.message}</p>
        )}
        <input
          {...data.register("travel_style")}
          placeholder="travel_style"
          className="border-2 border-neutral-400 p-2 rounded-md outline-0 w-fit"
        />
        {data.formState.errors.travel_style && (
          <p>{data.formState.errors.travel_style.message}</p>
        )}
        <input
          type="date"
          {...data.register("start_date")}
          className="border-2 border-neutral-400 p-2 rounded-md outline-0 w-fit"
        />
        {data.formState.errors.start_date && (
          <p>{data.formState.errors.start_date.message}</p>
        )}
        <input
          type="date"
          {...data.register("end_date")}
          className="border-2 border-neutral-400 p-2 rounded-md outline-0 w-fit"
        />
        {data.formState.errors.end_date && (
          <p>{data.formState.errors.end_date.message}</p>
        )}

        <button
          type="submit"
          className="rounded-md border-0 bg-violet-700 text-white p-2"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
