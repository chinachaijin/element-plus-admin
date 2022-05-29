<template>
  <div class="head-main">
    <collapse  class="collapse-container"/>
    <breadcrumb class="breadcrumb-container" />
    <rightAvatar />
  </div>
</template>
<script>
import collapse from './head/collapse.vue'
import breadcrumb from './head/breadcrumb.vue'
import rightAvatar from './head/rightAvatar.vue'
export default {
  components:{collapse,breadcrumb,rightAvatar},
  setup() {
    
  },
}
</script>
<style lang="scss" scoped>
.collapse-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background .3s;
  -webkit-tap-highlight-color:transparent;

  &:hover {
    background: rgba(0, 0, 0, .025)
  }
}
.breadcrumb{
  line-height: 46px;
  height: 100%;
}
.head-main{
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
</style>