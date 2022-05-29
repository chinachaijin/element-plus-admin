<template>
  <router-view />
</template>
<script>
import ResizeMixin from './mixin/ResizeHandler'
export default {
  mixins: [ResizeMixin],
  name: 'Layout',
  setup() {
      
  },
}
</script>
<style lang="scss" scoped>

</style>