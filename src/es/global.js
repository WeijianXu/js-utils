/**
 * 收集或设置一些对 window 上的属性进行的操作，或者全局常用操作
 * @module GlobalUtils
 */

/**
   * 根据屏幕自动计算字体大小
   * 基准：1920*1080 使用 16px 字体
   * @param {Number} fontSize 字体大小
   * @param {Option} option   配置参数，默认 `{ base: 1920, keep: false }`
   */
export function getFontSize(fontSize = 16, options) {
  const { base = 1920, keep = false } = options || {};
  if (keep) {
    return fontSize;
  }
  return Math.floor(fontSize / (base / window.innerWidth));
}

/**
 * 根据屏幕自动计算当前 px 转化后的值，适应宽度；大屏常用（动态处理px方案）
 * 基准：1920*1080
 * @param {Number} px 像素值
 */
export function fitScreenWidth(px = 0) {
  return getFontSize(px);
}

/**
 * 根据屏幕自动计算当前 px 转化后的值，适应高度；大屏常用（动态处理px方案）
 * 基准：1920*1080
 * @param {Number} px 像素值
 */
export function fitScreenHeight(px = 0) {
  return Math.floor(px / (1080 / window.innerHeight));
}

/**
 * js控制根节点字体大小设置，大屏常用（rem适配方式适用）
 * @param {Number|String} fontSize 字体大小
 */
export function setFontSizeToRoot(fontSize) {
  const htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
}

export default {
  getFontSize,
  fitScreenWidth,
  fitScreenHeight,
  setFontSizeToRoot
}