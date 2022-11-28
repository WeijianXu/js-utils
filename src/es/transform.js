/**
 * 对数据进行清洗，返回结果与源数据结构上不同
 * @module TransUtils
 */
/**
 * 将对象的属性转化成对应的列表形式
 * @param {Object} map 对象结构
 * @param {Object} options 函数返回额外需要增加的属性，包括 keyAttr/valAttr/formatter
 */
export function mapToArray(map = {}, options = {}) {
  // 转化后的键名, 转化后的键值名
  const { keyAttr = 'name', valAttr = 'value', formatter } = options;
  return Object.keys(map).map((k, i) => {
    const extra = typeof formatter === 'function' ? formatter({ k, i, val: map[k] }) : {};
    return {
      [keyAttr]: k,
      [valAttr]: map[k],
      ...extra,
    };
  });
}

/**
 * 将给定的Map对象的属性值转变成特定的属性值
 * 若 defaultVal 要为对象，且需要保证每个键值对象不同，请使用 formatter 返回新的对象
 * 避免浅拷贝带来对象的联动变化
 * @param {Object} map 对象结构
 * @param {Object} options 配置项，包括 defaultVal/formatter等
 */
export function transMapVals(map = {}, options) {
  // 转化后的键名, 转化后的键值名
  const { defaultVal = {}, formatter } = options;
  const newMap = {};
  Object.keys(map).forEach((k, i) => {
    newMap[k] = typeof formatter === 'function' ? formatter(k, i, map[k]) : defaultVal;
  });
  return newMap;
}

export default {
  mapToArray,
  transMapVals,
}