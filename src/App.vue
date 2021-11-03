<template>
  <topnav v-if="hasTeam && !checkingTeam" />
  <router-view v-if="hasTeam && !checkingTeam"/>
  <firstPlay @teamFound="checkIfTeam()" v-if="!hasTeam && !checkingTeam" />
</template>

<script>
import main from './main.js'
import topnav from "../src/components/TopNav.vue"
import firstPlay from "../src/components/FirstPlay.vue"
export default {
  components: { topnav, firstPlay },
  data(){
    return{
      checkingTeam: true,
      hasTeam:'',
      teamMintCost:10,
      preloading: true
    }
  },
  methods: {

    // async getTeamMintCost(){
    //   await main.getTeamMintCost().then(res =>{
    //     this.teamMintCost = res
    //   }).catch(err =>{
    //     console.log(err)
    //   })
    // },

    async checkIfTeam(){
      await main.checkIfTeam().then(res => {
        this.hasTeam = res
        this.preloading = false
        this.checkingTeam = false
      }).catch(err => {
        console.log(err)
        this.preloading = false
        this.checkingTeam = false
      })
    }
},

  mounted() {
    console.log("MOUNTED")
    this.$nextTick(function(){
      // this.getTeamMintCost()
      this.checkIfTeam()  
    })
    
  }
}
</script>



<style>
.inputselect{
  caret-color: transparent;
}

#app {
  font-family: Monstserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 10px;
}

#nav a.router-link-exact-active {
  color: #fff;
  background: rgb(12, 185, 128);
}

#disconnect-button {
  
  color: #fff;
  background-color: #70220f;
  text-decoration: none;
  margin: 0 0 0 20px ; 
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s;
}

#disconnect-button:hover {
  
  color: #fff;
  background-color: #BA2E0B;
  text-decoration: none;
  margin: 0 0 0 20px ; 
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.hide {
    visibility: hidden !important;
}
</style>
