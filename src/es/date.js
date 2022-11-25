/**
 * 时间转换.
 * @module dateUtils
 */
/**
 * 校验当前值是否是正确的时间格式
 * 1. 是，则返回标准时间对象；
 * 2. 否则，返回 null
 * @param {Number|String|Date} d 符合规范的时间格式
 */
 export function checkValid(d) {
  if (d === '' || d === null || d === undefined) {
    return null;
  }
  let date = new Date(d);
  if (d instanceof Date) {
    if (d.toString() !== 'Invalid Date') {
      date = d;
    } else {
      date = null;
    }
  } else if (!!d && new Date(d).toString() === 'Invalid Date') {
    date = null;
  }
  return date;
}

/**
 * 格式化时间
 * @param {Number|String|Date} d 符合规范的时间格式
 * @param {String} formatter 需要定制的时间格式模板，默认 'yyyy-MM-dd'
 */
export function format(d, formatter = 'yyyy-MM-dd') {
  const date = checkValid(d);
  if (!date) {
    return d ? d.toString() : '';
  }
  let fmt = formatter;
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k].toString()
          : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  });
  return fmt;
}


/**
 * 计算当前时间所经历的起至月份，起点月份为一月
 * @param {Date} d 时间对象
 * @param {String} formatter 需要定制的时间格式模板，默认 'yyyy-MM'
 */
export function getStartAndEndMonth(d = new Date(), formatter = 'yyyy-MM') {
  const date = this.checkValid(d);
  if (!date) {
    return { startMonth: '', endMonth: '' };
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const startMonth = `${year}-01`;
  const endMonth = `${year}-${month < 9 ? '0' : ''}${month + 1}`;
  return {
    startMonth: formatter === 'yyyy-MM' ? startMonth : format(startMonth, formatter),
    endMonth: formatter === 'yyyy-MM' ? endMonth : format(endMonth, formatter),
  };
}

/**
 * 计算当前时间所经历的起至天，起点月份为一月一号
 * @param {Date} d 时间对象
 */
export function getStartAndEndDay(d = new Date(), formatter = 'yyyy-MM') {
  const date = this.checkValid(d);
  if (!date) {
    return { startDate: '', endDate: '' };
  }
  const year = date.getFullYear();
  // const month = date.getMonth();
  const startMonth = `${year}-01-01`;
  const endMonth = `${year}-${month < 9 ? '0' : ''}${month + 1}`;
  return {
    startDate: formatter === 'yyyy-MM' ? startMonth : format(startMonth, formatter),
    endDate: format(date, formatter),
  };
}


/**
 * 判断当前时间是否大于等于 9999-12-31，企业注册一般设置的最长时间
 * @param {Number|String|Date} d 符合规范的时间格式
 */
export function checkLong(d) {
  const date = this.checkValid(d);
  if (!date) {
    return false;
  }
  const time = date.getTime();
  // new Date('9999-12-31').getTime() => 253402214400000
  return time >= 253402214400000;
}

export default {
  checkValid,
  format,
  getStartAndEndMonth,
  getStartAndEndDay,
  checkLong
};
