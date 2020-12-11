export default {
    pages: [
        "pages/user/order/list/index",
        "pages/user/order/details/index",
        "pages/user/seller/index",
        "pages/user/my/info/index",
        "pages/user/my/address/index",
    ],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#fff",
        navigationBarTitleText: "WeChat",
        navigationBarTextStyle: "black",
    },
    tabBar: {
        color: "#666",
        selectedColor: "#e36beb",
        borderStyle: "black",
        backgroundColor: "#ffffff",
        list: [{
                pagePath: "pages/user/order/list/index",
                text: "订单",
                iconPath: "assets/img/order.png",
                selectedIconPath: "assets/img/order-act.png",
            },
            {
                pagePath: "pages/user/seller/index",
                text: "卖家",
                iconPath: "assets/img/seller.png",
                selectedIconPath: "assets/img/seller-act.png",
            },
            {
                pagePath: "pages/user/my/info/index",
                text: "我的",
                iconPath: "assets/img/my.png",
                selectedIconPath: "assets/img/my-act.png",
            },
        ],
    },
};