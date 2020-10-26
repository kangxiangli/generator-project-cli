// 基础路径
const BASE_URL = '/api/setting/etl/dict'

const API = {
  // 字典详情
  DETAIL_DICTIONARY: BASE_URL + '/detail',
  // 模版下载
  DOWNLOAD_DICTIONARY: BASE_URL + '/download',
  // 字典上传
  UPLOAD_DICTIONARY: BASE_URL + '/upload'
}
export default {
  methods: {
    // 字典详情 @FIXME:表格请求用统一的方法，后续要统一
    async getDicDetail () {
      this.tableDataDetail = await this.$request({
        method: 'get',
        tag: 'dictionary-detail-table',
        url: API.DETAIL_DICTIONARY + '?dictName=' + this.downloadname + '&pageNum=' + this.tableDataDetail.pageNum + '&pageSize=' + this.tableDataDetail.pageSize,
        data: {}
      })
    },
    // 模版下载
    async download () {
      this.$request({
        method: 'get',
        url: API.DOWNLOAD_DICTIONARY + '?dictName=' + this.downloadname,
        data: {}
      })
    }
  }
}
