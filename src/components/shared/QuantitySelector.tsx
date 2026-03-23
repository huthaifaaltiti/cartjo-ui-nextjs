import { Minus, Plus } from "lucide-react";

interface Props {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  max: number;
}

const QuantitySelector = ({ quantity, setQuantity, max }: Props) => {
  return (
    <div className="flex items-center border rounded-xl overflow-hidden">
      <button
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="w-10 h-10 flex items-center justify-center"
      >
        <Minus size={14} />
      </button>

      <span className="px-4 font-bold">{quantity}</span>

      <button
        onClick={() => setQuantity((q) => Math.min(max, q + 1))}
        className="w-10 h-10 flex items-center justify-center"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
