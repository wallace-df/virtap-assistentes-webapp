<template>
  <div class="loading_container" v-if="loading">
    <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
  </div>

  <div class="loading_container" v-else-if="hasError">
    <h2 class="text-danger">Ocorreu um erro. Por favor, atualize a página.</h2>
  </div>

  <div class="m-5" v-else-if="profile === null">
    <h5 class="text-center text-dark">Preencha seu perfil abaixo:</h5>
    <form  style="margin: 0 auto; width: 50%">
      <div class="form-group">
        <label>Nome completo</label>
        <input type="text" class="form-control" v-model="this.name">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-control" v-model="this.email"  disabled>
      </div>
      <div class="form-group">
        <label>Foto de perfil</label>
        <input type="file" class="form-control" ref="pictureFile" @change="setFile()" accept="image/*">
        <img ref="picturePreview" width="200" v-if="picture !== null">
      </div>
      <div class="form-group">
        <label>Título</label>
        <input type="text" class="form-control" v-model="title">
      </div>
      <div class="form-group">
        <label>Whatsapp</label>
        <input type="tel" class="form-control" v-model="whatsapp" pattern="\([0-9]{2}\) [0-9]{5}-[0-9]{4}">
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect2">Áreas de atuação (até 3)</label>
        <div class="form-check text-left mt-2">
          <input class="form-check-input" type="checkbox" value="ASSISTENCIA_PESSOAL" @click="selectArea($event)" :readonly="!areasAvailable">
          Assistencia Pessoal
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SECRETARIADO_REMOTO" @click="selectArea($event)" :readonly="!areasAvailable">
          Secretariado Remoto
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SECRETARIADO_EXECUTIVO" @click="selectArea($event)" :readonly="!areasAvailable">
          Secretariado Executivo
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SUPORTE_ADMINISTRATIVO" @click="selectArea($event)" :readonly="!areasAvailable">
          Suporte Administrativo
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SUPORTE_PARA_INFOPRODUTORES" @click="selectArea($event)" :readonly="!areasAvailable">
          Suporte para infoprodutores
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="ENTRADA_DE_DADOS" @click="selectArea($event)" :readonly="!areasAvailable">
          Entrada de dados
        </div>
      </div>
      <div class="form-group">
        <label>Conte-nos sobre você e um pouco da sua experiência profissional</label>
        <textarea class="form-control" rows="7" v-model="experience"></textarea>
      </div>
      <div class="form-group">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="acceptTerms">
         Aceito os <a href="#">termos de uso</a>.
        </div>
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" v-model="receiveNews">
         Quero receber novidades.
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="!detailsOK" @click="registerAssistant">Enviar</button>
      </div>
    </form>
    
  </div>


  <div class="m-5" v-else-if="profile !== null">
    <h5 class="text-center text-dark">Seu perfil</h5>
    <div class="alert bg-warning" v-if="profile.status === 1">Seu perfil está sendo revisado.</div>
    <form  style="margin: 0 auto; width: 50%">
      <div class="form-group">
        <label>Nome completo</label>
        <input type="text" class="form-control" :value="profile.name" disabled>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" class="form-control" :value="profile.email_address"  disabled>
      </div>
      <div class="form-group">
        <label>Foto de perfil</label><br/>
        <img :src="getImageURL(profile.picture)" width="200">
      </div>
      <div class="form-group">
        <label>Título</label>
        <input type="text" class="form-control" :value="profile.title" disabled>
      </div>
      <div class="form-group">
        <label>Whatsapp</label>
        <input type="text" pattern="\([0-9]{2}\) [0-9]{45-[0-9]{4}" class="form-control" :value="profile.whatsapp" disabled>
      </div>
      <div class="form-group">
        <label for="exampleFormControlSelect2">Áreas de atuação (até 3)</label>
        <div class="form-check text-left mt-2">
          <input class="form-check-input" type="checkbox" value="ASSISTENCIA_PESSOAL" v-model="profile.expertise_areas" disabled>
          Assistencia Pessoal
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SECRETARIADO_REMOTO" v-model="profile.expertise_areas" disabled>
          Secretariado Remoto
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SECRETARIADO_EXECUTIVO" v-model="profile.expertise_areas" disabled>
          Secretariado Executivo
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SUPORTE_ADMINISTRATIVO" v-model="profile.expertise_areas" disabled>
          Suporte Administrativo
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="SUPORTE_PARA_INFOPRODUTORES" v-model="profile.expertise_areas" disabled>
          Suporte para infoprodutores
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="ENTRADA_DE_DADOS" v-model="profile.expertise_areas" disabled>
          Entrada de dados
        </div>
      </div>
      <div class="form-group">
        <label>Conte-nos sobre você e um pouco da sua experiência profissional</label>
        <textarea class="form-control" rows="7" :value="profile.experience" disabled></textarea>
      </div>
    </form>


    <div class="loading_container" v-if="projects.length === 0">
      <h2 class="text-warning">Nenhum projeto disponível.</h2>
    </div>

    <div class="section" v-else>
      <h2 class="mt-5 text-center">Projetos</h2>
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
  </div>


