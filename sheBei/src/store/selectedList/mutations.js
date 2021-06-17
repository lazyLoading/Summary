import * as TYPES from './mutation-types'

const mutations = {
  [TYPES.UPDATE_PLIST] (state, list) {
    state.purchaseList = list;
  },
  [TYPES.UPDATE_ALIST] (state, list) {
    state.arrivalList = list;
  },
  [TYPES.EDIT_LIST] (state, list) {
    state.editList = list;
  },
  [TYPES.UPDATE_HANDLETYPR] (state, event) {
    state.handleType = event;
  }
}
export default mutations;
