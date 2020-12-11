import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtButton, AtSegmentedControl,AtTag } from "taro-ui";

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
    };
  }
  handleClick(value) {
    this.setState({ current: value });
    console.log(value)
  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="page-order">
       <AtSegmentedControl
          values={['配送上门','用户自取']}
          onClick={this.handleClick.bind(this)}
          current={this.state.current}
          selectedColor="#6780ea"

       >

       </AtSegmentedControl>
       111
       <View className="fixed-btn">
          <Text className="price">$152.98</Text>
          <AtTag type='primary' active circle>提交订单</AtTag>       </View>
      </View>
    );
  }
}
