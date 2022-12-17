<template>
    <!-- Navbar Section -->
    <nav class="navbar">
      <div class="navbar__container">
        <router-link to="/" id="navbar__logo">Assistente Virtual | Dashboard</router-link>
        <div class="navbar__toggle" id="mobile-menu">
          <span class="bar"> </span>
          <span class="bar"> </span>
          <span class="bar"> </span>
        </div>
        <ul class="navbar__menu">
        </ul>
      </div>
    </nav>
</template>

<script>
export default {
    name: "MenuBar",

    data() {
      return { }
    },

    computed: {
      section() {
        return this.$store.state.activeSection;
      }
    },

    methods: { }
}
</script>
