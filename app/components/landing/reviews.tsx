import { useEffect, useState } from "react";
import AnimatedComponent from "../animation";
import { reviews } from "data/data-without-icon";
import { motion } from "motion/react";
export default function Reviews() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    setInterval(() => {
      setActive((prev) => {
        console.log(prev);
        if (prev === reviews.length) {
          return 1;
        }
        return prev + 1 / 2;
      });
    }, 5000);
  }, []);
  return (
    <AnimatedComponent>
      <p className="text-2xl sm:text-3xl  lg:text-5xl font-bold   text-center">
        Recent Reviews
      </p>
      <button onClick={() => setActive((prev) => prev + 1)}>next</button>
      <button onClick={() => setActive((prev) => prev - 1)}>prev</button>
      <div className="relative h-80 mt-12 overflow-hidden ">
        {reviews.map((e, i) => {
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0.7,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="absolute w-full h-full "
            >
              <img
                src={e.avatar}
                alt={e.name}
                className="h-full border-2 mx-auto w-3/4 "
                style={{
                  transform: `translateX(${(i - (active - 1)) * 100}%)`,
                  zIndex: active === i + 1 ? 50 : 10,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </AnimatedComponent>
  );
}
