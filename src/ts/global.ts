/**
 * 收集或设置一些对 window 上的属性进行的操作
 */
export default {
  /**
   * ### 判断浏览器是否是IE浏览器；
   * 1. 是返回版本号；
   * 2. 若是 Edge 浏览器，返回 0；
   * 2. 否则是返回 -1；
   */
  ieVersion(): number {
    const { userAgent } = window.navigator; // 取得浏览器的userAgent字符串
    const isIE: boolean =
      userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
    const isEdge: boolean = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
    const isIE11: boolean =
      userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);'); // 后面使用RegExp.$1，IE下，不能使用字面量定义，否则出错
      reIE.test(userAgent);
      const fIEVersion: number = parseFloat(RegExp.$1);
      return fIEVersion > 6 ? fIEVersion : 6; // IE版本<=7
    }
    if (isEdge) {
      return 0; // edge
    }
    if (isIE11) {
      return 11; // IE11
    }
    return -1; // 不是ie浏览器
  },
  /**
   * ### 获取现代浏览器版本号
   * 1. 可选值 Edge、Firefox、OPR、Chrome、Safari
   * @param {String} browswr 现代浏览器名称
   */
  getModernBrowserVer(browswr: string): number {
    const ver = navigator.userAgent.split(`${browswr}/`)[1];
    const firstV = ver ? ver.split('.')[0] : '';
    return firstV && !isNaN(Number(firstV)) ? Number(firstV) : -1;
  },
  /**
   * 获取当前浏览器类型及其版本号
   * 1. 返回 IE、Edge、Firefox、Opera、Chrome、Safari浏览器名称和版本号；
   * 2. 非上述浏览器，返回 ''；
   */
  browserVersion(): string {
    const { userAgent } = navigator; // 取得浏览器的userAgent字符串
    const ieV: number = this.ieVersion();
    const isFirefox: boolean = userAgent.indexOf('Firefox') > -1; // Firefox浏览器
    const isOpera: boolean =
      userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1; // Opera浏览器
    const isChrome: boolean =
      userAgent.indexOf('Chrome') > -1 &&
      userAgent.indexOf('Safari') > -1 &&
      userAgent.indexOf('Edge') === -1 &&
      userAgent.indexOf('OPR') === -1; // Chrome浏览器
    const isSafari: boolean =
      userAgent.indexOf('Safari') > -1 &&
      userAgent.indexOf('Chrome') === -1 &&
      userAgent.indexOf('Edge') === -1 &&
      userAgent.indexOf('OPR') === -1; // Safari浏览器
    if (ieV > 0) {
      return `IE${ieV}`;
    }
    if (ieV === 0) {
      return `Edge${this.getModernBrowserVer('Edge')}`;
    }
    if (isFirefox) {
      return `Firefox${this.getModernBrowserVer('Firefox')}`;
    }
    if (isOpera) {
      return `Opera${this.getModernBrowserVer('OPR')}`;
    }
    if (isChrome) {
      return `Chrome${this.getModernBrowserVer('Chrome')}`;
    }
    if (isSafari) {
      return `Safari${this.getModernBrowserVer('Safari')}`;
    }
    return ''; // 未知浏览器
  },

  /**
   * 返回浏览器版本提醒描述
   * 1. IE浏览器，返回请“您使用Firefox、Chrome等现代浏览器”；
   * 2. Edge，版本过低，提示升级；
   * 3. 其他浏览器，返回空值
   */
  getBrowerAlert(): string {
    const ieV = this.ieVersion();
    let desc;
    if (ieV > 0) {
      console.log('Current brower agent: IE', ieV);
      desc = '请您使用Firefox、Chrome等最新版本浏览器';
    }
    if (ieV === 0 && this.getModernBrowserVer('Edge') < 16) {
      console.log(
        'Current brower agent: Edge',
        this.getModernBrowserVer('Edge')
      );
      desc = '请您升级当前浏览器至最新版本';
    }
    if (desc) {
      return `为了更好的体验效果，${desc}`;
    }
    // 现代浏览器
    console.log('Current brower agent: ', this.browserVersion());
    return '';
  },
};
