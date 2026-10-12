import { Render } from "@/components/conditional";
import FavoriteButton from "@/components/favorites-button";
import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { useProdctDetail } from "@/store/product-detail";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProductTitleWithFav = ({ styles }: { styles?: any }) => {
  const product = useProdctDetail();
  const isMobileWidth = useIsMobileWidth();

  return (
    <div className={styles.titleWrapperStyle}>
      <h2 className={styles.titleStyle}>{product.title}</h2>
      <Render
        when={isMobileWidth}
        show={
          <div>
            <FavoriteButton
              styles={styles}
              sku={product.sku}
              position="static"
            />
          </div>
        }
      />
    </div>
  );
};
