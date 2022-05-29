<template>
  <div class="app-body" :class="{openmenu: !$store.state.appsystem.setting.iscollapse,collapsemenu: $store.state.appsystem.setting.iscollapse,mobile:$store.state.appsystem.setting.ismobile}">
    <div :class="!$store.state.appsystem.setting.iscollapse && $store.state.appsystem.setting.ismobile ? 'drawer-bg' :''" @click="heidmenu"></div>
    <router-view name="menu" class="app-menu"/>
    <div class="app-content">
      <div class="app-head">
        <router-view name="head" />
      </div>
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods:{
    heidmenu() {
      this.$store.dispatch('appsystem/setiscollapse',!this.$store.state.appsystem.setting.iscollapse)
    },
  }
}
</script>
<style lang="scss" scoped>
.app-body {
  position: relative;
  height: 100%;
  width: 100%;
  .app-menu {
    transition: width .28s;
    background-color: #304156;
    width: 210px;
    position: absolute;
    height: 100%;
    font-size: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  .app-content {
    min-height: 100%;
    margin-left: 210px;
    transition: all 0.2s ease-in;
    .app-main {
      min-height: calc(100vh - 50px);
      max-height: calc(100vh - 50px);
      width: 100%;
      position: relative;
      overflow: hidden;
      .app-container{
        overflow: auto;
        height: calc(100vh - 70px);
      }
    }
  }

  &.collapsemenu{
    .app-menu {
      width: 64px;
    }
    .app-content {
      margin-left: 64px;
      transition: all 0.2s ease-in;
    }
    &.mobile .app-menu {
      width: 0px;
      transition: all 0.2s ease-in;
    }
  }
  &.openmenu{
    .app-menu {
      width: 210px;
    }
    &.mobile .app-menu {
      position: absolute;
      transition: all 0.2s ease-in;
    }
  }
  &.mobile .app-content {
    margin-left: 0px;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.el-sub-menu .el-menu-item{
  background-color: #1f2d3d!important;
}
.app-container{
  margin: 20px;
}
</style>