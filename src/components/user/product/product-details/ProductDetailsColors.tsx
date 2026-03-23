interface Props {
  colors?: string[];
}

const ProductDetailsColors = ({ colors = [] }: Props) => {
  if (!colors.length) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color, i) => (
        <span
          key={i}
          className="w-5 h-5 rounded-md border border-black/10"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ProductDetailsColors;
