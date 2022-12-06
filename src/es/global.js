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

/**
 * 使用全屏模式
 * @param {HTMLElement} element 触发全屏的元素
 */
export function fullScreenEnter(element) {
  if (window.ActiveXObject) {
    // IE 10及以下ActiveXObject
    const WsShell = new window.ActiveXObject('WScript.Shell');
    WsShell.SendKeys('{F11}');
  } else if (element.requestFullScreen) {
    // HTML W3C 提议
    element.requestFullScreen();
  } else if (element.msRequestFullscreen) {
    // IE11
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullScreen) {
    // Webkit (works in Safari5.1 and Chrome 15)
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox (works in nightly)
    element.mozRequestFullScreen();
  }
}

/**
 * 退出全屏模式
 * @param {HTMLElement} element 退出全屏的元素
 */
export function fullScreenExit(element) {
  if (window.ActiveXObject) {
    // IE ActiveXObject
    const WsShell = new window.ActiveXObject('WScript.Shell');
    WsShell.SendKeys('{F11}');
  } else if (element.exitFullscreen) {
    // HTML5 W3C 提议
    document.exitFullscreen();
  } else if (element.msExitFullscreen) {
    // IE 11
    document.msExitFullscreen();
  } else if (element.webkitCancelFullScreen) {
    // Webkit (works in Safari5.1 and Chrome 15)
    document.webkitCancelFullScreen();
  } else if (element.mozCancelFullScreen) {
    // Firefox (works in nightly)
    document.mozCancelFullScreen();
  }
}

export default {
  getFontSize,
  fitScreenWidth,
  fitScreenHeight,
  setFontSizeToRoot,

  fullScreenEnter,
  fullScreenExit
}