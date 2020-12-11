import React, { Component } from "react";
import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
import { AtTabs, AtTabsPane, AtAvatar, AtTag } from "taro-ui";

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      tabCur: 0,
    };
  }
  handleClick(value) {
    this.setState({ tabCur: value });
    console.log(value);
  }
  handleState(v) {
    console.log(v);
    switch (v) {
      case 0:
        return "进行中";
      case 1:
        return "已完成";
    }
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const tabList = [
      { id: 1, title: "全部" },
      { id: 2, title: "进行中", state: 0 },
      { id: 3, title: "已完成", state: 1 },
    ];
    const orderList = [
      {
        id: 1,
        title: "店铺名称",
        name: "商品名称",
        state: 0,
        image: ["https://jdc.jd.com/img/200"],
        price: "999.99",
        piece: "1",
        time: "1607571050",
      },
      {
        id: 2,
        title: "店铺名称",
        name: "商品名称",
        state: 1,
        image: [
          "https://jdc.jd.com/img/200",
          "https://jdc.jd.com/img/200",
          "https://jdc.jd.com/img/200",
          "https://jdc.jd.com/img/200",
          "https://jdc.jd.com/img/200",
        ],
        price: "138.99",
        piece: "3",
        time: "1607571050",
      },
    ];

    return (
      <View className="page-order-list">
        {/* Tab切换 */}
        <AtTabs
          animated={false}
          current={this.state.tabCur}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          {tabList.map((item, index) => {
            return (
              <AtTabsPane
                current={this.state.tabCur}
                index={index}
                key={index}
              ></AtTabsPane>
            );
          })}
        </AtTabs>

        {/* 列表 */}
        <View className="list-box">
          {orderList.map((item, index) => {
            return (
              <View className="item" key={index}>
                <View className="head">
                  <View className="tit">{item.title}</View>
                  <View className="state">{this.handleState(item.state)}</View>
                  <View className="at-icon at-icon-trash"></View>
                </View>

                <View className="product">
                  {item.image.length == 1 ? (
                    <View className="single-pic">
                      <AtAvatar className="fl" image={item.image[0]}></AtAvatar>
                      {item.name}
                    </View>
                  ) : (
                    <View className="swiper-pic">
                      <Swiper displayMultipleItems="4">
                        {item.image.map((cur, i) => {
                          return (
                            <SwiperItem key={i}>
                              <AtAvatar image={cur}></AtAvatar>
                            </SwiperItem>
                          );
                        })}
                      </Swiper>
                    </View>
                  )}

                  <View className="abstract">
                    <View className="price">$ {item.price}</View>
                    <View className="num">共{item.piece}件</View>
                  </View>
                </View>
                <View className="operation">
                  <Text className="time">13/08/2020</Text>
                  <View className="bnt">
                    <AtTag size="small" active circle>
                      取消
                    </AtTag>
                    <AtTag size="small" active circle>
                      上传付款
                    </AtTag>
                    <AtTag size="small" active circle>
                      操作...
                    </AtTag>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
