import { memo } from "react";
import { BlocksIcon } from "lucide-react";
import { Product } from "@/types/product.type";
import { Category } from "@/types/category.type";
import { ProductsContextProvider } from "@/contexts/Products.context";
import SearchProducts from "./SearchProducts";
import ProductsList from "./ProductsList";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateProductForm from "./CreateProductForm";

type ProductsPageProps = {
  initialProducts: Product[];
  initialCategories: Category[];
  token: string | null;
};

const ProductsPage = ({
  initialProducts,
  initialCategories,
  token,
}: ProductsPageProps) => {
  return (
    <ProductsContextProvider token={token}>
      <ModalCreateButton
        icon={<BlocksIcon />}
        createTranslationKey="routes.dashboard.routes.products.createProduct.label"
        ModalContent={<CreateProductForm categories={initialCategories} />}
      />

      <SearchProducts />

      <div className="w-full mt-3">
        <ProductsList initialProducts={initialProducts} />
      </div>
    </ProductsContextProvider>
  );
};

export default memo(ProductsPage);
