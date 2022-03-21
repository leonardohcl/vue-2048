import color from "./color";

const BASE_COLORS = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

export const COLOR = BASE_COLORS.reduce(
  (dict, val, idx) => {
    dict[`${idx + 1}`] = val;
    return dict;
  },
  { FIRST: BASE_COLORS[0], LAST: BASE_COLORS[BASE_COLORS.length - 1] }
);

const MAX_PALETTE_SIZE = BASE_COLORS.length;

const POINTERS = ["circle", "rect", "triangle", "start"];

export const getSetPointer = idx => {
  return POINTERS[Math.floor(idx / 10)];
};

export function getSetColor(idx, setsCount) {
  const palette = color.gradientPalette(
    BASE_COLORS,
    setsCount > MAX_PALETTE_SIZE ? MAX_PALETTE_SIZE : setsCount,
    true
  );

  return palette[idx >= palette.length ? idx % palette.length : idx];
}

export default {
  getSetColor,
  getSetPointer,
  COLOR,
};
