<template>
<div class="backdrop" @click.self="closeModal">
    <div class="admin-modal">
      <div class="admin-container">
        <div class="admin"><h3>PvC Matchups</h3></div>
        <div class="admin-info-line"><b>PvC Matchup Address:</b> {{PvCAddress}}</div>
        <div class="admin-info-line"><b>PvC Matchup Difficulty Mod:</b> {{PvCDifficultyMod}}</div>
        <div class="admin-info-line"><b>PvC Matchup Buddies Rewards:</b> {{PvCBuddiesReward0}}, {{PvCBuddiesReward1}}, {{PvCBuddiesReward2}}</div>
        <div class="admin-info-line"><b>PvC Matchup PBXP Rewards:</b> {{PvCPBXPReward}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Players</h3></div>
        <div class="admin-info-line"><b>Players Contract Address:</b> {{PvCAddress}}</div>
        <div class="admin-info-line"><b>PvC Matchup Difficulty Mod:</b> {{PvCDifficultyMod}}</div>
        <div class="admin-info-line"><b>PvC Matchup Buddies Rewards:</b> {{PvCBuddiesReward0}}, {{PvCBuddiesReward1}}, {{PvCBuddiesReward2}}</div>
        <div class="admin-info-line"><b>PvC Matchup PBXP Rewards:</b> {{PvCPBXPReward}}</div>
      </div>
   
    </div>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div>   
</template>

<script>
import main from '../main.js'
import LockModal from './LockModal.vue'

export default {
    components: {LockModal},
    data(){
        return{
            PvCAddress:'',
            PvCBuddiesReward0:'',
            PvCBuddiesReward1:'',
            PvCBuddiesReward2:'',
            PvCDifficultyMod:'',
            PvCPBXPReward:'',


            budsPerBNB:'',
            totalBuds:'',
            totalBudsSold:'',
            budsToPurchase:35,
            progressColor:'',
            progressPercent:'',
            splashImage: '',
            screenLocked: false
        }
    },

    methods: {

  
    async getPvCadminInfo() {
      await main.getPvCadminInfo().then(res => {
        console.log(res)
        this.PvCAddress = res.PvCAddress
        this.PvCBuddiesReward0 = res.PvCBuddiesReward0
        this.PvCBuddiesReward1 = res.PvCBuddiesReward1
        this.PvCBuddiesReward2 = res.PvCBuddiesReward2
        this.PvCDifficultyMod = res.PvCDifficultyMod
        this.PvCPBXPReward = res.PvCPBXPReward

      })
    },


        closeModal() {
            this.$emit('closeIcoModal')
        },


    },
    computed: {
      // fixedbudsToPurchase: function() {
      //   let n = this.budsToPurchase.toFixed(0)
      //   return n
      // },

    },

    mounted: function(){
       this.getPvCadminInfo()
       
    }
}

</script>


<style scoped>
.admin-modal{
  caret-color: rgba(0,0,0,0);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:800px;
    max-width: 90%;
    padding: 20px;
    color: black;
    background: #fff;
    border-radius: 10px;
    box-shadow: 20px 20px 20px 0 rgba(0, 0, 0, 0.5);

}

.backdrop {
    backdrop-filter: blur(5px);
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}

.ico-input{
	position:relative;
  font-size: 2em;
  width: 200px;
  background: lightgoldenrodyellow;
  padding: 3px;
  display: inline-block;
  border: none;
  margin: 60px 0 0 0 ;
  text-align: center; 
}

input:focus, textarea:focus, select:focus{
        outline: none;
        caret-color: black;
    }

.green-button{
   margin: 15px;
font-size: 3em;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px 30px 10px 30px;
border-radius: 10px;
border: none;
transition: 0.3s ease;
}

.green-button-sm{
   margin: 5px;
font-size: 16px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 5px;
border-radius: 5px;
border: none;
transition: 0.3s ease; 
}
.green-button:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button-sm:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button:focus{
    outline: none;
 border: none;
  background: rgb(12, 185, 128);
}

.green-button-close{
width: 20%;
margin: 15px;
font-size: 2em;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease; 
}

.green-button-close:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.green-button-close:focus{
    outline: none;
 border: none;
  background: rgb(78, 87, 84);
}

.sm-warn{
  font-size:0.8em;
  margin: 10px;
}

.ico-progress-bar-container{
height: 40px;
  width: 550px;
  background-color: rgb(214, 214, 214);
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  border-radius: 20px;
}

.ico-progress-bar-container .ico-progress{
  position: absolute;
  height: 100%;
  border-radius: 20px;
  transition: 3.6s;
}

#ico-play-animation{
  animation: ico-progress-animation 1s forwards;
}

.buds-coin{
    cursor: pointer;
}

@keyframes ico-progress-animation {
  0% {width: 0%; background-color:indigo;}
  100% {}
}

</style>