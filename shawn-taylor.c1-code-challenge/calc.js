const calc = {
  min: data => {
    return Math.min(...data);
  },
  max: data => {
    return Math.max(...data);
  },
  average: data => {
    const sum = data.reduce((x, y) => x + y);
    const average = sum / data.length;
    // limit precision of floats to 3 (from docs)
    return Number(average.toPrecision(3));
  },
  median: data => {
    data.sort();
    const index = data.length > 1 ? Math.floor(data.length/2)-1 : 0;
    return data[index];
  }
}

module.exports = calc;
