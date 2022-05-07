/**
 * 本文件方法，使用在表单检验中
 * 详细规则参见：https://github.com/yiminghe/async-validator
 */
 import { isUrl, isCnPhone } from './reg-exp';

 export function urlValid(rule, value, callback) {
   if (value && !isUrl(value)) {
     callback(new Error('')); // message 以外部定义为准
   } else {
     callback();
   }
 }

 export function phoneValid(rule, value, callback) {
   if (value && !isCnPhone(value)) {
     callback(new Error('')); // message 以外部定义为准
   } else {
     callback();
   }
 }
 
/**
 * 返回限制最大值、最小值的构造函数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns 构造函数
 */
const numValid = (min, max) => (rule, value, callback) => {
  const val = Number(value);
  const minDesc =
    min !== null && min !== undefined && val < min ? `大于等于 ${min} ` : '';
  const maxDesc =
    max !== null && max !== undefined && val > max ? `小于等于 ${max} ` : '';

  if (minDesc || maxDesc) {
    callback(
      new Error(
        `请输入${minDesc}${minDesc && maxDesc ? '，' : ''}${maxDesc}的数字`,
      ),
    );
  } else {
    callback();
  }
};


export default {
  urlValid,
  phoneValid,
  numValid
};
