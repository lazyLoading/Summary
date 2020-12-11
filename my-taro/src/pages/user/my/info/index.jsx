import React, { Component } from "react";
import { View, Text, Picker } from "@tarojs/components";
import "./index.scss";
import {
  AtList,
  AtListItem,
  AtAvatar,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtButton,
  AtInput,
  AtForm,
} from "taro-ui";

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      dateSel: "2018-04-22",
      value: "爱党爱老婆",
      selector: ["男", "女"],
      selectorChecked: "男",
      num:0,
    };
  }
  onDateChange = (e) => {
    this.setState({
      dateSel: e.detail.value,
      isShow: false,
    });
  };
  handleChange(value) {
    this.setState({
      value,
    });
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  }
  onChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
    });
  };
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="page-my-list">
        <AtList className="portrait" hasBorder={false}>
          <Text>头像</Text>
          <AtAvatar
            image="https://jdc.jd.com/img/200"
            size="small"
            circle
          ></AtAvatar>
        </AtList>
        <AtList className="name">
          <AtInput
            name="value"
            title="昵称"
            type="text"
            placeholder="请输入"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </AtList>
        <AtList hasBorder={false}>
          <AtListItem title="帐号" extraText="18913933287" hasBorder={false} />
          <Picker mode="date" onChange={this.onDateChange}>
            <AtListItem
              title="出生日期"
              extraText={this.state.dateSel}
              arrow="right"
              hasBorder={false}
            />
          </Picker>
          <Picker
            mode="selector"
            range={this.state.selector}
            onChange={this.onChange}
          >
            <AtList hasBorder={false}>
              <AtListItem
                title="性别"
                extraText={this.state.selectorChecked}
                arrow="right"
                hasBorder={false}
              />
            </AtList>
          </Picker>
          <AtListItem title="我的等级" extraText="普卡"  arrow="right" hasBorder={false} />
        </AtList>
        <AtList className="name" hasBorder={false}>
          <AtInput
            name="value"
            title="家庭人员"
            type='number'
            placeholder="请输入"
            value={this.state.num}
            onChange={this.handleChange.bind(this)}
          />
        </AtList>
      </View>
    );
  }
}
