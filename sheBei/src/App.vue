<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="less" type="text/less">
#app {
  height: 100%;
}
//修改滚动条样式
body,
html {
  ::-webkit-scrollbar-track-piece {
    background-color: #f8f8f8;
  }
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbc3d2;
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 3em;
    -moz-border-radius: 3em;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
}
</style>
