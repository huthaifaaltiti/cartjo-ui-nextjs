import { memo } from "react";
import { ProductsContextProvider } from "@/contexts/Products.context";
import SearchProducts from "./SearchProducts";
import ProductsList from "./ProductsList";
import ProductsCreateButton from "./ProductsCreateButton";

const ProductsPage = () => {
  return (
    <ProductsContextProvider>
      <ProductsCreateButton />
      <SearchProducts />
      <div className="w-full mt-3">
        <ProductsList />
      </div>
    </ProductsContextProvider>
  );
};

export default memo(ProductsPage);
