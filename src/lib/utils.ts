import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4)
}

export const getUnixTimeStamp = (time: number) => {
  return Math.floor(time / 1000)
}
