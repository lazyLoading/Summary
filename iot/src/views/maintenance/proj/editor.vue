<template>
  <div>
    <div id="editorElem" style="text-align:center;" />
  </div>
</template>
<script>
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
const url = process.env.VUE_APP_BASE_API
console.log(url)
export default {
  name: 'Editor',
  data() {
    return {
      upload: url + '/storage/create',
      editorContent: '',
      editor: null
    }
  },

  mounted() {
    var editor = new E('#editorElem')
    this.editor = editor
    const _this = this

    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.customConfig.zIndex = 100
    // 过滤掉复制文本中自带的样式,默认开启
    editor.customConfig.pasteFilterStyle = false
    // 自定义处理粘贴的文本内容
    editor.customConfig.pasteTextHandle = function(content) {
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      return (
        "<p style='text-align:center;color:red;border-bottom:1px solid #DCDFE6;border-top:1px solid #DCDFE6;'>以下内容来源于网络,或者复制过来</p>" +
        content +
        "<p style='text-align:center;color:red;border-bottom:1px solid #DCDFE6;border-top:1px solid #DCDFE6;'>以上内容来源于网络,或者复制过来</p>"
      )
    }
    editor.customConfig.uploadFileName = 'file' // 上传参数 自定义
    editor.customConfig.uploadImgServer = this.upload // 上传图片
    editor.customConfig.uploadImgHeaders = {
      'X-Litemall-Admin-Token': getToken()
    }
    editor.customConfig.uploadImgHooks = {
      // 监听
      before: function(xhr, editor, files) {
        // 图片上传之前触发
      },
      success: function(xhr, editor, result) {
        _this.$message({
          type: 'success',
          message: '插入图片成功！'
        })
      },
      fail: function(xhr, editor, result) {
        _this.$message({
          type: 'error',
          message: '插入图片失败！'
        })
      },
      error: function(xhr, editor) {
        _this.$message({
          type: 'error',
          message: '插入图片失败！'
        })
      },
      timeout: function(xhr, editor) {
        _this.$message({
          type: 'error',
          message: '插入图片失败！'
        })
      },
      customInsert: function(insertImg, result, editor) {
        const {
          data: { url }
        } = result
        insertImg(url)
      }
    }
    editor.customConfig.onchange = html => {
      _this.editorContent = html
    }
    // editor.customConfig.linkImgCallback = function(url) {
    //   console.log(url); // url 即插入图片的地址
    // };
    editor.customConfig.linkCheck = function(text, link) {
      console.log(text) // 插入的文字
      console.log(link) // 插入的链接

      return true // 返回 true 表示校验成功
      // return '验证失败' // 返回字符串，即校验失败的提示信息
    }
    // 自定义配置颜色（字体颜色、背景色）
    editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff'
    ]
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    editor.customConfig.emotions = [
      {
        // tab 的标题
        title: '默认',
        // type -> 'emoji' / 'image'
        type: 'image',
        // content -> 数组
        content: [
          {
            alt: '[坏笑]',
            src:
              'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
          },
          {
            alt: '[舔屏]',
            src:
              'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
          }
        ]
      },
      {
        // tab 的标题
        title: 'emoji',
        // type -> 'emoji' / 'image'
        type: 'emoji',
        // content -> 数组
        content: ['😀', '😃', '😄', '😁', '😆']
      }
    ]
    // 自定义字体
    editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana'
    ]
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false
    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    // editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片不建议使用这种，我只是图个方便

    editor.create()
  },
  methods: {
    getContent: function() {
      console.log(this.editorContent)
    }
  }
}
</script>
<style>
/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul,
ol {
  margin: 10px 0 10px 20px;
}
</style>
