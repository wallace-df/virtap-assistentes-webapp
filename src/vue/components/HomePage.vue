<template>
  <div class="loading_container" v-if="loading">
    <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
  </div>

  <div class="loading_container" v-else-if="hasError">
    <h2 class="text-danger">Ocorreu um erro. Por favor, atualize a página.</h2>
  </div>

  <div class="loading_container" v-else-if="projects.length === 0">
    <h2 class="text-warning">Nenhum projeto disponível.</h2>
  </div>

  <div class="images section" v-else>
    <h2 class="mb-5">Projetos</h2>
    <div class="images__container">
      <div v-for="project in projects" :key="project.id">
       <div class="images__card pt-2 pb-2" style="min-height: 0">
        <h2 class="text-left m-3">{{project.title}}</h2>
        <small><em>(publicado por <strong>{{project.customerName}}</strong>)</em></small>
        <div class="text-left p-3" style="text-align: justify; overflow-y: auto; height:150px">
         <small >{{project.description}}</small>
        </div>
        <p class="m-3">
          <button class="btn btn-success full" @click="rentNFT(listing)">
           Enviar proposta
          </button>
        </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssistantManager from "../../js/services/assistant.js";

export default {

  components: { },

  created() {
    this.$store.commit("setActiveSection", "HomePage");
    this.loadAssistantData();
  },

  data() {
    return { 
      hasError: false,
      projects: []
    }
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },

  methods: {
    async loadAssistantData() {
      this.$store.commit("setLoading", true);

      try {
        let assistantData = await AssistantManager.getAssistantData();
        this.projects = assistantData.projects;
      } catch (error) {
        console.log(error);
        if (error.status === 401) {
          this.$router.push({path: '/assistente/login'});
        } else {
          console.log(error);
          this.hasError = true;
        }
      } finally {
        this.$store.commit("setLoading", false);
      }
    }
  }
}
</script>
