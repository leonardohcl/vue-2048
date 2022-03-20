export const rest = async restTime =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, restTime);
  });
