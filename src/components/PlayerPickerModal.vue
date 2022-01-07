<template>
<div class="backdrop" @click.self="closeModal">
    <div class="player-modal">
       

<div class="loading-icon-container">
  <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingPlayers && totalFoundPlayers > 0 ">
</div>

<div class="player-container" v-if="!loadingPlayers">
  <div v-for="(player, index) in players" :key="index" :class="`playertype-${player.playertype}`">
    
        <div v-if="player.isOffence && player.equippedToken == 0">
          <div class="play-select-card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button v-if="player.equippedToken == 0" @click="applyEquipmentToPlayer('PB-BRB', selectToken, selectedItemSku, player.id)" class="green-button-sm">APPLY {{selectItemType}}-{{selectedItemSku}} TO ID: {{player.id}}</button>
        </div>
      </div>

              <div v-if="player.isDefence && player.equippedToken == 0">
          <div class="play-select-card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button v-if="player.equippedToken == 0" @click="applyEquipmentToPlayer('PB-BRB', selectToken, selectedItemSku, player.id)" class="green-button-sm">APPLY {{selectItemType}}-{{selectedItemSku}} TO ID: {{player.id}}</button>
        </div>
      </div>

              <div v-if="player.isGoalie && player.equippedToken == 0">
          <div class="play-select-card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
           <button v-if="player.equippedToken == 0" @click="applyEquipmentToPlayer('PB-BRB', selectToken, selectedItemSku, player.id)" class="green-button-sm">APPLY {{selectItemType}}-{{selectedItemSku}} TO ID: {{player.id}}</button>
        </div>
      </div>

  </div>
</div>

  <div>
    <button class="load-more-button" @click="(loadPlayers) => { playersToShow = playersToShow + playersToShow, sendPlayerData()}" v-if="playersToShow < totalFoundPlayers">Load More</button>
  </div>
        
      
        


        <button class="green-button-close" @click="closeModal">Close</button>
    </div>
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div>   
</template>

<script>
import buildCanvas from '../scripts/buildPlayer.js'
import main from '../main.js'
import LockModal from '../components/LockModal.vue'

export default {
    components: {LockModal},
    data(){
        return{
            freeAgencyButton: false,
            assignToTeamButton: false,
            sellingValue: 2,
            sellingFeePercent: 4,
            sellingFee: '',
            loadingPlayers: true,
            players: [],
            playersToShow: 36,
            totalFoundPlayers: 0,
            splashImage: '',
            screenLocked: false
        }
    },
    props:  ['selectedItemSku',
             'selectItemType',
             'selectToken'
            ],
    methods: {

    async sendPlayerData() {
      this.checkPBPlayerAdmin()
      Promise.all(await main.loadPBPlayers())
      .then(res => {
        //console.log("Found " + res.length + " Players")
        let playerArray = []     
        for (let i = 0; i < res.length; i++) {
              let isOff
              let isDef
              let isGoal
              if(res[i].playertype == 1){
                isOff = true
                isDef = false
                isGoal = false
              }else if (res[i].playertype == 2){
                isOff = false
                isDef = true
                isGoal = false
              }else if (res[i].playertype == 3){
                isOff = false
                isDef = false
                isGoal = true
              }
            buildCanvas.preloadPlayerInfo(res[i].id, res[i], "player-no")
            playerArray.push({
              'id': res[i].id, 
              'offence': res[i].offence,  
              'defence': res[i].defence, 
              'dna': res[i].dna, 
              'playertype' : res[i].playertype,
              'isOffence' : isOff,
              'isDefence' : isDef,
              'isGoalie' : isGoal,
              'teamId' : res[i].teamId,
              'teamLetter': res[i].teamLetter,
              'equippedToken' : res[i].equippedToken
              }) 
        }
        this.loadingPlayers = false
        this.updateBalanceViewer()
        return playerArray
          
      })
      .then(res => {
          this.totalFoundPlayers = res.length
          this.players = res
        })
        .catch((err) => {
          this.updateBalanceViewer()
          this.totalFoundPlayers = 0
          //console.log("Rendering Players in My Players Error: " + err)
          this.players = null
        })
    },

    async applyEquipmentToPlayer(_splashImage, selectToken, sku, playerId){
            this.splashImage = _splashImage
            this.screenLocked = true
        await main.applyEquipmentToPlayer(selectToken, sku, playerId).then(res => {
            //console.log(res)
            this.screenLocked = false
            this.closeModal()
            this.sendPlayerData()
        })
        .catch(err => {
            this.screenLocked = false
            //console.log(err)
        })
    },

    async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          if(res > this.costToDraft){
            this.noFunds = false;
          }else if(this.costToDraft){
            this.noFunds = true;
          }
        })
    },
    
    async checkPBPlayerAdmin() {
       await main.checkPBPlayerAdmin().then(res => {
       //console.log("Is PBP Admin: " + res)
       this.isPBPAdmin = res
      })
    },

    // async removeProShopEquipment(equippedToken, playerId) {
    //         //console.log(equippedToken," ", playerId)
    //         await main.removeProShopEquipment(equippedToken, playerId).then(res => {
    //              this.sendPlayerData()
    //         })
    //         .catch(err => {
    //             //console.log("Error removing equipment: " + err)
    
    //         })
    //     },


        closeModal() {
            this.$emit('closePlayerPickerModal')
        },


    },
    computed: {



    },

    mounted: function(){
        this.sendPlayerData()
    }
}

</script>


<style scoped>
.player-modal{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width:80%;
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

.player-container{
  flex: 0 0 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.green-button{
   margin: 15px;
font-size: 23px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
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
width: 80%;
margin: 15px;
font-size: 40px;
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

.player-canvas{
    
  width:100%;
  border: solid 5px black;
  border-radius: 10px;
}

.play-select-card{
 background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 200px;
  /* height: 400px; */
  margin: 10px;
  margin-bottom: 35px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
}


</style>