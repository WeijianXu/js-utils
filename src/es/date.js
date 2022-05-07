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
 * @param {String} formatter 需要定制的时间格式模板
 */
export function dateFomat(d, formatter = 'yyyy-MM-dd') {
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

export default {
  checkValid,
  dateFomat,
};
