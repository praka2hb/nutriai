"use client";

import { cn } from "@/lib/utils"; // Assuming you have a utility for cn

const AuroraBackground = () => {
  // Define multiple aurora blob configurations
  const auroras = [
    {
      // Emerald-ish blob
      positionClasses: "top-[-30%] left-[-20%] md:top-[-50%] md:left-[-30%]",
      sizeClasses: "w-[60vw] h-[60vw] md:w-[800px] md:h-[800px]",
      colorClasses: "bg-emerald-400/25", // Increased opacity slightly
      blurClasses: "blur-[100px] md:blur-[180px]",
      animationClass: "animate-aurora-1",
      opacityClass: "opacity-70 md:opacity-60",
    },
    {
      // Sky-ish blob
      positionClasses: "bottom-[-30%] right-[-20%] md:bottom-[-50%] md:right-[-30%]",
      sizeClasses: "w-[55vw] h-[55vw] md:w-[750px] md:h-[750px]",
      colorClasses: "bg-sky-400/25", // Increased opacity slightly
      blurClasses: "blur-[90px] md:blur-[170px]",
      animationClass: "animate-aurora-2",
      opacityClass: "opacity-70 md:opacity-60",
    },
    {
      // Pink-ish blob
      positionClasses: "top-[10%] right-[5%] md:top-[0%] md:right-[-10%]",
      sizeClasses: "w-[50vw] h-[50vw] md:w-[600px] md:h-[600px]",
      colorClasses: "bg-pink-400/20", // Increased opacity slightly
      blurClasses: "blur-[80px] md:blur-[140px]",
      animationClass: "animate-aurora-3",
      opacityClass: "opacity-60 md:opacity-50",
    },
    {
      // Purple-ish blob
      positionClasses: "bottom-[5%] left-[0%] md:bottom-[-10%] md:left-[-15%]",
      sizeClasses: "w-[50vw] h-[50vw] md:w-[650px] md:h-[650px]",
      colorClasses: "bg-purple-400/20", // Increased opacity slightly
      blurClasses: "blur-[80px] md:blur-[160px]",
      animationClass: "animate-aurora-4",
      opacityClass: "opacity-60 md:opacity-50",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" // Ensures it's behind all interactive content
    >
      {auroras.map((aurora, index) => (
        <div
          key={index}
          className={cn(
            "absolute rounded-full filter",
            aurora.positionClasses,
            aurora.sizeClasses,
            aurora.colorClasses,
            aurora.blurClasses,
            aurora.animationClass,
            aurora.opacityClass
          )}
        />
      ))}
    </div>
  );
};

export default AuroraBackground; 