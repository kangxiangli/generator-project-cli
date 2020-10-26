import ComponentConfig from './manage-config.vue'
export default {
  name: 'manage-strategy-manage-config-edit',
  extends: ComponentConfig,
  created () {
    this.init()
  },
  methods: {
    async init () {
      await this.buildData().then(() => {
        if (this.$route.name === 'manage-strategy-manage-config-edit' || this.$route.name === 'manage-baseline-manage-config-edit') {
          this.componentMode = 1
        } else {
          this.componentMode = 3
        }
        const id = this.$route.params.id
        if (id !== null && id !== undefined && id !== '') {
          this.getPolicyById(parseInt(id))
        }
      })
    }
  }
}
