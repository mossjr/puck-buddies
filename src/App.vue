<template>
<div v-if="testNet">
  <topnav v-if="hasTeam && !checkingTeam" />
  <router-view v-if="hasTeam && !checkingTeam"/>
  <firstPlay @teamFound="getTeamFromMoralis()" v-if="!hasTeam && !checkingTeam" />  
</div>

<div v-if="!testNet && crowdSale">
  <crowdsale />
</div>
  
</template>

<script>
import main from './main.js'
import topnav from "../src/components/TopNav.vue"
import firstPlay from "../src/components/FirstPlay.vue"
import crowdsale from "../src/components/Crowdsale.vue"
import {crowdSaleLive, testNetVersion} from "../src/config.js"

export default {
  components: { topnav, firstPlay, crowdsale },
  data(){
    return{
      checkingTeam: true,
      hasTeam:'',
      teamMintCost:10,
      preloading: true,
      crowdSale: '',
      testNet:'',
    }
  },
  methods: {

    async checkTestNet(){
      // console.log(crowdSaleLive)
      // console.log(testNetVersion)
      this.crowdSale = crowdSaleLive
      this.testNet = testNetVersion
      if(testNetVersion == true){
          this.$nextTick(function(){
            this.getTeamFromMoralis() 
          })
      }
    },

    async getTeamFromMoralis(){
       await main.getTeamFromMoralis().then(res => {
          //console.log(res)
          this.hasTeam = res
          this.preloading = false
          this.checkingTeam = false
       }).catch(err => {
          //console.log(err)
          this.preloading = false
          this.checkingTeam = false
       })
    }

 },

  mounted() {
    this.checkTestNet()    
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
  margin: 5px;
  
}

#nav .mystuff.router-link-exact-active {
  color: #fff;
  background: rgb(12, 185, 128);
}
#nav .marketplace.router-link-exact-active {
  color: #fff;
  background: mediumpurple;
}
#nav .proshop.router-link-exact-active {
  color: #fff;
  background: steelblue;
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
