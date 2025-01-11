import type { MetaFunction } from "@remix-run/node";
import Hero from "~/components/landing/hero";
import WhyWeExist from "~/components/landing/why-we-exist";

export const meta: MetaFunction = () => {
  return [
    { title: "Tour Scout" },

    {
      name: "description",
      content: "Plan your Trip in seconds",
    },
    {
      tagName: "link",
      rel: "icon",
      href: "/tour-scout.png",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col gap-44">
      <Hero />
      <WhyWeExist />
    </div>
  );
}
