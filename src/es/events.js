/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-08-28 11:32:30
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-08-28 11:42:20
 * @FilePath: \output-verbatimd:\app\me\js-utils\src\es\events.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import debounce from 'lodash/debounce';
/**
 * 全局管理浏览器全局事件，避免一个页面多次注册，后者覆盖前者从而导致前者失效。
 * 核心使用订阅者模式进行设计。
 */
export default class EventSubscriber {
  eventType = '';
  constructor(eventType) {
    this.eventType = eventType;
    this.events = {};
    this.init();
  }

  init(delay = 200) {
    this.delay = delay;
    this._callback = () => {
      Object.keys(this.events).forEach((k) => {
        try {
          if (typeof this.events[k] === 'function') {
            this.events[k]();
          }
        } catch (e) {
          // 出现这种错误时，很多是因为没有在页面或组件卸载时，使用 remove 取消订阅
          console.warn(`window.on${eventType} error. `, k, this.events[k]);
          // 主动取消订阅
          this.remove(k);
        }
      });
    };
    // window.onresize = () => {
    window.addEventListener(this.eventType, debounce(this._callback, this.delay));
  }

  changeDelay(delay = 200) {
    this.delay = delay;
  }

  subscribe(name, callback) {
    this.events[name] = callback;
  }

  remove(name) {
    delete this.events[name];
  }

  /**
   * 销毁 resize 事件
   */
  destroy() {
    window.removeEventListener(this.eventType, this._callback);
  }
}

/**
 * 全局 resize 事件，保证多次注册，都能触发
 */
export const resizeEvt = new EventSubscriber('resize');

/**
 * 全局 scroll 事件，保证多次注册，都能触发
 */
export const scrollEvt = new EventSubscriber('scroll');
