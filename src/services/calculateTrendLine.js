import { linearRegression, linearRegressionLine } from 'simple-statistics';

function getLineDrawer(data) {
  const dataToFit = data.map((volumeEntry, idx) => {
    return [idx + 1, volumeEntry];
  });

  const lr = linearRegression(dataToFit);
  return linearRegressionLine(lr);
}

export function getFitLine(data) {
  const lineDrawer = getLineDrawer(data);
  return data.map((item, idx) => {
    const point = lineDrawer(idx + 1).toFixed(1);
    return point;
  });
}
