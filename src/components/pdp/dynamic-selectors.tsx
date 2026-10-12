import { useProductList } from "@/pages/ProductPage";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";
import { useMemo, useCallback } from "react";
import useGetSkuFromQuery from "@/hooks/use-get-sku-from-query";
import { useProdctDetail } from "@/store/product-detail";

type DynamicVariantSelectorProps = {
  styles: {
    sectionStyle: string;
    labelStyle: string;
    labelBoldStyle: string;
    wrapperStyle: string;
    pillStyle: string;
    pillSelectedStyle: string;
    pillImageStyle?: string;
    valueStyle?: string;
  };
  optionStyles?: {
    sectionStyle: string;
    labelStyle: string;
    wrapperStyle: string;
    itemStyle: string;
    itemSelectedStyle: string;
  };
};

export const DynamicVariantSelector = ({
  styles,
  optionStyles,
}: DynamicVariantSelectorProps) => {
  const { products = [] } = useProductList();
  const [, updateSku] = useGetSkuFromQuery();
  const currentProduct = useProdctDetail();

  const selectedAttributes = currentProduct?.attributes || {};

  /* ---------- SIZE SORT ---------- */
  const sortSizes = useCallback(
    (options: { value: string; sku: string; swatch?: string }[]) => {
      const sizeOrder = [
        "XXXS",
        "XXS",
        "XS",
        "S",
        "SM",
        "M",
        "MD",
        "ME",
        "L",
        "LG",
        "XL",
        "XXL",
        "XXXL",
        "XXXXL",
      ];

      const normalize = (v: string) => v.trim().toUpperCase();

      return [...options].sort((a, b) => {
        const aVal = normalize(a.value);
        const bVal = normalize(b.value);

        const aNum = Number(aVal);
        const bNum = Number(bVal);

        const aIsNum = !isNaN(aNum);
        const bIsNum = !isNaN(bNum);

        if (aIsNum && bIsNum) return aNum - bNum;

        if (!aIsNum && !bIsNum) {
          const ai = sizeOrder.indexOf(aVal);
          const bi = sizeOrder.indexOf(bVal);
          if (ai !== -1 && bi !== -1) return ai - bi;
          return aVal.localeCompare(bVal);
        }

        return aIsNum ? -1 : 1;
      });
    },
    [],
  );

  /* ---------- AVAILABLE ATTRIBUTES ---------- */
  const availableAttributes = useMemo(() => {
    const attrs = new Set<string>();
    products.forEach((p) => {
      Object.keys(p.attributes || {}).forEach((k) => attrs.add(k));
    });
    return Array.from(attrs);
  }, [products]);

  /* ---------- CHECK SELECTABLE ---------- */
  const isSelectable = useCallback(
    (attr: string, value: string) => {
      return products.some((p) => {
        return Object.entries({
          ...selectedAttributes,
          [attr]: value,
        }).every(([key, val]) => {
          const pVal = p.attributes?.[key];
          if (Array.isArray(pVal)) return pVal.includes(val);
          return pVal === val;
        });
      });
    },
    [products, selectedAttributes],
  );

  /* ---------- GET OPTIONS ---------- */
  const getOptionsForAttribute = useCallback(
    (attr: string) => {
      const map = new Map<
        string,
        { value: string; sku: string; swatch?: string }
      >();

      products.forEach((p) => {
        const val = p.attributes?.[attr];
        if (!val) return;

        const values = Array.isArray(val) ? val : [val];

        values.forEach((v) => {
          if (!map.has(v)) {
            map.set(v, {
              value: v,
              sku: p.sku,
              swatch:
                attr.toLowerCase() === "color" || attr.toLowerCase() === "shade"
                  ? p.swatch
                  : undefined,
            });
          }
        });
      });

      let result = Array.from(map.values());

      if (attr.toLowerCase() === "size") {
        result = sortSizes(result);
      }

      return result;
    },
    [products, sortSizes],
  );

  /* ---------- HANDLE SELECT ---------- */
  const handleSelect = useCallback(
    (attr: string, value: string) => {
      const prioritized = products.filter((p) => {
        const pVal = p.attributes?.[attr];
        if (Array.isArray(pVal)) return pVal.includes(value);
        return pVal === value;
      });

      if (!prioritized.length) return;

      const found =
        prioritized.find((p) =>
          Object.entries(selectedAttributes).every(([k, v]) => {
            if (k === attr) return true;
            const pVal = p.attributes?.[k];
            if (Array.isArray(pVal)) return pVal.includes(v);
            return pVal === v;
          }),
        ) || prioritized[0];

      updateSku?.(found.sku);
    },
    [products, selectedAttributes, updateSku],
  );

  if (!availableAttributes.length) return null;

  return (
    <>
      {availableAttributes.map((attr) => {
        const options = getOptionsForAttribute(attr);

        let isColor =
          attr.toLowerCase() === "color" || attr.toLowerCase() === "shade";

        if (isColor) {
          isColor = options.some((opt) => opt.swatch);
        }

        const label =
          attr.charAt(0).toUpperCase() + attr.slice(1).replace("_", " ");

        const selectedValue = selectedAttributes[attr];
        const selectedValueString = Array.isArray(selectedValue)
          ? selectedValue[0]
          : selectedValue;

        const activeSectionStyle = isColor
          ? styles.sectionStyle
          : optionStyles?.sectionStyle || styles.sectionStyle;

        const activeLabelStyle = isColor
          ? styles.labelStyle
          : optionStyles?.labelStyle || styles.labelStyle;

        const activeWrapperStyle = isColor
          ? styles.wrapperStyle
          : optionStyles?.wrapperStyle || styles.wrapperStyle;

        return (
          <div key={attr} className={activeSectionStyle}>
            <Label className={activeLabelStyle}>
              <span className={styles.labelBoldStyle}>{label} </span>
              {selectedValueString && (
                <span className={styles.valueStyle}>{selectedValueString}</span>
              )}
            </Label>

            <div className={activeWrapperStyle}>
              {options
                .filter((opt) => isSelectable(attr, opt.value))
                .map((opt) => {
                  const isSelected = Array.isArray(selectedValue)
                    ? selectedValue.includes(opt.value)
                    : selectedValue === opt.value;

                  let itemClass = "";
                  if (isColor) {
                    itemClass = clsx(
                      styles.pillStyle,
                      isSelected ? styles.pillSelectedStyle : "",
                    );
                  } else {
                    itemClass = clsx(
                      isSelected
                        ? optionStyles?.itemSelectedStyle ||
                            styles.pillSelectedStyle
                        : optionStyles?.itemStyle || styles.pillStyle,
                    );
                  }

                  return (
                    <div
                      key={opt.value}
                      className={itemClass}
                      onClick={() => handleSelect(attr, opt.value)}
                      title={opt.value}
                    >
                      {isColor && opt.swatch ? (
                        <img
                          src={opt.swatch}
                          alt={opt.value}
                          className={styles.pillImageStyle}
                        />
                      ) : (
                        <span>{opt.value}</span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </>
  );
};
