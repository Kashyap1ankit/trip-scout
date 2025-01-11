import { Button } from "../ui/button";
import NavItems from "./nav-items";
import logo from "/tour-scout.png"; //eslint-disable-line
import { LuTally3 } from "react-icons/lu";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full p-4  flex justify-between md:px-12 bg-background-primary">
      <div className="flex gap-2 items-center">
        <img
          src={logo}
          alt="logo-img"
          className="w-8 h-8 rounded-full shadow-md"
        />
        <p className="text-2xl font-bold ">Tour Scout</p>
      </div>

      <div className="hidden md:block">
        <NavItems />
      </div>

      <div className="md:hidden">
        <LuTally3 className="rotate-90 size-6" />
      </div>

      <Button className="bg-btn-primary hover:bg-btn-primary rounded-full hidden md:block px-4">
        <p className="font-bold text-sm">Plan Now</p>
      </Button>
    </div>
  );
}
