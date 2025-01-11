import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { navItems } from "data/data-without-icon";
import { NavItemType } from "types/generic.types";

export default function NavItems() {
  return (
    <div className="flex gap-6 items-center ">
      {navItems.map((e: NavItemType, i: number) => {
        return (
          <Link
            to={e.link}
            key={i}
            className="hover:bg-gray-200 rounded-full p-2 px-4"
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
