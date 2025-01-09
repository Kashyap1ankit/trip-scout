import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Tour Scout" },
    { name: "description", content: "Plan your Trip in seconds" },
  ];
};

export default function Index() {
  return <div>Hello world</div>;
}
