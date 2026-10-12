import { Product } from "@/types/product";
import { compareSizesDirect } from "@/utils/sort-sizes";

export type ResolvedVariant = {
  sku: string;
  axes: Record<string, string>;
  swatch?: string;
};

export type AxisOption = {
  value: string;
  disabled: boolean;
  image?: string;
  active?: boolean;
};

const COLOR_ATTRIBUTE_KEYS = ["Color", "color", "shade"] as const;
const SIZE_ATTRIBUTE_KEYS = ["Size", "size"] as const;
const LENGTH_ATTRIBUTE_KEYS = ["Length", "length"] as const;

const CLAIMED_ATTRIBUTE_KEYS = new Set<string>([
  ...COLOR_ATTRIBUTE_KEYS,
  ...SIZE_ATTRIBUTE_KEYS,
  ...LENGTH_ATTRIBUTE_KEYS,
]);

function firstNonEmpty(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (Array.isArray(value) && value.length > 0) {
    return firstNonEmpty(value[0]);
  }

  return undefined;
}

function pickAttribute(
  attributes: Record<string, unknown> | undefined,
  keys: readonly string[],
): string | undefined {
  if (!attributes) {
    return undefined;
  }

  for (const key of keys) {
    const value = firstNonEmpty(attributes[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
}

function extractFromAttributes(product: Product): Record<string, string> {
  const axes: Record<string, string> = {};
  const attributes = product.attributes;

  const color = pickAttribute(attributes, COLOR_ATTRIBUTE_KEYS);
  if (color) {
    axes.color = color;
  }

  const size = pickAttribute(attributes, SIZE_ATTRIBUTE_KEYS);
  if (size) {
    axes.size = size;
  }

  const length = pickAttribute(attributes, LENGTH_ATTRIBUTE_KEYS);
  if (length) {
    axes.length = length;
  }

  if (!attributes) {
    return axes;
  }

  for (const [key, raw] of Object.entries(attributes)) {
    if (CLAIMED_ATTRIBUTE_KEYS.has(key) || axes[key]) {
      continue;
    }

    const value = firstNonEmpty(raw);
    if (value) {
      axes[key] = value;
    }
  }

  return axes;
}

function extractFromLists(
  product: Product,
  axes: Record<string, string>,
): Record<string, string> {
  const next = { ...axes };

  if (!next.color) {
    const fromColors = firstNonEmpty(product.colors);
    const fromSwatch = firstNonEmpty(product.swatchName);
    const color = fromColors ?? fromSwatch;
    if (color) {
      next.color = color;
    }
  }

  if (!next.size) {
    const size = firstNonEmpty(product.sizes);
    if (size) {
      next.size = size;
    }
  }

  return next;
}

export function resolveVariant(product: Product): ResolvedVariant {
  const axes = extractFromLists(product, extractFromAttributes(product));

  return {
    sku: product.sku,
    axes,
    swatch: firstNonEmpty(product.swatch),
  };
}

export function resolveVariants(products: Product[]): ResolvedVariant[] {
  return products.map(resolveVariant);
}

export function matches(
  variant: ResolvedVariant,
  desired: Record<string, string>,
): boolean {
  return Object.entries(desired).every(
    ([key, value]) => variant.axes[key] === value,
  );
}

export function nextSku(
  resolved: ResolvedVariant[],
  selectedAxes: Record<string, string>,
  axis: string,
  value: string,
): string | undefined {
  const desired = { ...selectedAxes, [axis]: value };

  const exact = resolved.find((variant) => matches(variant, desired));
  if (exact) {
    return exact.sku;
  }

  return resolved.find((variant) => variant.axes[axis] === value)?.sku;
}

function uniqueAxisValues(resolved: ResolvedVariant[], axis: string): string[] {
  const values: string[] = [];
  const seen = new Set<string>();

  for (const variant of resolved) {
    const value = variant.axes[axis];
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    values.push(value);
  }

  if (axis === "size") {
    return values.sort(compareSizesDirect);
  }

  return values;
}

function isValueAvailable(
  resolved: ResolvedVariant[],
  selectedAxes: Record<string, string>,
  axis: string,
  value: string,
): boolean {
  return resolved.some((variant) =>
    matches(variant, { ...selectedAxes, [axis]: value }),
  );
}

export function buildAxisOptions(
  resolved: ResolvedVariant[],
  selectedAxes: Record<string, string>,
): Record<string, AxisOption[]> {
  const axes = new Set<string>();
  for (const variant of resolved) {
    for (const key of Object.keys(variant.axes)) {
      axes.add(key);
    }
  }

  const options: Record<string, AxisOption[]> = {};

  for (const axis of axes) {
    options[axis] = uniqueAxisValues(resolved, axis).map((value) => {
      const option: AxisOption = {
        value,
        disabled: !isValueAvailable(resolved, selectedAxes, axis, value),
      };

      if (axis === "color") {
        const withSwatch = resolved.find(
          (variant) => variant.axes.color === value && variant.swatch,
        );
        option.image = withSwatch?.swatch;
        option.active = selectedAxes.color === value;
      }

      return option;
    });
  }

  return options;
}
