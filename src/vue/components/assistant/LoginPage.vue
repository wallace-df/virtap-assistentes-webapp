<template>
    <div class="loading_container" style="flex-direction: column">
       <h2 class="text-dark">Você precisa estar logado para acessar esta página.</h2>
        <div class="text-center mt-3">
          <a class="hollow btn btn-primary" href="http://localhost:3000/auth/google">
              <img style="margin-bottom:3px; margin-right:5px; width: 20px" alt="Google login" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
              Sign in with Google
          </a>
        </div>
    </div>

</template>

<script>
export default {
   created() {
    this.$store.commit("setActiveSection", "AssistantLoginPage");
    this.$store.commit("setLoading", false);
  },   
  
  components: { },

  data() {
    return { }
  },

  methods: { }
}
</script>
