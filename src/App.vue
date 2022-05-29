<template>
  <Admin v-if="$route.meta.templatestatus == 'admin'"/>
  <router-view v-else/>
</template>

<script>
import Admin from "@/template/admin.vue"
export default {
  components: { Admin }
}
</script>
