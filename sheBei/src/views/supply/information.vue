<template>
    <div class="common-table">
      <el-card class="contentCard">
        <el-table :data="tableData" :height="tableHight"  style="width: 100%">
            <el-table-column label=""> 
                <template slot-scope="scope">
                  <span class="imgStyle" v-show="scope.row.noticeType == 1"><img :src="infoImg" alt=""></span>
                  <span  class="imgStyle" v-show="scope.row.noticeType == 0"><img :src="showImg" alt=""></span>
                    <span class="titleStyle" @click="checkDetail(scope.row)">
                      <span class="titleTip">{{scope.row.moduleName}}</span>
                      <span class="titleContent">{{scope.row.title}}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="noticeTypeName" label="" width="180"> 
                <template slot-scope="scope">
                    <el-button type="primary" plain>{{scope.row.noticeTypeName}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="" width="180"> </el-table-column>
        </el-table>
      </el-card>
        <div class="pageContainer">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <div class="drawerContainer">
            <el-drawer
                :title="detaileTitle"
                size="50%"
                :visible.sync="detailDrawer"
                direction="rtl"
                :before-close="handleClose">
                <div class="contentContainer">
                    <div class="titleContainer">
                        <span>{{detailObj.title}}</span>
                    </div>
                    <div class="tipContainer">
                        <span style="margin-right:20px;">发布人员：{{detailObj.operatorName}}</span>
                        <span>发布时间：{{detailObj.createdAt}}</span>
                    </div>
                    <div class="contentBox">
                        <span>{{detailObj.content}}</span>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import {powerApi} from "../../api/user.js"
export default {
data() {
    return {
        pageNum:1,
        pageSize:10,
        tableHight: null,
        detailDrawer:false,
        detaileTitle:'系统公告',
        infoImg: require("../../assets/images/icon_info.png"),
        showImg: require("../../assets/images/icon_show.png"),
        total:100,
        detailObj:{},
        tableData: [
        ],
        };
    },
    methods:{
        getInfoList(){
            powerApi.getInfoList({pageNum:this.pageNum,pageSize:this.pageSize}).then(res=>{                
                if(res.data.code===200){
                    this.tableData = res.data.data.content
                    this.total=res.data.data.total
                }
            })
        },
        checkDetail(row){
            this.detailObj = row
            this.detailDrawer = true
        },
        handleSizeChange(val){
            this.pageNum =1
            this.pageSize = val
            this.getInfoList()
            
        },
        handleCurrentChange(val){
            this.pageNum = val
            this.getInfoList()
        },
        handleClose(done){
            done(); 
        }
    },
    mounted() {
        window.onresize = function () {
        this.tableHight = windowHeight() - 360;
        };
        this.getInfoList()
    },
    created() {
        this.tableHight = windowHeight() - 360;
    },
};
</script>
<style lang="less" scoped>
  /deep/ .el-drawer__header{
        border-left: 6px solid #409EFF;
        padding: 0px 10px;
        margin: 10px;
        font-size: 22px;
        color: #000;
    }
    /deep/.el-drawer {
        border-bottom-left-radius: 10px !important;
        border-top-left-radius: 10px !important;
    }
    .common-table {
        height: 100%;
        background-color: #fff;
        .contentCard {
        padding: 0px 5px 10px 5px;
        margin-bottom: 15px;
        border-radius: 10px;
        }
        /deep/ .has-gutter {
            display: none;
        }
        .imgStyle{
          vertical-align: middle;
        }
        .titleStyle{
            .titleTip{
              font-size: 16px;
              font-weight: 600;
              padding: 0px 10px;
            }
            .titleContent{
              cursor: pointer;
            }
            .titleContent:hover{
              color: #409eff;
            }
        }
        .pageContainer {
            margin-top: 30px;
            text-align: center;
        }
        .contentContainer{
            margin-top: 20px;
            padding: 0px 30px;
            text-align: center;
            .titleContainer{
                display: inline-block;
                height: 40px;
                line-height: 40px;
                padding: 0px 10px;
            }
            .tipContainer{
                width: 100%;
                height:60px;  
                line-height: 40px;
                margin-top: 20px;
                padding: 0px 10px;
                color:rgb(187, 184, 184);
            }
            .contentBox{
                margin-top: 10px;
                padding: 20px;
                color:rgb(148, 147, 147);
                line-height: 30px;
                min-height: 500px;
                background-color: rgb(243, 245, 248);
                border-radius: 15px;
                overflow: auto;
            }
        }
    }
</style>