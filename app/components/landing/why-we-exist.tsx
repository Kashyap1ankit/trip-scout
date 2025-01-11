import { whyWeExist } from "data/data-with-icon";
import AnimatedComponent from "../animation";

export default function WhyWeExist() {
  return (
    <AnimatedComponent>
      <p className="text-2xl sm:text-3xl  lg:text-5xl font-bold   text-center">
        Why We Exist ?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4  mt-20 group">
        {whyWeExist.map((e, i) => {
          return (
            <AnimatedComponent key={i} className="cursor-pointer  ">
              <div className="flex flex-col items-center gap-4 border-2 bg-background-secondary rounded-lg border-2 border-neutral-200 p-12 cursor-pointer group group-hover:opacity-50 hover:!opacity-100 duration-300 hover:shadow-xl">
                <e.icon className="w-12 h-12 text-btn-primary " />
                <p className="text-lg font-bold text-btn-primary">{e.title}</p>
                <p className="text-sm text-gray-500 italic text-center ">
                  {e.description}
                </p>
              </div>
            </AnimatedComponent>
          );
        })}
      </div>
    </AnimatedComponent>
  );
}
