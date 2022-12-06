
/**
 * 对指定dom添加水印（绝对定位的div）
 * @param {HTMLElement} dom HTML元素对象
 * @param {String} str 水印文字
 * @param {Object} options 配置信息，可以改变字体和颜色等
 */
export default function watermark(dom, str, options) {
  const { font = '15px Vedana', fillStyle = 'rgba(0, 0, 0, 0.10)'} = options || {};
  const can = document.createElement('canvas');
  can.width = 220;
  can.height = 120;

  const cans = can.getContext('2d');
  cans.rotate(-20 * Math.PI / 180);
  cans.font = font;
  cans.fillStyle = fillStyle;
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str, can.width / 30, can.height);

  const div = document.createElement('div');
  // div.id = 'watermark_id';
  div.style.pointerEvents = 'none';
  div.style.top = '0px';
  div.style.left = '0px';
  div.style.position = 'absolute';
  div.style.zIndex = '9999999';
  div.style.width = `${dom.offsetWidth}px`;
  div.style.height = `${dom.offsetHeight}px`;
  div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`;
  dom.appendChild(div);
}
