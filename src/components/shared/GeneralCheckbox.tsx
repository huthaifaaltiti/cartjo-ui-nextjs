import { memo } from "react";
import { Checkbox } from "../ui/checkbox";

interface Props {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

const GeneralCheckbox = ({ id, checked, onChange, className }: Props) => {
  return (
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className={`border-gray-300 rounded 
        data-[state=checked]:bg-primary-500 
        data-[state=checked]:border-primary-500 
        data-[state=checked]:text-white-50 
        ${className ?? ""}`}
    />
  );
};

export default memo(GeneralCheckbox);
