export const sum = arr => arr.reduce((acc, next) => acc + next, 0);

export const mean = arr => {
  return sum(arr) / arr.length;
};

export const batchNormaliztion = batch => {
  const mean = sum(batch) / batch.length;
  const stdVar = Math.sqrt(
    sum(batch.map(x => (x - mean) * (x - mean))) / batch.length
  );
  return batch.map(x => (x - mean) / (stdVar + 1));
};

export const softmax = arr => {
  const arrExpSum = arr
    .map(x => Math.exp(x))
    .reduce((acc, next) => acc + next, 0);
  return arr.map(x => {
    if (arrExpSum == 0) return 0;
    return Math.exp(x) / arrExpSum;
  });
};

export const range = (start, end = null) => {
  if (end == null) return new Array(start).fill(0).map((x, idx) => idx);
  const size = end - start;
  return new Array(size).fill(0).map((x, idx) => start + idx);
};
