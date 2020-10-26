import { getErrorMsgByEnd } from '@/custom/utils/base.js'
// 基础路径
const BASE_URL = '/api/setting/etl/dict'

const API = {
  // 字典定义
  DEFINE_DICTIONARY: BASE_URL + '/define'
}
export default {
  methods: {
    async saveData () {
      try {
        await this.$request({
          method: 'post',
          url: API.DEFINE_DICTIONARY,
          data: this.businessForm
        })
        this.showMessage('新增成功！')
        this.$emit('update:visible', false)  // 关闭弹窗
        this.$emit('addSuccess', true)       // 通知父组件重新获取数据
      } catch (error) {
        this.formError = getErrorMsgByEnd(error)
      }
    }
  }
}
