import { useIsMobileWidth } from "@/hooks/use-mobile-width";
import { useProdctDetail } from "@/store/product-detail";
import { Render } from "../conditional";
import FavoriteButton from "../favorites-button";

export const ProductTitleWithFav = ({ styles, showFavorite }: { styles?: any, showFavorite?: boolean }) => {
  const product = useProdctDetail();
  const isMobileWidth = useIsMobileWidth();
  const shouldShowFavorite = showFavorite !== false;
  
  return (
    <div className={styles.titleWrapperStyle}>
      <h2 className={styles.titleStyle}>{product.title}</h2>
      <Render
        when={isMobileWidth && shouldShowFavorite}
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
