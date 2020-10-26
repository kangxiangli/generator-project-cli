/**
 * Created by sundong on 2019/5/24.
 */
import { request } from '@/custom/plugins/request.js'
import Message from 'element-ui/packages/message/index.js'
export default {
  state () {
    return {
      uuidList: []    // uuid列表
    }
  },
  actions: {
    // 后台根据uuid去清除相应的结果
    async clearUUid ({ commit, state, getters, rootState }, view) {
      let { type, data = { query: { _r: '' } }, tagName = 'analysis-inquire-event-board' } = view
      try {
        let uuids = []
        let arr = []  // 缓存符合name为analysis-inquire-event-board的uuids
        switch (type) {
          case 'closeSelectTag':  // 关闭当前Tag
            if (data.name === 'analysis-inquire-event-board') {  // 判断当前关闭的tag有没有事件调查看板
              arr.push(data)
            }
            break
          case 'closeTags':  // 关闭其他或者全部关闭
            let tagList = rootState.tagsView.visitedViews  // 所有打开的tag
            for (let item of tagList) {
              if (item._r !== data.query._r && item.name === tagName) { // 批量关闭tag时，把name为事件调查看板的tag集中起来
                arr.push(item)
              }
            }
            break
        }
        for (let i of state.uuidList) {
          for (let j of arr) {
            if (i._r === j.query._r) {  // 找到需要关闭的uuid集合
              uuids.push(i.uuid)
            }
          }
        }
        if (!arr.length) return
        await request({
          url: '/api/argus-service-logic-analysis/event/clear/uuids',
          method: 'post',
          data: {
            uuids: uuids
          }
        })
      } catch (e) {
        Message({
          type: 'error',
          message: '清除失败！'
        })
      }
    }
  },
  mutations: {
    ADD_UUIDS: (state, view) => {
      state.uuidList.push(view)
    },
    DEL_SELECTED_UUID: (state, view) => {
      for (const i of state.uuidList) {
        if (i._r === view._r && i.name === view.name) {
          state.uuidList.splice(i, 1)
          break
        }
      }
    },
    DEL_OTHER_UUIDS: (state, view) => {
      for (let i = 0; i < state.uuidList.length; i++) {
        const v = state.uuidList[i]
        if (v._r !== view.query._r || v.name !== view.name) {
          state.uuidList.splice(i, 1)
          i--
        }
      }
    },
    DEL_ALL_UUIDS: (state, view) => {
      state.uuidList = []
    }
  }
}