</template>

<script>
import AssistantManager from "../../../js/services/assistant.js";
import StringUtils from "../../../js/utils/string.js";

export default {

  components: { },

  created() {
    this.$store.commit("setActiveSection", "AssistantDashboard");
    this.loadAssistantData();
  },

  data() {
    return { 
      hasError: false,
      authUser: null,
      name: null,
      email: null,
      picture: null,
      title: null,
      whatsapp: null,
      areas: [],
      experience: null,
      acceptTerms: false,
      receiveNews: false,
      profile: null,
      projects: []
    }
  }, 

  computed: {
    loading() {
      return this.$store.state.loading;
    },
    detailsOK() {    
      return !StringUtils.isEmpty(this.name) && 
             this.name.trim().length > 10 &&
             this.picture !== null &&
             !StringUtils.isEmpty(this.whatsapp) &&
             this.whatsapp.trim().length > 8 &&
             !StringUtils.isEmpty(this.experience) &&
             this.experience.trim().length > 100 && 
             this.areas.length > 0 &&
             this.acceptTerms

    },
    areasAvailable() {
      return this.areas.length < 3;
    }
  },

  methods: {
    async loadAssistantData() {
      this.$store.commit("setLoading", true);

      try {
        let assistantData = await AssistantManager.getAssistantData();
        this.email = assistantData.authUser.email;
        this.profile = assistantData.profile;
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
    },
    setFile() {
      let files = this.$refs.pictureFile.files;
      if (files && files.length > 0) {
        this.picture = files[0];
        let reader = new FileReader();
        let ctx = this;
        reader.onload = function(event) {
          ctx.$refs.picturePreview.src = event.target.result;
        }
        reader.readAsDataURL(this.picture);
      } else {
        this.picture = null;
      }
    },
    selectArea(event) {    
     if (!event.target.checked) {
      this.areas = this.areas.filter(a => a !== event.target.value);
     } else if(this.areas.length < 3) {
        this.areas.push(event.target.value);
     } else {
        event.target.checked = false;
     }
    },
    async registerAssistant() {
      this.$store.commit("setLoading", true);

      try {
        let assistantDetails = {
           emailAddress: this.email,
           name: this.name,
           picture: this.picture,
           whatsapp: this.whatsapp,
           title: this.title,
           expertiseAreas: this.areas,
           experience: this.experience,
        };
        let assistantData = await AssistantManager.registerAssistant(assistantDetails);
        this.email = assistantData.authUser.email;
        this.profile = assistantData.profile;
        this.projects = assistantData.projects;
      } catch (error) {
        console.log(error);
        if (error.status === 401) {
          this.$router.push({path: '/assistente/login'});
        } else {
          console.log(error);
          this.showError("Não foi possível registrar seus dados. Por favor, atualize a página e tente novamente.");
          //this.hasError = true;
        }
      } finally {
        this.$store.commit("setLoading", false);
      }
    },
  }
}
</script>
