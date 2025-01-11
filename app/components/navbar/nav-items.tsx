import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

const navLinks = [
  {
    title: "Discover",
    link: "#discover",
  },
  {
    title: "Trips",
    link: "#trips",
  },
  {
    title: "Review",
    link: "#review",
  },
];

export default function NavItems() {
  return (
    <div className="flex gap-2 items-center ">
      {navLinks.map((e, i) => {
        return (
          <Link
            to={e.link}
            key={i}
            className="hover:bg-gray-200 rounded-full p-2"
          >
            {e.title}
          </Link>
        );
      })}

      <Button className="bg-btn-primary hover:bg-btn-primary rounded-md md:hidden px-4">
        <p className="font-bold text-sm">Plan Now</p>
      </Button>
    </div>
  );
}
