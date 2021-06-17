$(function () {
    echart_1();
    echart_2();
    echart_3();
    echart_4();

    function echart_1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_1'));
        option = {
            title: {
                text: '本月车辆状态统计',
                top: 35,
                left: 20,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",

            },
            legend: {
                right: 20,
                top: 35,
                data: ['送修', '正常'],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [{
                name: '设备状态',
                type: 'pie',
                radius: ['0', '60%'],
                center: ['50%', '60%'],
                color: ['#e72325', '#98e002', '#2ca3fd'],
                label: {
                    normal: {
                        formatter: '{b}\n{d}%'
                    },

                },
                data: [{
                        value: 6,
                        name: '故障'
                    },
                    {
                        value: 50,
                        name: '正常',
                        selected: true
                    }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echart_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_2'));
        var data = {
            id: 'multipleBarsLines',
            title: '2020年前半年检测统计',
            legendBar: ['正面占比', '中立占比', '负面占比'],
            symbol: '', //数值是否带百分号        --默认为空 ''
            legendLine: ['同期对比'],
            xAxis: ['一月', '二月', '三月', '四月', '五月', '六月'],
            yAxis: [
                [8, 10, 10, 11, 4, 13]
            ],
            lines: [
                [10, 10, 9, 11, 7, 4]
            ],
            barColor: ['#3FA7DC', '#7091C4', '#5170A2'], //柱子颜色 必填参数
            lineColor: ['#D9523F'], // 折线颜色

        };
        /////////////end/////////

        var myData = (function test() {
            var yAxis = data.yAxis || [];
            var lines = data.lines || [];
            var legendBar = data.legendBar || [];
            var legendLine = data.legendLine || [];
            var symbol = data.symbol || ' ';
            var seriesArr = [];
            var legendArr = [];
            yAxis && yAxis.forEach((item, index) => {
                legendArr.push({
                    name: legendBar && legendBar.length > 0 && legendBar[index]
                });
                seriesArr.push({
                    name: legendBar && legendBar.length > 0 && legendBar[index],
                    type: 'bar',
                    barGap: '0.5px',
                    data: item,
                    barWidth: data.barWidth || 12,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}' + symbol,
                            position: 'top',
                            textStyle: {
                                color: '#fff',
                                fontStyle: 'normal',
                                fontFamily: '微软雅黑',
                                textAlign: 'left',
                                fontSize: 11,
                            },
                        },
                    },
                    itemStyle: { //图形样式
                        normal: {
                            barBorderRadius: 4,
                            color: data.barColor[index]
                        },
                    }
                });
            });

            lines && lines.forEach((item, index) => {
                legendArr.push({
                    name: legendLine && legendLine.length > 0 && legendLine[index]
                })
                seriesArr.push({
                    name: legendLine && legendLine.length > 0 && legendLine[index],
                    type: 'line',
                    data: item,
                    itemStyle: {
                        normal: {
                            color: data.lineColor[index],
                            lineStyle: {
                                width: 3,
                                type: 'solid',
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: false, //折线上方label控制显示隐藏
                            position: 'top',
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 10
                });
            });

            return {
                seriesArr,
                legendArr
            };
        })();


        option = {
            title: {
                show: true,
                top: '10%',
                left: '3%',
                text: data.title,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                },
                subtext: data.subTitle,
                link: ''
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var time = '';
                    var str = '';
                    for (var i of params) {
                        time = i.name.replace(/\n/g, '') + '<br/>';
                        if (i.data == 'null' || i.data == null) {
                            str += i.seriesName + '：无数据' + '<br/>'
                        } else {
                            str += i.seriesName + '：' + i.data + symbol + '%<br/>'
                        }

                    }
                    return time + str;
                },
                axisPointer: {
                    type: 'none'
                },
            },
            legend: {
                right: data.legendRight || '30%',
                top: '12%',
                right: '5%',
                itemGap: 16,
                itemWidth: 10,
                itemHeight: 10,
                data: myData.legendArr,
                textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                }
            },
            grid: {
                x: 30,
                y: 80,
                x2: 30,
                y2: 60,
            },
            xAxis: {
                type: 'category',
                data: data.xAxis,
                axisTick: {
                    show: false,
                },

                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#1AA1FD',
                    },
                    symbol: ['none', 'arrow']
                },
                axisLabel: {
                    show: true,
                    interval: '0',
                    textStyle: {
                        lineHeight: 16,
                        padding: [2, 2, 0, 2],
                        height: 50,
                        fontSize: 12,
                    },
                    rich: {
                        Sunny: {
                            height: 50,
                            // width: 60,
                            padding: [0, 5, 0, 5],
                            align: 'center',
                        },
                    },
                    formatter: function (params, index) {
                        var newParamsName = "";
                        var splitNumber = 5;
                        var paramsNameNumber = params && params.length;
                        if (paramsNameNumber && paramsNameNumber <= 4) {
                            splitNumber = 4;
                        } else if (paramsNameNumber >= 5 && paramsNameNumber <= 7) {
                            splitNumber = 4;
                        } else if (paramsNameNumber >= 8 && paramsNameNumber <= 9) {
                            splitNumber = 5;
                        } else if (paramsNameNumber >= 10 && paramsNameNumber <= 14) {
                            splitNumber = 5;
                        } else {
                            params = params && params.slice(0, 15);
                        }

                        var provideNumber = splitNumber; //一行显示几个字
                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber) || 0;
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = params;
                        }
                        params = newParamsName;
                        return '{Sunny|' + params + '}';
                    },
                    color: '#1AA1FD',
                },

            },
            yAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#1AA1FD',
                    },
                    symbol: ['none', 'arrow']
                },
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#1AA1FD',
                        type: 'solid'
                    },
                }
            },
            series: myData.seriesArr
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echart_3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_3'));

        function showProvince() {
            var geoCoordMap = {
              仙憩园公墓: [118.652593, 33.682579],
              爱园公墓: [118.686724, 33.710702],
              来安街道天堂墓园: [118.814528, 33.701693],
              龙潭公墓: [118.69361, 33.654361],
              镇姚圩公墓: [118.591584, 33.671244],
              洪南天坛墓园: [118.734297, 33.767921],
              泗阳农场天堂墓园: [118.704723, 33.682726],
              众兴镇二桥公墓园: [118.638611, 33.709601],
              王集镇仙眠公墓: [118.806257, 33.882702],
              史集街道生态公墓: [118.640843, 33.779249],
              裴圩镇入仙园公墓: [118.702408, 33.505798],
              卢集镇青万年圣地园: [118.671598, 33.593111],
              李口镇长安纪念园: [118.726806, 33.667125]
            };
            var data = [
              {
                name: "仙憩园公墓",
                number: 100,
                mu: 50,
                guihua: 10,
                value: 20
              },
              {
                name: "爱园公墓",
                number: 340,
                mu: 144,
                guihua: 66,
                value: 20
              },
              {
                name: "来安街道天堂墓园",
                number: 88,
                mu: 32,
                guihua: 9,
                value: 20
              },
              {
                name: "龙潭公墓",
                number: 310,
                mu: 115,
                guihua: 38,
                value: 20
              },
              {
                name: "镇姚圩公墓",
                number: 325,
                mu: 121,
                guihua: 102,
                value: 20
              },
              {
                name: "洪南天坛墓园",
                number: 40,
                mu: 32,
                guihua: 6,
                value: 20
              },
              {
                name: "泗阳农场天堂墓园",
                number: 560,
                mu: 250,
                guihua: 100,
                value: 20
              },
              {
                name: "众兴镇二桥公墓园",
                number: 390,
                mu: 150,
                guihua: 30,
                value: 20
              },
              {
                name: "王集镇仙眠公墓",
                number: 81,
                mu: 20,
                guihua: 15,
                value: 20
              },
              {
                name: "史集街道生态公墓",
                number: 75,
                mu: 80,
                guihua: 30,
                value: 20
              },
              {
                name: "卢集镇青万年圣地园",
                number: 200,
                mu: 60,
                guihua: 50,
                value: 20
              },
              {
                name: "裴圩镇入仙园公墓",
                number: 120,
                mu: 30,
                guihua: 10,
                value: 20
              },
              {
                name: "李口镇长安纪念园",
                number: 70,
                mu: 30,
                guihua: 20,
                value: 20
              }
            ];
            var max = 480,
                min = 9; // todo
            var maxSize4Pin = 100,
                minSize4Pin = 20;
            var convertData = function(data) {
              var res = [];
              for (var i = 0; i < data.length; i++) {
                let geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                  res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value),
                    mu: data[i].mu,
                    number: data[i].number,
                    guihua: data[i].guihua
                  });
                }
              }
              return res;
            };

            myChart.setOption(
              (option = {
                title: {
                  text: "设备分布",
                  subtext: "",
                  x: "center",
                  textStyle: {
                    color: "#FFF"
                  },
                  left: "6%",
                  top: "10%"
                },
                legend: {
                  orient: "vertical",
                  y: "bottom",
                  x: "right",
                  data: ["pm2.5"],
                  textStyle: {
                    color: "#fff"
                  }
                },
                visualMap: {
                  show: false,
                  min: 0,
                  max: 500,
                  left: "left",
                  top: "bottom",
                  text: ["高", "低"], // 文本，默认为数值文本
                  calculable: true,
                  seriesIndex: [1],
                  inRange: {}
                },
                geo: {
                  show: true,
                  center: [118.71, 33.74],
                  map: "siyang",
                  mapType: "siyang",
                  label: {
                    normal: {},
                    //鼠标移入后查看效果
                    emphasis: {
                      textStyle: {
                        color: "#fff"
                      }
                    }
                  },
                  //鼠标缩放和平移
                  roam: true,
                  itemStyle: {
                    normal: {
                      //          	color: '#ddd',
                      borderColor: "rgba(147, 235, 248, 1)",
                      borderWidth: 1,
                      areaColor: {
                        type: "radial",
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [
                          {
                            offset: 0,
                            color: "rgba(175,238,238, 0)" // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "rgba(	47,79,79, .1)" // 100% 处的颜色
                          }
                        ],
                        globalCoord: false // 缺省为 false
                      },
                      shadowColor: "rgba(128, 217, 248, 1)",
                      shadowOffsetX: -2,
                      shadowOffsetY: 2,
                      shadowBlur: 10
                    },
                    emphasis: {
                      areaColor: "#389BB7",
                      borderWidth: 0
                    }
                  }
                },
                series: [
                  {
                    name: "light",
                    type: "map",
                    coordinateSystem: "geo",
                    data: convertData(data),
                    itemStyle: {
                      normal: {
                        color: "#F4E925"
                      }
                    }
                  },
                  {
                    name: "点",
                    type: "scatter",
                    coordinateSystem: "geo",
                    symbol: "pin",
                    symbolSize: function(val) {
                      var a =
                        (maxSize4Pin - minSize4Pin) / (max - min);
                      var b = minSize4Pin - a * min;
                      b = maxSize4Pin - a * max;
                      return a * val[2] + b;
                    },
                    label: {
                      normal: {
                        // show: true,
                        // textStyle: {
                        //     color: '#fff',
                        //     fontSize: 9,
                        // }
                      }
                    },
                    itemStyle: {
                      normal: {
                        color: "#F62157" //标志颜色
                      }
                    },
                    zlevel: 6,
                    data: convertData(data)
                  },
                  {
                    name: "light",
                    type: "map",
                    mapType: "hunan",
                    geoIndex: 0,
                    aspectScale: 0.75, //长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                      normal: {
                        show: false
                      },
                      emphasis: {
                        show: false,
                        textStyle: {
                          color: "#fff"
                        }
                      }
                    },
                    roam: true,
                    itemStyle: {
                      normal: {
                        areaColor: "#031525",
                        borderColor: "#FFFFFF"
                      },
                      emphasis: {
                        areaColor: "#2B91B7"
                      }
                    },
                    animation: false,
                    data: data
                  },
                  {
                    name: " ",
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    data: convertData(data),
                    symbolSize: function(val) {
                      return val[2] / 10;
                    },
                    showEffectOn: "render",
                    rippleEffect: {
                      brushType: "stroke"
                    },
                    label: {
                      normal: {
                        formatter: "{b}",
                        position: "right",
                        show: true
                      }
                    },
                    itemStyle: {
                      normal: {
                        color: "#05C3F9",
                        shadowBlur: 10,
                        shadowColor: "#05C3F9"
                      }
                    },
                    zlevel: 1
                  }
                ]
              })
            );
        }
        showProvince();

        // 使用刚指定的配置项和数据显示图表。
        // myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function echart_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart_4'));
        var data = [70, 34, 60, 78, 69];
        var titlename = ['冷藏柜', '火化炉', '守灵室', '告别厅', '寄存处'];
        var valdata = [702, 406, 664, 793, 505];
        var myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];
        option = {
            title: {
                text: '设备使用频率',
                x: 'center',
                textStyle: {
                  color: '#FFF'
                },
                left: '6%',
                top: '10%'
            },
            //图标位置
            grid: {
                top: '20%',
                left: '32%'
            },
            xAxis: {
                show: false
            },
            yAxis: [{
                show: true,
                data: titlename,
                inverse: true,
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                  color: '#fff',
                  fontSize:24,
                    formatter: (value, index) => {
                        return [

                            `{lg|${index+1}}  ` + '{title|' + value + '} '
                        ].join('\n')
                    },
                    rich: {
                        lg: {
                            backgroundColor: '#339911',
                            color: '#fff',
                            borderRadius: 20,
                            // padding: 5,
                            align: 'center',
                            width: 20,
                            height: 20
                        },
                    }
                },


            }, {
                show: true,
                inverse: true,
                data: valdata,
                axisLabel: {

                    textStyle: {
                        fontSize: 24,
                        color: '#fff',
                    },
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },

            }],
            series: [{
                name: '条',
                type: 'bar',
                yAxisIndex: 0,
                data: data,
                barWidth: 10,
                itemStyle: {
                    normal: {
                        barBorderRadius: 20,
                        color: function(params) {
                            var num = myColor.length;
                            return myColor[params.dataIndex % num]
                        },
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}%'
                    }
                },
            }, {
                name: '框',
                type: 'bar',
                yAxisIndex: 1,
                barGap: '-100%',
                data: [100, 100, 100, 100, 100],
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: 'none',
                        borderColor: '#00c1de',
                        borderWidth: 3,
                        barBorderRadius: 15,
                    }
                }
            }, ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // window.addEventListener("resize", function () {
        //     myChart.resize();
        // });
    }
});