//订单详情
import { purchaseDetail } from "@/api/order.js";

const orderDtails = {
    data() {
        return {
            detailData: [{
                    title: "基础信息",
                    baseLabel: [{
                            label: "采购订单号",
                            prop: "purchaseCode",
                        },
                        {
                            label: "供应商名称",
                            prop: "supplierCompanyName",
                        },
                        //       {
                        //        label: "客户名称",
                        //         prop: "purchaserCompanyName",
                        //       },
                        {
                            label: "联系人",
                            prop: "linkmanName",
                        },
                        {
                            label: "联系方式",
                            prop: "linkmanPhone",
                        },
                        {
                            label: "下达日期",
                            prop: "issuedAt",
                        },
                        {
                            label: "收货地址",
                            prop: "deliveryAddress",
                        },
                        {
                            label: "接收日期",
                            prop: "receivedAt",
                        },
                        {
                            label: "交货日期",
                            prop: "deliveredAt",
                        },
                        {
                            label: "制单人",
                            prop: "creatorName",
                        },
                        {
                            label: "制单日期",
                            prop: "createdAt",
                        },
                    ],
                    statusList: [
                        { status: 0, name: "待下发", color: "color-purple1" },
                        { status: 1, name: "订单待确认", color: "color-orange1" },
                        { status: 2, name: "变更待确认", color: "color-orange1" },
                        { status: 3, name: "订单已拒绝", color: "color-purple2" },
                        { status: 4, name: "变更已拒绝", color: "color-purple2" },
                        { status: 5, name: "已确认", color: "color-blue2" },
                        { status: 6, name: "已完成", color: "color-blue2" },
                        { status: 7, name: "已中止", color: "color-red5" },
                    ],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编号",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "orderingNumber",
                            label: "订货数量",
                        },
                        {
                            prop: "receiveNumber",
                            label: "实收数量",
                        },
                        {
                            prop: "diffNum",
                            label: "差异数量",
                        },
                        {
                            prop: "refuseNumber",
                            label: "拒收数量",
                        },
                        {
                            prop: "rejectNumber",
                            label: "退货数量",
                        },
                        {
                            prop: "manufactureNum",
                            label: "生产数量",
                        },
                        {
                            prop: "completeNum",
                            label: "完成数量",
                        },
                        {
                            prop: "storageNum",
                            label: "库存数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                        {
                            prop: "remark",
                            label: "备注",
                        },
                    ],
                    data: [],
                },
                {
                    title: "生产计划",
                    baseLabel: [],
                    statusList: [],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编号",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "manufactureDate",
                            label: "生产计划时间",
                        },
                        {
                            prop: "manufactureNum",
                            label: "生产计划数量",
                        },
                        {
                            prop: "completeNum",
                            label: "完成数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                    ],
                    data: [],
                },
                {
                    title: "库存",
                    baseLabel: [],
                    statusList: [],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编号",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "createdAt",
                            label: "入库时间",
                        },
                        {
                            prop: "storageNum",
                            label: "库存数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                    ],
                    data: [],
                },
                {
                    title: "变更记录",
                    baseLabel: [{
                            label: "采购订单号",
                            prop: "purchaseCode",
                        },
                        {
                            label: "供应商名称",
                            prop: "supplierCompanyName",
                        },
                        //       {
                        //        label: "客户名称",
                        //         prop: "purchaserCompanyName",
                        //       },
                        {
                            label: "联系人",
                            prop: "linkmanName",
                        },
                        {
                            label: "联系方式",
                            prop: "linkmanPhone",
                        },
                        {
                            label: "下达日期",
                            prop: "issuedAt",
                        },
                        {
                            label: "收货地址",
                            prop: "deliveryAddress",
                        },
                        {
                            label: "接收日期",
                            prop: "receivedAt",
                        },
                        {
                            label: "变更人",
                            prop: "creatorName",
                        },
                        {
                            label: "变更日期",
                            prop: "createdAt",
                        },
                    ],
                    statusList: [
                        { status: 0, name: "待下发", color: "color-purple1" },
                        { status: 1, name: "订单待确认", color: "color-orange1" },
                        { status: 2, name: "变更待确认", color: "color-orange1" },
                        { status: 3, name: "订单已拒绝", color: "color-purple2" },
                        { status: 4, name: "变更已拒绝", color: "color-purple2" },
                        { status: 5, name: "已确认", color: "color-blue2" },
                        { status: 6, name: "已完成", color: "color-blue2" },
                        { status: 7, name: "已中止", color: "color-red5" },
                    ],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编号",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "orderingNumber",
                            label: "订货数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                        {
                            prop: "remark",
                            label: "备注",
                        },
                    ],
                    data: [],
                },
                {
                    title: "客户到货通知单",
                    baseLabel: [{
                            label: "到货通知单编号",
                            prop: "requirementCode",
                        },
                        {
                            label: "到货时间",
                            prop: "deliveredAt",
                        },
                        {
                            label: "到货地址",
                            prop: "deliveryAddress",
                        },
                        {
                            label: "制单人",
                            prop: "creatorOperatorName",
                        },
                    ],
                    statusList: [
                        { status: 0, name: "待下发", color: "color-purple1" },
                        { status: 1, name: "待确认", color: "color-orange1" },
                        { status: 2, name: "已确认", color: "color-blue2" },
                        { status: 3, name: "已拒绝", color: "color-purple2" },
                    ],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编码",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "arrivalNumber",
                            label: "到货数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                        {
                            prop: "remark",
                            label: "备注",
                        },
                    ],
                    data: [],
                },
                {
                    title: "退货信息",
                    baseLabel: [{
                            label: "退货单编号",
                            prop: "rejectedCode",
                        },
                        {
                            label: "退货人",
                            prop: "creatorName",
                        },
                        {
                            label: "退货时间",
                            prop: "createdAt",
                        },
                    ],
                    statusList: [
                        { status: -1, name: "待下发", color: "color-purple1" },
                        { status: 0, name: "待确认", color: "color-orange1" },
                        { status: 1, name: "已确认", color: "color-blue2" },
                        { status: 2, name: "已拒绝", color: "color-purple2" },
                        { status: 3, name: "已完成", color: "color-blue2" },
                    ],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编码",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "rejectedNumbers",
                            label: "退货数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                        {
                            prop: "remark",
                            label: "备注",
                        },
                    ],
                    data: [],
                },
                {
                    title: "发货/客户收货",
                    baseLabel: [{
                            label: "发货单编号",
                            prop: "cargoCode",
                        },
                        {
                            label: "发货人",
                            prop: "creatorName",
                        },
                        {
                            label: "发货时间",
                            prop: "sendAt",
                        },
                        {
                            label: "发货地址",
                            prop: "deliveryAddress",
                        },
                    ],
                    statusList: [
                        { status: -1, name: "待发货", color: "color-red2" },
                        { status: 0, name: "待收货", color: "color-red5" },
                        { status: 1, name: "已收货", color: "color-blue2" },
                    ],
                    materielLabel: [{
                            prop: "index",
                            label: "序号",
                            width: "55px",
                        },
                        {
                            prop: "materialCode",
                            label: "物料编码",
                        },
                        {
                            prop: "materialName",
                            label: "物料名称",
                        },
                        {
                            prop: "specification",
                            label: "规格/型号",
                        },
                        {
                            prop: "sendNumber",
                            label: "发货数量",
                        },
                        {
                            prop: "receiveNumber",
                            label: "实收数量",
                        },
                        {
                            prop: "refusedNumber",
                            label: "拒收数量",
                        },
                        {
                            prop: "unit",
                            label: "单位",
                        },
                        {
                            prop: "remark",
                            label: "备注",
                        },
                    ],
                    data: [],
                },
            ],
        };
    },
    created() {
        this.enterpriseChange()
    },
    methods: {
        //企业身份改变
        enterpriseChange() {
            let types = localStorage.getItem("types");
            let supplierCompanyName = {
                label: "供应商名称",
                prop: "supplierCompanyName",
            };
            let purchaserCompanyName = {
                    label: "客户名称",
                    prop: "purchaserCompanyName",
                }
                //采购
            if (types == 'procurement') {
                this.detailData[0].baseLabel[1] = supplierCompanyName
                this.detailData[3].baseLabel[1] = supplierCompanyName
            }

            //供应
            if (types == 'supplier') {
                this.detailData[0].baseLabel[1] = purchaserCompanyName
                this.detailData[3].baseLabel[1] = purchaserCompanyName
            }
        },
        //获取详情
        getListDetail(id) {
            purchaseDetail({ id }).then(({ data: res }) => {
                if (res.code == 200) {
                    let {
                        cargoList,
                        changeLogList,
                        productionPlanVos,
                        purchaseBaseInfoVo,
                        rejectedList,
                        requirementList,
                        stockVos,
                    } = res.data;
                    //转成组件数据格式
                    this.detailData[0].data = [purchaseBaseInfoVo]; //基础信息
                    this.detailData[1].data =
                        productionPlanVos.length > 0 ? [{ materialList: productionPlanVos }] : []; //生产计划
                    this.detailData[2].data =
                        stockVos.length > 0 ? [{ materialList: stockVos }] : []; //库存
                    this.detailData[3].data = changeLogList; //变更记录
                    this.detailData[4].data = requirementList; //客户到货通知单
                    this.detailData[5].data = rejectedList; //退货信息
                    this.detailData[6].data = cargoList; //发货/客户收货
                } else {
                    this.$message.error(res.message);
                }
            });
        },
    },
};

export default orderDtails;