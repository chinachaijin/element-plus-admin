<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :active-text-color="variables.menuActiveText"
      :background-color="variables.menuBg"
      class="el-menu-not-rigth-border"
      :collapse="setting.iscollapse"
      router
      :default-active="this.$route.path"
      :collapse-transition="!$store.state.appsystem.setting.ismobile"
      :text-color="variables.menuText"
    >
      <template v-for="item in routes" :key="item.name">
        <MenuItem :item="item" v-if="item.hidden != true"></MenuItem>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import variables from '@/style/variables.scss?scss&type=style&index=0&lang=scss&module=1'
import MenuItem from "./menu/MenuItem"
export default {
  computed: {
    ...mapGetters([
      'setting'
    ]),
    routes() {
      let route = this.$router.options.routes
      route = route.concat(this.$store.state.permission.addRoutes)
      return route
    },
    variables() {
      console.log(variables.menuBg)
      return variables
    },
  },
  components:{MenuItem},
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style scoped>
.el-menu-not-rigth-border{
  border-right: initial!important;
}
</style>