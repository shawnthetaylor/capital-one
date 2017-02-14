// needed to pad single digit values in date
// ie. 1 => 01
function pad(date) {
  let stringDate = date.toString();
  if (stringDate.length === 1) {
    stringDate = `0${stringDate}`;
  }
  return stringDate;
}

const utils = {
  convertISOToYMD: timestamp => {
    const seconds = Date.parse(timestamp);
    const d = new Date(seconds);

    return `${d.getUTCFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  },

  formatData: body => {
    const timeStamp = body.timestamp;
    let data = {};

    for (const key of Object.keys(body)) {
      if (key !== 'timestamp') {
        data[key] = body[key];
      }
    }
    return { timeStamp, data };
  }
}

module.exports = utils;
