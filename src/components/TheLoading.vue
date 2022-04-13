<!--
Author: zusheng
Date: 2022-04-12 15:36:11
LastEditTime: 2022-04-12 15:52:51
Description: css3全局加载动画
FilePath: \vite-music-player\src\components\TheLoading.vue
-->
<template>
  <div class="g-loading">
    <div></div>
  </div>
</template>

<style lang="less">
.g-loading {
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  > div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    // margin-left: -50%;
    animation: typing 1s linear infinite;
    // alternate
    background-color: rgba(39, 39, 39, 0.1);
    box-shadow: -26px 0px 0px 0px rgba(39, 39, 39, 1),
      24px 0px 0px 0px rgba(39, 39, 39, 0.1);
  }

  @keyframes typing {
    0% {
      background-color: rgba(39, 39, 39, 0.1);
      box-shadow: -26px 0px 0px 0px rgba(39, 39, 39, 1),
        24px 0px 0px 0px rgba(39, 39, 39, 0.1);
    }
    25% {
      background-color: rgba(39, 39, 39, 1);
      box-shadow: -24px 0px 0px 0px rgba(39, 39, 39, 0.1),
        24px 0px 0px 0px rgba(39, 39, 39, 0.1);
    }
    75% {
      background-color: rgba(39, 39, 39, 0.1);
      box-shadow: -24px 0px 0px 0px rgba(39, 39, 39, 0.1),
        26px 0px 0px 0px rgba(39, 39, 39, 1);
    }
  }
}
</style>
