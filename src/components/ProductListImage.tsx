import { useEffect, useRef, useState } from "react";
import { ProductListItem } from "@/types/product";

export type ListImageProps = {
  src?: string;
  alt?: string;
  product?: ProductListItem;
  styles: { image: string };
  /** Raise priority for above-the-fold cards (defaults to high). */
  fetchPriority?: "high" | "low" | "auto";
};

export const ProductListImage = (props: ListImageProps) => {
  const {
    src,
    alt,
    product,
    styles,
    fetchPriority = "high",
  } = props;
  const imageSrc = product?.imageUrl ?? src;
  const imageAlt = product?.title ?? alt ?? "";
  const imgRef = useRef<HTMLImageElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>();

  useEffect(() => {
    setLoadedSrc(undefined);
    const img = imgRef.current;
    if (img?.complete && img.currentSrc) {
      setLoadedSrc(imageSrc);
    }
  }, [imageSrc]);

  const isLoaded = Boolean(imageSrc) && loadedSrc === imageSrc;

  if (!imageSrc) return null;

  return (
    <img
      key={imageSrc}
      ref={imgRef}
      src={imageSrc}
      alt={imageAlt}
      className={styles.image}
      loading="eager"
      decoding="async"
      fetchPriority={fetchPriority}
      style={{ opacity: isLoaded ? 1 : 0 }}
      onLoad={() => setLoadedSrc(imageSrc)}
    />
  );
};
