
/**
   * 接收window.location,并返回一条对search两次加密后的路径，
   * 解决登录状态失效重新登录后，参数丢失的问题
   * @param {Object} location window.location
   */
export function encodeSearch(location = window.location) {
    return (
      location.origin + location.pathname + encodeURIComponent(encodeURIComponent(location.search))
    );
  }

/**
 * 判断当前路径是绝对路径还是相对路径
 * @param url 路径
 */
export function checkAbsUrl(url = '') {
  return /^(http(|s):)?\/\//.test(url);
}

/**
  * 根据给定的路径，获取全路径：
  * 1. 包含 http/https，为绝对路径，直接返回；
  * 2. 不包含，则拼接当前协议+域名+ url值返回
  * @param {String} url 路径
  */
export function getWholeUrl(url) {
 return checkAbsUrl(url) ? url : window.location.origin + url;
}

export default {
  encodeSearch,
  checkAbsUrl,
  getWholeUrl,
}