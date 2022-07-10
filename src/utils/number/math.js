import {all, BigNumber, create} from 'mathjs'

const config = {
  number: BigNumber,
  precision: 20
};
const math = create(all, config);

export function multiply(x, y, format) {
  const formatRange = switchFormat(format);
  return Math.round(math.multiply(math.bignumber(x), math.bignumber(y)) * formatRange) / formatRange;
  // console.log(math.format(math.chain(math.bignumber(x)).multiply(math.bignumber(y)).done()).length);
  // return math.format(math.chain(math.bignumber(x)).multiply(math.bignumber(y)).done());
  // return Math.round(math.chain(x).multiply(y).done(), format);
}

export function divide(x, y, format) {
  const formatRange = switchFormat(format);
  return Math.round(math.divide(math.bignumber(x), math.bignumber(y)) * formatRange) / formatRange;
}

export function add(x, y, format) {
  const formatRange = switchFormat(format);
  return Math.round(math.format(math.add(math.bignumber(x), math.bignumber(y))) * formatRange) / formatRange;
}

export function subtract(x, y, format) {
  const formatRange = switchFormat(format);
  return Math.round(math.format(math.subtract(math.bignumber(x), math.bignumber(y))) * formatRange) / formatRange;
}

function switchFormat(format = 2) {
  switch (+format) {
    case 0:
      return 1;
    case 1:
      return 10;
    case 2:
      return 100;
    case 3:
      return 1000;
    case 4:
      return 10000;
  }
}

