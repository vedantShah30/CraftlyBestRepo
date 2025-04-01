export const MAIN_BG_COLOR = "bg-black";

export const MAIN_TXT_COLOR = "text-white";

export const BTN_CLS = "border rounded px-2 py-1 w-full";

export const MAIN_BORDER_COLOR = "rounded border border-[#646464]";

export const ROUND_BORDER_COLOR = `rounded border border-[#646464]`;

export function cx(...inputs: any[]): string {
  const inp = Array.isArray(inputs[0]) ? inputs[0] : [...inputs];
  return inp.filter(Boolean).join(" ");
}
