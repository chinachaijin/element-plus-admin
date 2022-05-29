<template>
  <el-menu-item :index="thispath(onlyOneChild.path)" v-if="hasOneShowingChild(item.children,item)" :class="isRoot ? 'el-isdown-bg-color' : ''">
    <el-icon v-if="isRoot == false"><svg-icon :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" /></el-icon>
    <span class="showspan">{{(onlyOneChild.meta&&onlyOneChild.meta.title) || onlyOneChild.name}}</span>
  </el-menu-item>
  <el-sub-menu :index="thispath(item.path)" v-else :class="isRoot ? 'el-isdown-bg-color' : ''">
    <template #title>
      <el-icon v-if="isRoot == false"><svg-icon :icon-class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" /></el-icon>
      <span class="showspan">{{(item.meta&&item.meta.title) || item.name}}</span>
    </template>
    <MenuItem v-for="children in item.children" :key="children.name" :item="children" :isRoot="true" :basePath="thispath(item.path)"></MenuItem>
  </el-sub-menu>
</template>
<script>
import { isExternal } from '@/utils/validate'
import path from 'path-browserify'
export default {
  name: 'MenuItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      onlyOneChild:null
    }
  },
  methods: {
    thispath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
      
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        this.onlyOneChild.path = path.resolve(this.item.path, this.onlyOneChild.path)
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: this.item.path, noShowingChildren: true }
        return true
      }

      return false
    },
  }
}
</script>
<style scoped>
.showspan {
  width: 141px;
}
.el-isdown-bg-color{
  background-color: #1f2d3d;
}
.el-isdown-bg-color >>> .el-sub-menu__title{
  background-color: #1f2d3d!important;
}
</style>