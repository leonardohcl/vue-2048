function isValidCoords(row, col, width, height) {
  if (row < 0 || col < 0) return false;
  if (row >= height) return false;
  if (col >= width) return false;
  return true;
}

function isValidIdx(idx, width, height) {
  return idx >= 0 && idx < width * height;
}

function getCoordFromIdx(idx, width, height) {
  if (!isValidIdx(idx, width, height)) return { row: -1, col: -1 };
  const row = Math.floor(idx / width) % height,
    col = idx % width;
  return { row, col };
}

function getIdxFromCoord(row, col, width, height) {

  if (!isValidCoords(row, col, width, height)) return -1;

  const rowIdx = row * width;

  const colIdx = col % width;

  return rowIdx + colIdx;
}

const width = 3;
const height = 5;
const tests = new Array(10).fill(0).map(() => ({
  row: Math.floor(Math.random() * height),
  col: Math.floor(Math.random() * width),
}));

tests.forEach(({ row, col }) => {
  const idx = getIdxFromCoord(row, col, width, height);
  const coordsFromId = getCoordFromIdx(idx, width, height);

  console.log(
    `${row}, ${col} => got idx ${idx} | ${idx} got coords ${
      coordsFromId.row
    }, ${coordsFromId.col} | matched: ${
      coordsFromId.row === row && coordsFromId.col === col
    }`
  );
});
