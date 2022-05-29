<template>
  <div class="right-menu">
    <el-dropdown trigger="click">
      <div class="avatar-wrapper">
        <el-avatar shape="square" :size="40" fit="fill" :src="user.avatar" />
        <el-icon class="el-icon--right"><CaretBottom /></el-icon>
      </div>
      <template #dropdown>
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">登出</span>
        </el-dropdown-item>
      </template>
    </el-dropdown>

  </div>
</template>
<script>
import { CaretBottom } from '@element-plus/icons-vue'
import { mapGetters } from 'vuex'
import { logout } from '@/api/login'

export default {
  data() {
    return {
      avatar:''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
  },
  components:{ CaretBottom },
  methods:{
    async logout() {
      await this.$store.dispatch('user/logout')
      await logout(this.$store.state.user.token)
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style scoped>
.right-menu{
  display: inline;
  float: right;
  height: 100%;
}
.avatar-wrapper{
  margin-top: 5px;
}
</style>