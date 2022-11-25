/**
 * 处理数字或数字字符串
 * @param {String|Number} val 需要处理的数字或数字字符串
 * @returns 符合要求的数字
 */
export function formatNum(val) {
  return Number.isNaN(Number(val)) ? 0 : Number(val)
}

/**
 * 按照如下规则显示数字
 * 1. 不满一万的，显示具体数字；
 * 2. 超过一万的，截取一位小数，如 235000 =》 23.5万
 * 3. 超过一千万的，保留四位万以上数据，如1235000 =》 1234万（四舍五入）；
 * 4. 亿、兆以此类推；
 * 5. 不能大于 Number.MAX_SAFE_INTEGER
 * @param {Number} val 需要定制的整数，不能是小数
 * @param {Number} scale 小数点位数
 * @param {*} needLocalUnit 是否需要使用“中国”数字表述方式
 * @return 结果为对象 { value, unit }
 */
export function formatInteger(val, scale, needLocalUnit = true) {
  const num = formatNum(val);
  // const positive = num < 0;
  const v = Math.abs(num);
  if (!needLocalUnit) {
    // 25000 => 25,000; -25000 => -25,000
    return { value: num.toLocaleString(), unit: '' };
  }

  if (v > Number.MAX_SAFE_INTEGER) {
    // 5. 超过最大数，返回空
    return {
      value: '',
      unit: '',
    };
  }
  let value = v;
  let unit = '';
  const power = Math.floor(Math.log10(v));
  let remainder;
  if (power < 4) {
    // 最多显示四个数字，包括小数位，小数位最多一位
    // 1. 不满一万的，显示具体数字；2500 => 2,500
    value = v;
    if (scale !== undefined && scale >= 0) {
      value = value.toFixed(scale);
    } else {
      value = power === 3 ? value.toFixed(0) : value.toFixed(1);
    }
  } else if (power >= 4 && power < 8) {
    unit = '万';
    value = v / 10000;
    remainder = v % 10 ** 4;
    // 2. 小于一千万的，截取一位小数，如 235000 =》 23.5万
    if (remainder) {
      if (scale !== undefined && scale >= 0) {
        value = value.toFixed(scale);
      } else {
        value = power === 7 ? value.toFixed(0) : value.toFixed(1);
      }
    }
  } else if (power >= 8 && power < 12) {
    unit = '亿';
    value = v / 100000000;
    remainder = v % 10 ** 8;
    // 3. 小于一千亿的，截取一位小数，如 2350000000 =》 23.5亿
    // 4. 超过一亿的，保留四位万以上数据，如1235000 =》 1234万（四舍五入）；
    if (remainder) {
      if (scale !== undefined && scale >= 0) {
        value = value.toFixed(scale);
      } else {
        value = power === 11 ? value.toFixed(0) : value.toFixed(1);
      }
    }
  } else if (power >= 12 && power < 16) {
    unit = '兆';
    value = v / 1000000000000;
    remainder = v % 10 ** 12;
    // 4. 超过一兆的，但是需要小于最大表示值，大概 900兆
    if (remainder) {
      if (scale !== undefined && scale >= 0) {
        value = value.toFixed(scale);
      } else {
        value = power === 15 ? value.toFixed(0) : value.toFixed(1);
      }
    }
  }

  // 小于0，带上负号
  return {
    value: `${num < 0 ? '-' : ''}${value.toLocaleString()}`,
    unit,
  };
}

/**
 * 按照如下规则显示数字，将方法 formatInteger 的结果转为字符串形式
 * 1. 不满一万的，显示具体数字；
 * 2. 超过一万的，截取一位小数，如 235000 =》 23.5万
 * 3. 超过一千万的，保留四位万以上数据，如1235000 =》 1234万（四舍五入）；
 * 4. 亿、兆以此类推；
 * 5. 不能大于 Number.MAX_SAFE_INTEGER
 * @param {Number} val 需要定制的整数，不能是小数
 * @param {Number} scale 小数点位数
 * @param {*} needLocalUnit 是否需要使用“中国”数字表述方式
 * @return 结果为字符串`${value}${unit}`
 */
export function formatIntegerToStr(val, scale, needLocalUnit = true) {
  const { value, unit } = formatInteger(val, scale, needLocalUnit);
  return `${value}${unit}`;
}

/**
 * 按照中国人的习惯，定制数据：
 * 1. 刚超过一万、一亿、一兆，保留一位小数，
 * 2. 其他情况，以实际设置的 scale 为准
 *
 * @param {Number} val 需要定制的整数，不能是小数
 * @param {Number} scale 小数点位数
 */
export function handleChineseInterger(val, scale) {
  const power = Math.floor(Math.log10(val));
  // 刚超过 一万、一亿、一兆，则保留一位小数
  if (power === 4 || power === 8 || power === 12) {
    return formatIntegerToStr(val, -1, true);
  }
  // 其余情况下，不需要小数
  return formatIntegerToStr(val, scale, true);
}

/**
 * 将传入值格式化，如：
 * 1. 13500 => 13,500;
 * @param {Number|String} val 数字或数字型字符串
 * @param {Number|String} defaultVal 当val为空时，返回，默认为0
 */
export function toLocaleString(val = '', defaultVal = '') {
  // 空值时，返回默认值
  if (val === undefined || val === null || val === '') {
    return defaultVal;
  }
  // 非空值时，是数字，返回定制化后的字符串
  if (!Number.isNaN(Number(val))) {
    // 25000 => 25,000; -25000 => -25,000
    return Number(val).toLocaleString();
  }
  // 数据不是数字或纯数字的字符串，返回默认值；若默认值不存在，则返回该值
  return defaultVal || val;
}

/**
 * 求 a / b 百分数，默认保留两位小数
 * @param {Number} a 分子
 * @param {Number} b 分母
 * @param {Number} scale 小数位数
 */
export function percent(a = 0, b = 1, scale = 2) {
  if (b === 0 || Number.isNaN(Number(b))) {
    return 0;
  }
  const _a = a === null || a === '' || Number.isNaN(Number(a)) ? 0 : Number(a);
  const _b = b === null || b === '' ? 1 : Number(b);
  const remainder = (_a * 100) % _b;
  // const remainder = math.multiply(math.bignumber(_a), 100);
  const quotient = ((_a * 100) / _b).toFixed(scale);
  return remainder === 0 ? Number(quotient) : Number(quotient);
}

/**
 * 求 a / b 百分数，默认保留两位小数，携带百分符号
 * @param {Number} a 分子
 * @param {Number} b 分母
 * @param {Number} scale 小数位数
 */
export function percentWithSymbol(a = 0, b = 1, scale = 2) {
  return `${percent(a, b, scale)}%`;
}

/**
 * num<0，显示0
 * num>1， 显示1
 * @param {Number} a 传入的数值
 */
export function range(a, max = 1, min = 0) {
  let v = a;
  if (a < min) {
    v = min;
  } else if (a > max) {
    v = max;
  }
  return v;
}

export default {
  formatNum, formatInteger, formatIntegerToStr, handleChineseInterger, toLocaleString,
  percent, percentWithSymbol, range
}