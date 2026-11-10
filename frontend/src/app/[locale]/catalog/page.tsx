import { catalogMetadata, CatalogView, type CatalogProps } from "@/components/CatalogView";

export const generateMetadata = (props: CatalogProps) => catalogMetadata(props);

export default function CatalogPage(props: CatalogProps) {
  return <CatalogView {...props} />;
}
