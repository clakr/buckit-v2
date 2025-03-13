import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToCurrency(value: number) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

export function closeDialog() {
  const closeButtonElement = document.querySelector<HTMLButtonElement>(
    "button[data-button=close]",
  );
  closeButtonElement?.click();
}
