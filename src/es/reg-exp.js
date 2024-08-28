/**
 * 常见正则表达式.
 * @module regExp
 */

/**
 * 移动电话号码(中国)
 */
export const mobilePhoneCnReg = /^(1[3-9][0-9])([0-9]{4})([0-9]{4})$/;

/**
 * 固定电话号码(中国)
 */
export const telePhoneCnReg = /^[0][0-9]{2,4}-[0-9]{5,10}$/;

/**
 * 判断是否是中国手机号码
 * @param {string|number} val 号码
 * @returns 校验结果 true|false
 */
export function isCnPhone(val) {
  // 中国电话号码
  return mobilePhoneCnReg.test(val) || telePhoneCnReg.test(val);
}

/**
 * 邮箱正则表达式
 */
export const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,20}$/;

/**
 * 判断是否是email
 * @param {string|number} val 邮箱地址
 * @returns 校验结果 true|false
 */
export function isEmail(val) {
  // 中国电话号码
  return emailReg.test(val);
}

// http/https 开头的域名形式的 URL ，可以有路径和参数
export const domainUrlReg = /^http(s)?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,11}(:\d+)?(\/[^\s]+)*\/?([?&][^\s]+=[^\s]*)*$/;

// 校验localhost
export const localHostReg = /^http(s)?:\/\/localhost:(\d{1,9})$/;

// 只校验域名外加端口号，如 www.baidu.com 、www.163.com
export const domainReg = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,11}(:\d+)?$/;

// 校验http/https 开头的IP 形式的 URL ，可以有路径和参数
export const ipUrlReg = /^http(s)?:\/\/((2(5[0-5]|[0-4]\d))|(1\d{1,2})|([1-9]?\d))(\.((2(5[0-5]|[0-4]\d))|(1\d{1,2})|([1-9]?\d))){3}(:\d+)?(\/[^\s]+)*\/?([?&][^\s]+=[^\s]*)*$/;

// 只校验IP外加端口号，如 59.202.53.51:8081
export const ipReg = /^((2(5[0-5]|[0-4]\d))|(1\d{1,2})|([1-9]?\d))(\.((2(5[0-5]|[0-4]\d))|(1\d{1,2})|([1-9]?\d))){3}(:\d+)?$/;

/**
 * 校验链接地址，支持域名、IP及其参数形式
 * @param {string} val 链接地址
 * @returns 校验结果
 */
export function isUrl(val = '') {
  if (!val) {
    return false;
  }
  let noProtocol = val.replace(/http(s)?:\/\//, '');
  let pathIdx = noProtocol.indexOf('/');
  let portIdx = noProtocol.indexOf(':');
  let host = noProtocol;
  if (portIdx > -1) {
    host = noProtocol.substring(0, portIdx);
  } else if (pathIdx > -1) {
    host = noProtocol.substring(0, pathIdx);
  }
  // 如果是IP形式（4段式），则试用IP地址判断方式
  const isIpStyle = /^\d+(\.\d+){3}$/.test(host);
  if (isIpStyle) {
    return ipUrlReg.test(val);
  }
  if (host === 'localhost') {
    return localHostReg.test(val);
  }
  return domainUrlReg.test(val);
}

/**
 * 判断是否有特殊字符（除了数字、字母）
 * @param {String} str 待校验的字符串
 * @returns 校验结果
 */
export function hasSpecKeywordChart(str) {
  const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+/im;
  return reg.test(str);
}

/**
 * 判断是否含有汉字
 * @param {String} str 待校验的字符串
 * @returns 校验结果
 */
export function hasChineseChart(str) {
  return /[\u4E00-\u9FA5]+/.test(str);
}

/**
 * 使用match 代替 RegExp.$1 等匹配项，避免安全问题，提高性能
 * @param {String} input 输入字符串
 * @param {RegExp} pattern 正则表达式
 * @returns 匹配项
 */
export function extractPart(input, pattern, index = 1) {
    if (!input || !pattern) {
      return null;
    }
    const regex = new RegExp(pattern);
    const match = input.match(regex);
    return match ? match[index] : null;
}

export default {
  mobilePhoneCnReg,
  telePhoneCnReg,
  isCnPhone,

  emailReg,
  isEmail,

  domainUrlReg,
  localHostReg,
  domainReg,
  ipUrlReg,
  ipReg,
  isUrl,

  hasSpecKeywordChart,
  hasChineseChart,

  extractPart
};
