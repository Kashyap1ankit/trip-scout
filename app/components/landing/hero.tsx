import { heroDisplay } from "data/data-with-icon";
import AnimatedComponent from "../animation";

export default function Hero() {
  return (
    <div>
      <AnimatedComponent className="w-full sm:w-3/4 md:w-1/2  mx-auto">
        <p className="text-4xl sm:text-5xl  lg:text-6xl xl:text-7xl font-bold   text-center">
          Travel{" "}
          <span className="bg-clip-text text-transparent  bg-gradient-to-r from-red-500 to-red-800">
            Smarter
          </span>{" "}
          Experience More
        </p>
        <p className="mt-8 text-center text-gray-500 italic">
          Skip the endless planning. Get instant, weather-optimized itineraries
          with local insights and daily recommendations, customized just for
          you.
        </p>
      </AnimatedComponent>

      <div className=" flex justify-center gap-12 mt-20 items-center flex-wrap">
        {heroDisplay.map((e, i) => {
          return (
            <AnimatedComponent
              key={i}
              className="flex flex-col items-center gap-4"
              delay={0.8}
            >
              <e.icon className="w-12 h-12 text-btn-primary border-2 rounded-full p-2" />
              <p className="text-sm">{e.title}</p>
            </AnimatedComponent>
          );
        })}
      </div>
    </div>
  );
}
