import { catalogMetadata, CatalogView, type CatalogProps } from "@/components/CatalogView";

// ЧПУ категории: /ru/catalog/rings
export const generateMetadata = (props: CatalogProps) => catalogMetadata(props);

export default function CategoryPage(props: CatalogProps) {
  return <CatalogView {...props} />;
}
