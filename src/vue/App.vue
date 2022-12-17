<template>
  <MenuBar/>
  <router-view></router-view>
</template>

<script>
import MenuBar from "./components/MenuBar.vue";

export default {
  name: "App",

  components: { MenuBar },

  data() {
    return {}
  },

  computed: { },

  methods: { }
}
</script>
