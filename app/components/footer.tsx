import { Form, Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { FaUserPlus } from "react-icons/fa";
import { socialLinks } from "data/data-with-icon";

export default function Footer() {
  return (
    <div className="border-t-2 pt-12">
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row md:justify-between">
        <div className="text-center">
          <div className="flex gap-2 justify-center">
            <img
              src="/tour-scout.png"
              alt="tour-scout-logo"
              className="w-8 rounded-full"
            />
            <p className="text-2xl text-btn-primary font-bold">Tour Scout</p>
          </div>
          <p className="text-sm text-gray-400">@2025 TS INC.</p>
        </div>

        <Form className="flex gap-4 flex-wrap ">
          <div className="bg-tranparent flex gap-4  items-center  rounded-full border-2 p-4">
            <FaUserPlus />
            <input
              placeholder="user@gmail.com"
              className="bg-transparent border-0 outline-0"
            />
          </div>
          <Button className="bg-green-400 hover:bg-green-400 text-black rounded-full p-6 px-8">
            Subscribe
          </Button>
        </Form>
      </div>

      <div className="mt-8 w-full flex gap-6 justify-center md:justify-end">
        {socialLinks.map((e, i: number) => {
          return (
            <Link to={e.link} key={i} target="_blank" rel="noreferrer">
              <e.icon className="size-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
