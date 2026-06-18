import { memo } from "react";
import { BlocksIcon } from "lucide-react";
import { ProductsContextProvider } from "@/contexts/Products.context";
import SearchProducts from "./SearchProducts";
import ProductsList from "./ProductsList";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateProductForm from "./CreateProductForm";

const ProductsPage = () => {
  return (
    <ProductsContextProvider>
      <ModalCreateButton
        icon={<BlocksIcon />}
        createTranslationKey="routes.dashboard.routes.products.createProduct.label"
        ModalContent={<CreateProductForm />}
      />
      <SearchProducts />
      <div className="w-full mt-3">
        <ProductsList />
      </div>
    </ProductsContextProvider>
  );
};

export default memo(ProductsPage);
