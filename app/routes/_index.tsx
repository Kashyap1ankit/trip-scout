import type { MetaFunction } from "@remix-run/node";
import Hero from "~/components/landing/hero";

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
    <div>
      <Hero />
    </div>
  );
}
