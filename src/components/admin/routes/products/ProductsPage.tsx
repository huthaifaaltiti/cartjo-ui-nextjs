import { memo } from "react";

import { Product } from "@/types/product.type";

import { ProductsContextProvider } from "@/contexts/Products.context";
import SearchProducts from "./SearchProducts";
import ProductsList from "./ProductsList";

type ProductsPageProps = {
  initialProducts: Product[];
  token: string;
};

const ProductsPage = ({ initialProducts, token }: ProductsPageProps) => {
  return (
    <ProductsContextProvider token={token}>
      <SearchProducts />

      <div className="w-full mt-3">
        <ProductsList initialProducts={initialProducts} />
      </div>
    </ProductsContextProvider>
  );
};

export default memo(ProductsPage);
