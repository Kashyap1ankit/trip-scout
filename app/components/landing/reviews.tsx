import { useRef } from "react";
import AnimatedComponent from "../animation";
import { reviews } from "data/data-without-icon";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";

import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

export default function Reviews() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <AnimatedComponent id="review">
      <p className="text-2xl sm:text-3xl  lg:text-5xl font-bold   text-center">
        Recent Reviews
      </p>
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full mt-24"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {reviews.map((e, index) => (
            <CarouselItem
              key={index}
              className="relative md:basis-1/2 lg:basis-1/3 mb-12 mx-4"
            >
              <div className="p-8 rounded-lg rounded-lg z-10 bg-white shadow-xl h-72 min-h-fit">
                <div className="flex flex-col ">
                  <div className="text-center">
                    <p className="text-center font-bold text-xl">{e.name}</p>
                    <p className="text-gray-400 italic text-sm">{e.date}</p>
                  </div>

                  <div className="relative flex flex-col gap-4">
                    <FaQuoteLeft className="text-yellow-500" />
                    <p className="mx-4">{e.comment}</p>
                    <FaQuoteRight className="w-full absolute bottom-0 mx-auto left-[50%] text-yellow-500" />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </AnimatedComponent>
  );
}
