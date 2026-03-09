"use client";

import React from "react";
import Lottie from "lottie-react";

type Props = {
  animationData: object;
  className?: string;
};

export default function Lottie404({ animationData, className }: Props) {
  return (
    <div className={className}>
      <Lottie animationData={animationData as any} loop autoplay />
    </div>
  );
}