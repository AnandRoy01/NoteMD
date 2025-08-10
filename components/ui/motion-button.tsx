"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { Button, type ButtonProps } from "@/components/ui/button";

export type MotionButtonProps = ButtonProps & {
  whileHoverScale?: number;
  whileTapScale?: number;
};

const MotionBase = motion(Button as any);

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ whileHoverScale = 1.03, whileTapScale = 0.97, ...props }, ref) => {
    return (
      <MotionBase
        whileHover={{ scale: whileHoverScale }}
        whileTap={{ scale: whileTapScale }}
        ref={ref}
        {...props}
      />
    );
  }
);

MotionButton.displayName = "MotionButton";
