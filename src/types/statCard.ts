type AllowedColors =
  | "purple"
  | "green"
  | "teal"
  | "red"
  | "orange"
  | "yellow"
  | "blue"
  | "gray";

export type StatCardType = {
  label: string;
  value: number;
  color: AllowedColors;
  icon: React.ElementType;
};
