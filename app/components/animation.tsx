import { motion } from "motion/react";

export default function AnimatedComponent({
  children,
  delay,
  className,
  props,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
  props?: any; //eslint-disable-line
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      transition={{ duration: 1, delay }}
      viewport={{ once: true }}
      className={className}
      {...props}
      id={id}
    >
      {children}
    </motion.div>
  );
}
