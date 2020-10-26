import { request } from '@/custom/plugins/request.js'

/**
 * 文件上传 - 通用方法
 * @param options Object
 * url: 地址，必须
 * uploadFiles: Array, 必须
 * method: 默认：post
 * data: 其他数据参数
 * tag: loading标识
 */
const upload = function (options) {
  let { url, uploadFiles, method = 'post', data, tag } = options
  if (!uploadFiles || !uploadFiles.length) return false
  const formData = new FormData()
  // 文件序列号
  uploadFiles.forEach(({ raw }) => {
    formData.append('file', raw)
  })
  // 额外数据序列号
  if (typeof data === 'object') {
    for (const item in data) {
      formData.append(item, data[item])
    }
  }
  return this.$request({
    url,
    method: method,
    data: formData,
    tag
  })
}

/** 文件下载
 * @param  {} fileName 下载文件的名字
 * @param  {} permanent 是否永久下载
 */
const download = function (fileName, permanent) {
  let href = `/api/system/temp/filedownload/${encodeURIComponent(fileName)}`
  if (permanent) {
    href = `/api/system/permanent/filedownload?fileName=${encodeURIComponent(fileName)}`
  }

  // 请求并下载文件
  request({
    url: href
  }, {
    responseType: 'blob'
  }).then(blob => {
    // 将二进制流转换，放入 a 标签中下载
    const url = window.URL.createObjectURL(blob.data)
    let tagA = document.createElement('a')
    tagA.setAttribute('download', fileName)
    tagA.setAttribute('href', url)
    tagA.click()
    // 释放
    tagA = null
    window.URL.revokeObjectURL(url)
  })
}

export {
  upload,
  download
}
