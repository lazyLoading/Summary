const getters = {
  getPurchaseList (state) {
    return state.purchaseList || {}
  },
  getArrivalList (state) {
    return state.arrivalList || {}
  },
  getEditList (state) {
    return state.editList || {}
  },
  getPageType (state) {
    return state.handleType || 'create'
  },
  getMaterialList (state) {
    let arrivalList = state.arrivalList.materialList
    let purchaseList = state.purchaseList.materialList
    if (arrivalList && purchaseList) {
      let tableData = arrivalList.concat(purchaseList)
      const res = new Map();
      return tableData.filter((tableData) => !res.has(tableData.id) && res.set(tableData.id, 1))
    } else if (arrivalList) {
      return arrivalList
    } else if (purchaseList) {
      return purchaseList
    }
  }
}
export default getters

