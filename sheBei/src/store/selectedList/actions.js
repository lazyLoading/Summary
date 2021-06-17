import * as TYPES from './mutation-types'
const actions = {
  handlePList ({ commit }, list) {
    commit(TYPES.UPDATE_PLIST, list);
  },
  handleAList ({ commit }, list) {
    commit(TYPES.UPDATE_ALIST, list);
  },
  handleEditList ({ commit }, list) {
    commit(TYPES.EDIT_LIST, list);
  },
  handlePageType ({ commit }, event) {
    commit(TYPES.UPDATE_HANDLETYPR, event);
  }
};
export default actions;
