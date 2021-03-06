import { linearRegression, linearRegressionLine } from 'simple-statistics';

function getLineDrawer(data) {
  const dataToFit = data.map((volumeEntry, idx) => {
    let valToFit;
    if (typeof volumeEntry === 'string') {
      valToFit = parseFloat(volumeEntry);
    } else {
      valToFit = volumeEntry;
    }
    return [idx + 1, valToFit];
  });

  const lr = linearRegression(dataToFit);
  return linearRegressionLine(lr);
}

export function getFitLine(data) {
  const lineDrawer = getLineDrawer(data);
  return data.map((item, idx) => {
    return lineDrawer(idx + 1).toFixed(1);
  });
}
