import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import NavItems from "./nav-items";
import logo from "/tour-scout.png"; //eslint-disable-line
import { LuTally3 } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useNavigate } from "@remix-run/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) return setIsScrolled(true);
      setIsScrolled(false);
    });

    return window.removeEventListener("scroll", () => {});
  }, []);
  return (
    <div
      className={`${
        isScrolled
          ? "border-b-2 border-neutral-200 backdrop-blur-xl bg-background-primary/30"
          : "bg-background-primary "
      } fixed top-0 left-0 w-full p-4  flex justify-between md:px-12  duration-150 z-50`}
    >
      {/* eslint-disable-next-line  */}
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
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
        <Dialog>
          <DialogTrigger>
            <LuTally3 className="rotate-90 size-6" />
          </DialogTrigger>
          <DialogContent className="mx-auto rounded-lg w-11/12 md:hidden">
            <DialogHeader>
              <DialogTitle className="sr-only"></DialogTitle>
              <DialogDescription>
                <NavItems />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        className="bg-btn-primary hover:bg-btn-primary rounded-full hidden md:block px-4"
        onClick={() => navigate("/generate/tour?step=1")}
      >
        <p className="font-bold text-sm">Plan Now</p>
      </Button>
    </div>
  );
}
