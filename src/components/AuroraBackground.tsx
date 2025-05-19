"use client";

import { cn } from "@/lib/utils";

const AuroraBackground = () => {
  const auroras = [
    {
      positionClasses: "top-[-40%] left-[-25%] md:top-[-60%] md:left-[-35%]",
      sizeClasses: "w-[70vw] h-[70vw] md:w-[900px] md:h-[900px]",
      colorClasses: "bg-red-500/25",
      blurClasses: "blur-[110px] md:blur-[200px]",
      animationClass: "animate-aurora-1",
      opacityClass: "opacity-60 md:opacity-50",
    },
    {
      positionClasses: "bottom-[-40%] right-[-25%] md:bottom-[-60%] md:right-[-35%]",
      sizeClasses: "w-[65vw] h-[65vw] md:w-[850px] md:h-[850px]",
      colorClasses: "bg-orange-500/25",
      blurClasses: "blur-[100px] md:blur-[190px]",
      animationClass: "animate-aurora-2",
      opacityClass: "opacity-60 md:opacity-50",
    },
    {
      positionClasses: "top-[5%] right-[-5%] md:top-[-10%] md:right-[-15%]",
      sizeClasses: "w-[60vw] h-[60vw] md:w-[700px] md:h-[700px]",
      colorClasses: "bg-yellow-400/20",
      blurClasses: "blur-[90px] md:blur-[160px]",
      animationClass: "animate-aurora-3",
      opacityClass: "opacity-50 md:opacity-40",
    },
    {
      positionClasses: "bottom-[0%] left-[-10%] md:bottom-[-15%] md:left-[-20%]",
      sizeClasses: "w-[60vw] h-[60vw] md:w-[750px] md:h-[750px]",
      colorClasses: "bg-rose-500/20",
      blurClasses: "blur-[90px] md:blur-[180px]",
      animationClass: "animate-aurora-4",
      opacityClass: "opacity-50 md:opacity-40",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]"
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