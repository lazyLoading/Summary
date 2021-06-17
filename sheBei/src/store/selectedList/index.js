import getters from './getters'
import actions from './actions'
import mutations from './mutations'
const state = {
  purchaseList: {}, //已选择的采购单列表，用于回显
  arrivalList: {}, //已选择的到货单列表，用于回显
  editList: {}, //回显
  handleType: ''
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
