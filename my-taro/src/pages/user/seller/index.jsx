import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtIcon } from 'taro-ui'
export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="index">
      <AtIcon value='clock' size='30' color='#F00'></AtIcon>
        <Text> Hello Lili! </Text>
      </View>
    );
  }
}
