import ComponentConfig from './manage-config.vue'
export default {
  name: 'manage-strategy-manage-config-add',
  extends: ComponentConfig,
  async created () {
    await this.buildData()
  },
  mounted () {
    if (this.componentMode === 2) {
      this.getDefaultOutput().then(_ => {
        let jsonData = JSON.parse(JSON.stringify(this.defaultOutput))
        this.outConfig = Object.assign({}, this.outConfig, { outPutList: jsonData })
      })
    }
  }
}
