/**
 * 文件的一些操作方法
 */

/**
 * 依据文件地址下载文件
 * @param {String} href 文件地址（可以是文件流地址、真实文件地址或Blob本地地址），可带参数
 * @param {String} filename 文件名
 */
export function downLoad(href, filename) {
  const link = document.createElement('a');
  link.href = href;
  link.style.display = 'none'; // 避免影响其他元素

  if (filename) {
    link.download = `${filename}`; // 下载后文件名
  }

  document.body.appendChild(link);
  link.click();
  // 点击完毕后，删除该元素
  link.remove();
}

/**
 * 将文件流转化成Blob对象，进行下载
 * @param {ResponseData} fileStreamData  完整文件流，（如 axios response.data）
 * @param {Object} fileConfig 设置文件，包括 `{ filename, contentType }`
 */
export function downLoadByBlob(fileStreamData, fileConfig) {
  let { filename = '', contentType = '' } = fileConfig || {};
  const blob = new Blob([fileStreamData], { type: contentType });;
  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容ie
    window.navigator.msSaveBlob(blob, filename);
  } else {

    const href = window.URL.createObjectURL(blob); // 创建下载的链接
    downLoad(href, filename);
    // 下载完成后，删除 blob 本地路径
    window.URL.revokeObjectURL(href);
  }
}

/**
   * 导出后端文件流文件。
   * 要求后端在 headers 中设置好文件名 filename、文件格式 content-type 等
   * filename 使用 URLEncode 方式编码
   * 【注】：
   * 当后端使用 'post' 的请求时，该方法可以很好的解决下载问题；
   * 'get' 请求时，用 `downLoad()` 更方便
   * 
   * @param {Response} fileStreameRes 完整响应体，包含 headers （如 axios response）
   * @param {Object} fileConfig 设置文件，包括 `{ filename, contentType }`
   */
export function downLoadByResponse(fileStreameRes, fileConfig) {
  let { filename = '', contentType = '' } = fileConfig || {};

  if (!filename && fileStreameRes.headers) {
    // 文件名在响应体头部 'content-disposition' 字段中
    const disposition = fileStreameRes.headers['content-disposition'].split(';');
    filename = disposition.find((str) => str.indexOf('filename') !== -1);
    filename = filename.split('=')[1].replace('utf-8\'\'', ''); // 去掉 utf-8 标识
    filename = decodeURIComponent(filename);
  }

  if (!contentType && fileStreameRes.headers) {
    contentType = fileStreameRes.headers['content-type'];
  }

  downLoadByBlob(fileStreameRes.data, { filename, contentType });
}

/**
 * 快捷方式，下载表格。
 * 默认 `{ contentType: 'application/vnd.ms-excel;charset=UTF-8', fileFormat: '.xlsx' }`
 * @param {ResponseData} fileStreamData  完整文件流，（如 axios response.data）
   * @param {Object} fileConfig 设置文件，包括 `{ filename, contentType, fileFormat }`
 */
export function excel(fileStream, fileConfig) {
  let { filename = '', contentType = 'application/vnd.ms-excel;charset=UTF-8', fileFormat = '.xlsx', ...rest } = fileConfig || {};
  const iFileName = `${fileName}${fileFormat}`;
  downLoadByBlob(blob, { filename: iFileName, contentType, ...rest });
}

/**
 * 快捷方式，下载PDF。
 * 默认 `{ contentType: 'application/pdf;charset=UTF-8', fileFormat: '.pdf' }`
 * @param {ResponseData} fileStreamData  完整文件流，（如 axios response.data）
   * @param {Object} fileConfig 设置文件，包括 `{ filename, contentType, fileFormat }`
 */
export function pdf(fileStream, fileConfig) {
  let { filename = '', contentType = 'application/pdf;charset=UTF-8', fileFormat = '.pdf' } = fileConfig || {};
  const iFileName = `${fileName}${fileFormat}`;
  downLoadByBlob(blob, { filename: iFileName, contentType, ...rest, ...rest });
}

export default {
  downLoad,
  downLoadByBlob,
  downLoadByResponse,
  excel,
  pdf,
}