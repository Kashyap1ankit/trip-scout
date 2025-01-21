import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { navItems } from "data/data-without-icon";
import { NavItemType } from "types/generic.types";

export default function NavItems() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center ">
      {navItems.map((e: NavItemType, i: number) => {
        return (
          <Link
            to={e.link}
            key={i}
            className="hover:bg-gray-200  p-2 px-4 text-center border-b-2 md:border-0 rounded-0 md:rounded-full w-full"
          >
            {e.title}
          </Link>
        );
      })}

      <Button
        className="bg-btn-primary hover:bg-btn-primary rounded-md md:hidden px-4 w-full"
        onClick={() => navigate("/generate/tour?step=1")}
      >
        <p className="font-bold text-sm">Plan Now</p>
      </Button>
    </div>
  );
}
