function DateValidator(timeStamp) {
  const parsedDate = Date.parse(timeStamp);
  return !isNaN(parsedDate);
}

function FloatValidator(data) {
  if (typeof data === 'number') {
    return true;
  }
  if (typeof data === 'object' && Object.keys(data).length) {
    for (const key of Object.keys(data)) {
      if (typeof data[key] !== 'number') {
        return false;
      }
    }
    return true;
  }
  return false;
}

module.exports = { DateValidator, FloatValidator };
