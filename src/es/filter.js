/**
 * 对数据进行一些筛选、处理、清洗等
 * @module FilterUtils
 */

/**
 * 处理简单数据类型
 * @param {String|Number|null|undefined|Boolean|Symbol} param 需要处理的参数
 * @param {Object} opts 配置对象
 * @returns 处理后的参数
 */
const handleSimpleDataType = (param, opts) => {
  // 处理数字
  if (typeof param === 'number') {
    if (opts.noNegativeOne && param === -1) {
      return; // undefined
    }
    if (opts.noZero && param === 0) {
      return; // undefined
    }
  }
  // 处理其他基础类型
  if (typeof param !== 'object' || param === null) {
    // param 是 null/undefined/''，返回 undefined
    if (param === '' || param === null || param === undefined) {
      return;
    }
    // 否则返回它自己，如 false, Symbol 类型
    // eslint-disable-next-line consistent-return
    return param;
  }
  // eslint-disable-next-line consistent-return
  return param;
};

/**
 * 去掉参数对象上空的键值对，提供多种方式处理控制;
 *
 * 1. 若参数为普通类型，直接返回该数据类型（设置了 noNegativeOne、noZero 的返回 undefined）
 * 2. 默认去掉参数对象上的 空字符串 ''，null，undefined 的字段；
 * 3. 数组需要特别小心，若数组为数字列表时，确保不出现下面情况：
 *    - keepIntArray 被设置为 false, 且设置了 noNegativeOne/noZero 为 true 时会返回 undefined；
 *    - 即 [-1, 0] => [undefined, undefined]。
 *
 * option 对象:
 * ```
 * {
 *    deep: false, // 是否深度遍历
 *    noNegativeOne: false, // 是否去掉 -1 的数据
 *    noZero: false, // 是否取消 0 的数据
 *    keepIntArray: true, // 保留数组中的数字数据，不处理 -1/0
 * }
 * ```
 * @param {Object} params 参数对象
 * @param {Boolean} option 配置如何删除参数对象的空值
 * @return {Object} 删除约定规则的字段
 */
export function deleteEmptyKey(params, option = {}) {
  const opts = {
    deep: false,
    noNegativeOne: false,
    noZero: false,
    keepIntArray: true,
    ...option,
  };

  // typeOf null -> 'object'
  if (typeof params !== 'object' || params === null) {
    return handleSimpleDataType(params, opts);
  }

  if (Array.isArray(params)) {
    return params.map((param) => {
      if (typeof param === 'number' && opts.keepIntArray) {
        return param;
      }
      return deleteEmptyKey(param, opts);
    });
  }
  const newParams = {};
  const keys = Object.keys(params);
  // 参数不存在键值，避免 new Number() 这种对象误判断
  if (!keys.length) {
    return params.valueOf();
  }
  keys.forEach((key) => {
    const val = params[key];
    let newVal = val;
    if (typeof val !== 'object' || val === null) {
      newVal = handleSimpleDataType(val, opts);
    } else {
      newVal = opts.deep ? deleteEmptyKey(val, opts) : val;
    }
    if (newVal !== '' && newVal !== null && newVal !== undefined) {
      newParams[key] = newVal;
    }
  });
  return newParams;
}

/**
 * 去掉参数对象上空的键值对，包括空字符串''，null，undefined，deleteEmptyKey 的快捷方法
 * @param {Object} params 参数对象
 * @param {Boolean} deep 是否进行深度遍历，去除子属性上的空键值
 * @return {Object} 删除为空字符串、null、undefined 等值的字段
 */
export function removeEmptyKey(params, deep = false) {
  return deleteEmptyKey(params, { deep });
}

/**
 * 定制参数对象上空的空值的键值对，提供多种方式处理控制;
 *
 * option 对象:
 * ```
 * {
 *    deep: false, // 是否深度遍历
 *    format: '-', // 默认空的空值的键值对定制后的值
 * }
 * ```
 * @param {Object} params 参数对象
 * @param {Boolean} option 配置如何删除参数对象的空值
 * @return {Object} 删除约定规则的字段
 */
export function changeEmptyKey(params, options) {
  const opts = {
    deep: false,
    format: '-',
    ...(options || {}),
  };

  // typeOf null -> 'object'
  if (typeof params !== 'object' || params === null) {
    if (params === null || params === undefined || params === '') {
      return opts.format;
    }
    return params;
  }
  if (Array.isArray(params)) {
    return params.map((param) => changeEmptyKey(param, opts));
  }
  const newParams = {};
  const keys = Object.keys(params);
  // 参数不存在键值，避免 new Number() 这种对象误判断
  if (!keys.length) {
    return params.valueOf();
  }
  keys.forEach((key) => {
    const val = params[key];
    let newVal = val;
    if (typeof val !== 'object' || val === null) {
      if (val === null || val === undefined || val === '') {
        newVal = opts.format;
      }
    } else {
      newVal = opts.deep ? changeEmptyKey(val, opts) : val;
    }
    newParams[key] = newVal;
  });
  return newParams;
}


export default {
  deleteEmptyKey,
  removeEmptyKey,
  changeEmptyKey,
}