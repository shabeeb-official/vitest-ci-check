const alphaOrder = [
  "2XS",
  "XS",
  "XS/S",
  "S",
  "S/M",
  "M",
  "M/L",
  "L",
  "L/XL",
  "XL",
  "XLS",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
];

function parseSize(size: string) {
  const clean = size.trim().toUpperCase();

  if (/^\d+(\.\d+)?$/.test(clean)) {
    return { type: "number", value: parseFloat(clean) };
  }

  if (/^\d+(\.\d+)?[-/]\d+(\.\d+)?$/.test(clean)) {
    const parts = clean.split(/[-/]/).map(parseFloat);
    return { type: "range", value: parts };
  }

  const alphaIndex = alphaOrder.indexOf(clean);
  if (alphaIndex !== -1) {
    return { type: "alpha", value: alphaIndex };
  }

  if (/^(UK\s*\d+|[A-Z]+\d+|[MW]\d+W?\d*)$/.test(clean)) {
    return { type: "hybrid", value: clean };
  }

  return { type: "special", value: clean };
}

export function compareSizesDirect(a: string, b: string) {
  const order = { number: 0, range: 1, alpha: 2, hybrid: 3, special: 4 };
  const pa = parseSize(a);
  const pb = parseSize(b);

  if (pa.type !== pb.type) return order[pa.type] - order[pb.type];

  switch (pa.type) {
    case "number":
      return pa.value - pb.value;
    case "range":
      return pa.value[0] - pb.value[0] || pa.value[1] - pb.value[1];
    case "alpha":
      return pa.value - pb.value;
    case "hybrid":
    case "special":
      return pa.value.localeCompare(pb.value);
    default:
      return 0;
  }
}

export function compareSizes(a: string, b: string) {
  const order = { number: 0, range: 1, alpha: 2, hybrid: 3, special: 4 };
  const pa = parseSize(a.size);
  const pb = parseSize(b.size);

  if (pa.type !== pb.type) return order[pa.type] - order[pb.type];

  switch (pa.type) {
    case "number":
      return pa.value - pb.value;
    case "range":
      return pa.value[0] - pb.value[0] || pa.value[1] - pb.value[1];
    case "alpha":
      return pa.value - pb.value;
    case "hybrid":
    case "special":
      return pa.value.localeCompare(pb.value);
    default:
      return 0;
  }
}
