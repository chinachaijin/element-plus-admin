import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  data() {
    return {
      oldismobile:true
    }
  },
  // watch: {
  //   $route(route) {
  //     if (this.device === 'mobile' && this.sidebar.opened) {
  //       store.dispatch('app/closeSideBar', { withoutAnimation: false })
  //     }
  //   }
  // },
  beforeMount() {
    this.oldismobile = this.$_isMobile()
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('appsystem/setismobile', true)
    } else {
      store.dispatch('appsystem/setismobile', false)
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()

        if (isMobile) {
          if(this.oldismobile != isMobile && !store.state.appsystem.setting.iscollapse) {
            store.dispatch('appsystem/setiscollapse',true)
          }
          store.dispatch('appsystem/setismobile', true)
        } else {
          store.dispatch('appsystem/setismobile', false)
        }
        this.oldismobile = this.$_isMobile()
      }
    }
  }
}
