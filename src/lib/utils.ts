import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Gender } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateBMR = (
  weight: string,
  height: string,
  age: string,
  gender: Gender | ''
): number => {
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const ageNum = parseFloat(age);

  if (gender === 'male') {
    return 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
  }
  return 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
};