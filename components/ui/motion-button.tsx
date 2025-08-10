"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { Button, type ButtonProps } from "@/components/ui/button";

export type MotionButtonProps = ButtonProps & {
  whileHoverScale?: number;
  whileTapScale?: number;
};

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ whileHoverScale = 1.03, whileTapScale = 0.97, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: whileHoverScale }}
        whileTap={{ scale: whileTapScale }}
        style={{ display: "inline-block" }}
      >
        <Button ref={ref} {...props} />
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";
