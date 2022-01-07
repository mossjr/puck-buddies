<template>

<div class="myplayers">
<img src="../assets/img/my-players.png" alt="my-players">
  
<!-- <h1>My Players: ({{ totalFoundPlayers }} found)</h1> -->
<div class="button-bar">
  <button class="ret-button" @click="showRetiredPlayers()" v-if="!showRetired">Show Retired Players</button>
  <button class="ret-button" @click="showRetiredPlayers()" v-if="showRetired">Show Active Players</button>
</div>
<div class="button-bar">
  <button  @click="mintNewOffence('PB-BRB')" v-if="!noFunds">Draft Offence for <br> {{ costToDraft1 }} BUDS</button>
  <button  @click="mintNewDefence('PB-BRB')" v-if="!noFunds">Draft Defence for <br>{{ costToDraft2 }} BUDS</button>
  <button  @click="mintNewGoalie('PB-BRB')" v-if="!noFunds">Draft Goalie for <br>{{ costToDraft3 }} BUDS</button>
</div>

<!-- <div class="button-bar" v-if="totalFoundPlayers == 0">
  <button v-if="!noFunds">Draft Team for <br> {{ costToDraft4 }} BUDZ</button>
</div> -->

<!-- <button @click="testFunction()"> TEST</button> -->

<!-- <button v-on:click="adminShow = !adminShow" v-if="isPBPAdmin || isMarketAdmin">Admin</button> -->

<div class="admin-area" v-if="adminShow">
<div class="warning" v-if="marketfeepayableaddress == 0x0000000000000000000000000000000000000000 && isMarketAdmin">WARNING: NO MARKET FEE PAYABLE ADDRESS SET</div>
<div class="warning" v-if="marketplaceAddress == 0x0000000000000000000000000000000000000000 && isPBPAdmin">WARNING: NO MARKETPLACE ADDRESS SET, DO NOT MINT</div>
        <div class="admin-pbp-buttons" v-if="isPBPAdmin">
          <form @submit.prevent="updateDraftPrice()">
          <label>New Draft Price - </label>
          <input type="text" required v-model="newDraft">
          <button>Update Draft Price to {{ newDraft }}</button>
          <p>Current Draft Price: <b>{{costToDraft1}} BUDS</b></p>
          </form>
        </div>

        <div class="admin-pbp-buttons" v-if="isPBPAdmin">
          <button @click="updateMarketplaceAddress()">Update PBP Addresses</button>
        </div>

        <div class="admin-market-buttons" v-if="isMarketAdmin">
          <form @submit.prevent="updateMarketFeePercent()">
          <label>New Market Fee Percent - </label>
          <input type="text" required v-model="newMarketFeePercent">
          <button>Update Market Fee Percent to {{ newMarketFeePercent }}</button>
          <p>Current Market Listing Fee: <b>{{marketFeePercent}}%</b></p>
          </form>
        </div>

         <div class="admin-market-buttons" v-if="isMarketAdmin">
          <form @submit.prevent="updateFeePayableAddress()">
          <label>New Market Fee Payable Address - </label>
          <input type="text" required v-model="newmarketfeepaybleaddress">
          <button>Update Market Fee Payable Address to {{ newmarketfeepaybleaddress }}</button>
          <p>Current Market Listing Fee Payable Address: <b>{{marketfeepayableaddress}}</b></p>
          </form>
        </div>

        <div class="admin-market-buttons" v-if="isMarketAdmin">
          <div>
            <label> DNA :</label>
            <input type="text" v-model="superStarDnaInput">
          </div>
         <div>
            <label> OP :</label>
            <input type="text" v-model="superStarOpInput">
         </div>
         <div>
           <label> DP :</label>
           <input type="text" v-model="superStarDpInput">
         </div>
         <div>
           <label> PT(1,2,3) :</label>
           <input type="text" v-model="superStarPtInput">
         </div>
          
          
        
          <button @click="previewSuperStar(superStarDnaInput,superStarOpInput,superStarDpInput,superStarPtInput)">Preview Superstar</button>
          <button @click="mintSuperStar(superStarOpInput, superStarDpInput, superStarDnaInput, superStarPtInput)">Mint Superstar</button>
          <div>
<canvas class="player-canvas-preview" :id="`canvas-player-preview-no-999999999`"></canvas>  
          </div>
          

        </div>

</div>

<div class="loading-icon-container">
  <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingPlayers && totalFoundPlayers > 0 ">
</div>

<div class="player-container" v-if="!loadingPlayers">
  <div v-for="(player, index) in players" :key="index" :class="`playertype-${player.playertype}`">
    <div v-if="!showRetired">
        <div v-if="player.isOffence && player.id !=0 && player.ageoutTimestamp > currentTimetamp">
          <div class="card" v-if="index + 1 <= playersToShow">
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>

      <div v-if="player.isDefence">
          <div class="card"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp > currentTimetamp">
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>

      <div v-if="player.isGoalie">
          <div class="card"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp > currentTimetamp">
            <canvas  class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>
    </div>
    <!--Retired Players-->
    <div v-if="showRetired">
          <div v-if="player.isOffence && player.id !=0 && player.ageoutTimestamp < currentTimetamp">
          <div class="card card-retired" v-if="index + 1 <= playersToShow">
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openRetiredModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>

      <div v-if="player.isDefence">
          <div class="card card-retired"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp < currentTimetamp">
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openRetiredModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>

      <div v-if="player.isGoalie">
          <div class="card card-retired"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp < currentTimetamp">
            <canvas class="player-canvas" :id="`canvas-player-no-${player.id}`">
            </canvas>
            <button @click="openRetiredModal(player.id, index)" id="player-action-button">Player Options</button>
        </div>
      </div>
    </div>
  

  </div>
</div>

  <div>
    <button class="load-more-button" @click="(loadPlayers) => { playersToShow = playersToShow + playersToShow, sendPlayerData()}" v-if="playersToShow < totalFoundPlayers">Load More</button>
  </div>
</div>
<div v-if="showPlayerModal"> 
<PlayerModal @closePlayerModal="closeModal" :selectedId="modalPlayer" :playerData="players[modalPlayerindex]" :defaultDraft="costToDraft1" />
</div>
<div v-if="showRetiredPlayerModal"> 
<RetiredPlayerModal @closeRetiredPlayerModal="closeRetiredModal" :selectedId="modalPlayer" :playerData="players[modalPlayerindex]" :defaultDraft="costToDraft1" />
</div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div>
</template>

<script>
import main from '../main.js'
import buildCanvas from '../scripts/buildPlayer.js'
import PlayerModal from '../components/PlayerModal.vue'
import RetiredPlayerModal from '../components/RetiredPlayerModal.vue'
import LockModal from '../components/LockModal.vue'

export default {
  components: { PlayerModal, RetiredPlayerModal, LockModal },
  data() {
    return{
    noFunds: true,
    adminShow: false,
    isPBPAdmin: false,
    isMarketAdmin: false,
    newDraft: '',
    newMarketFeePercent: '',
    marketFeePercent: '',
    marketfeepayableaddress:'',
    newmarketfeepaybleaddress:'',
    marketplaceAddress: '',
    newMarketplaceAddress:'',
    costToDraft1: '',
    costToDraft2: '',
    costToDraft3: '',
    costToDraft4: '',
    loadingPlayers: true,
    superStarDnaInput:'1163027814532489244084250415',
    superStarOpInput:'00',
    superStarDpInput:'00',
    superStarPtInput: '1',
    players: [],
    playersToShow: 36,
    totalFoundPlayers: 0,
    offencePlayersFound: 0,
    defencePlayersFound: 0,
    goaliesFound: 0,
    showPlayerModal: false,
    showRetiredPlayerModal: false,
    clickedPlayerData: '',
    modalPlayer: '',
    modalPlayerindex:'',
    currentTimetamp: '',
    showRetired: false,
    splashImage: '',
    screenLocked: false
    }
  },
  methods:{

    async testFunction(){
      
      //console.log( this.screenLocked)
    },

    async sendPlayerData() {
      this.getTimestamp()
      this.checkPBPlayerAdmin()
      Promise.all(await main.loadPBPlayers("My Players"))
      .then(res => {
        //console.log("Found " + res.length + " Players")
        //console.log(res)
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
              'isOnTeam' : res[i].isOnTeam,
              'teamLetter': res[i].teamLetter,
              'position' : res[i].position,
              'equippedJersey' : res[i].equippedJersey,
              'equippedToken' : res[i].equippedToken,
              'ageoutTimestamp': res[i].ageoutTimestamp,
              'draftTimestamp': res[i].draftTimestamp,
              'playercountry':res[i].playercountry,
              'playerAge':res[i].playerAge,
              }) 
        }
        //console.log(playerArray)
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

    async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          if(res > this.costToDraft1){
            this.noFunds = false;
          }else if(this.costToDraft1){
            this.noFunds = true;
          }
        })
    }, 
    
    async showRetiredPlayers(){
      this.showRetired = !this.showRetired
      //this.sendPlayerData()
    },
    
    async updateXpBalanceViewer(){
          await main.updateXPBalance().then(res => {
            document.getElementById('xp-balance').innerHTML = res
            this.myXp = res
          })
      },

    async getTimestamp(){
            let currentTime = Math.floor(Date.now() / 10 ** 3)
            this.currentTimetamp = currentTime
        },

    async mintNewOffence(_splashImage){
      this.splashImage = _splashImage
      this.screenLocked = true
      await main.mintNewOffence()
      this.sendPlayerData().then(res => {
        this.screenLocked = false
      }).catch(err => {
               this.screenLocked = false
           })
  },

    async mintNewDefence(_splashImage){
      this.splashImage = _splashImage
      this.screenLocked = true
      await main.mintNewDefence()
      this.sendPlayerData().then(res => {
        this.screenLocked = false
      }).catch(err => {
               this.screenLocked = false
           })
  },

    async mintNewGoalie(_splashImage){
      this.splashImage = _splashImage
      this.screenLocked = true
      await main.mintNewGoalie()
      this.sendPlayerData().then(res => {
        this.screenLocked = false
      }).catch(err => {
               this.screenLocked = false
           })
  },

  async mintNewTeamPlayers(){
    await main.mintTeamPlayers()
    this.sendPlayerData()
  },

    async openModal(id, index) {
        this.modalPlayer = id
        this.modalPlayerindex = index
        this.showPlayerModal = !this.showPlayerModal
        this.sendPlayerData()        
    },

    async closeModal() {
      this.clickedPlayerData = ''
      this.showPlayerModal = !this.showPlayerModal
      this.sendPlayerData()
      this.updateBalanceViewer()
      this.updateXpBalanceViewer() 
    },

    async openRetiredModal(id, index) {
        this.modalPlayer = id
        this.modalPlayerindex = index
        this.showRetiredPlayerModal = !this.showRetiredPlayerModal
        this.sendPlayerData()        
    },

    async closeRetiredModal() {
      this.clickedPlayerData = ''
      this.showRetiredPlayerModal = !this.showRetiredPlayerModal
      this.sendPlayerData()
      this.updateBalanceViewer()
      this.updateXpBalanceViewer() 
    },

    async getDraftPrice() {
      await main.getDraftPrice().then(res => {
        //console.log(res)
        this.costToDraft1 = res.dv1
        this.costToDraft2 = res.dv2
        this.costToDraft3 = res.dv3
      })
      //this.sendPlayerData()
    },

    async updateDraftPrice() {
      await main.updateDraftPrice(this.newDraft)
      await this.getDraftPrice()
      this.sendPlayerData()
    },

    async getMarketFeePercent(){
      await main.getMarketFeePercent().then(res => {
        this.marketFeePercent = res
      })
      //this.sendPlayerData()
    },

      async updateMarketFeePercent() {
      await main.updateMarketFeePercent(this.newMarketFeePercent)
      await this.getMarketFeePercent()
      //this.sendPlayerData()
    },

    async getFeePayableAddress(){
      await main.getMarketFeePayableAddress().then(res => {
        this.marketfeepayableaddress = res
      })
      //this.sendPlayerData()
    },

    async updateFeePayableAddress(){
      await main.updateFeePayableAddress(this.newmarketfeepaybleaddress)
      await this.getFeePayableAddress()
      //this.sendPlayerData()
    },

    async getMarketplaceAddress(){
      await main.getMarketplaceAddress().then(res => {
        this.marketplaceAddress = res
      })
      //this.sendPlayerData()
    },

    async updateMarketplaceAddress(){
      await main.updateMarketplaceAddress(this.newMarketplaceAddress)
      await this.getMarketplaceAddress()
      //this.sendPlayerData()
    },

    async checkPBPlayerAdmin() {
      await main.checkPBPlayerAdmin().then(res => {
        //console.log("Is PBP Admin: " + res)
        this.isPBPAdmin = res
      })
    },

        async checkMarketAdmin() {
      await main.checkMarketAdmin().then(res => {
        //console.log("Is Market Admin: " + res)
        this.isMarketAdmin = res
      })
    },

    async previewSuperStar(dna, op, dp, pt){
      let previewObject = {
          id: 999999999,
          offence: op,
          defence: dp,
          dna: dna,
          playertype: pt,
          isOffence: true,
          isDefence: false,
          isGoalie: false,
          teamId: "0",
          teamLetter: '',
          position:'0',
          jerseyId: '0',
          mainColor: '0',
          equippedJersey: '0',
          equippedStick: '0',
          equippedToken: '0',
          injuredTime: '0',
          injuryTimestamp: '0' 
      }
      await buildCanvas.preloadPlayerInfo(999999999, previewObject, "player-preview-no")
    },

    async mintSuperStar(superStarOpInput, superStarDpInput, superStarDnaInput, superStarPtInput){
      await main.mintSuperStar(superStarOpInput, superStarDpInput, superStarDnaInput, superStarPtInput)
      this.sendPlayerData()
    }

  },

  mounted: function(){
    this.checkPBPlayerAdmin()
    this.checkMarketAdmin()
    this.loadingPlayers = true
    this.getDraftPrice()
    this.getMarketFeePercent()
    this.getFeePayableAddress()
    this.getMarketplaceAddress()
    this.sendPlayerData()
    this.updateBalanceViewer()
    this.updateXpBalanceViewer()
    
  }
}

</script>

<style scoped>

.myplayers{
    align-items: center;
    justify-content: center;
    overflow: hidden;
    

}
.player-container{
  flex: 0 0 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.card {
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 300px;
  /* height: 400px; */
  margin: 20px;
  margin-bottom: 70px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
   border-style: solid;
 border-width: thick;
 border-color: rgb(8, 102, 0);
  
}

.card-retired{

 border-color: rgb(102, 0, 94);
  
}

.card:hover{
  box-shadow: 15px 15px 20px 0 rgba(0,0,0,0.5);
  margin-bottom: 0px;
  transform: scale(1.0);

}

.card:hover > #player-action-button{
  margin-top: 10px;
  visibility: visible;
  opacity: 1
  
}

.player-canvas{
  border: solid 3px black;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.2);
  transition: 0.3s ease; 
}


.player-canvas-preview{
  max-width: 300px;
    border: solid 3px black;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.2);
  transition: 0.3s ease; 
}


#player-action-button{
  z-index: -1;
  margin-top: -60px;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#player-action-button:hover{

  background: rgb(12, 185, 128);

  
}

.button-bar button{
margin: 15px;
font-size: 2.2em;
width: 300px;


color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease;
}



.button-bar button:hover{
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.ret-button{
  font-size: 0.8em !important;
}

.noFunds{
  background: rgb(99, 99, 99);
}

.load-more-button{
margin-bottom: 50px;
color: #fff;
background: rgb(11, 145, 100);
text-decoration: none;
padding: 10px;
border-radius: 10px;
border: none;
transition: 0.3s ease;
}

.load-more-button:hover{
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.admin-area{
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  align-items: center;
  justify-content: center;  
}

.admin-pbp-buttons {
  padding: 15px;
  margin: 10px;
  color: black;
  background: linear-gradient(100deg, #becec9, #6dd0e2);
  width: 60%;
  border-radius: 20px;
}

.admin-market-buttons {
  padding: 15px;
  margin: 10px;
  color: black;
  background: linear-gradient(100deg, #becec9, #e26dc9);
  width: 60%;
  border-radius: 20px;
}

.admin-market-buttons button {
  color: gray;
  background-color: honeydew;
  font-size: 1em;
}

.admin-pbp-buttons button {
  color: gray;
  background-color: honeydew;
  font-size: 1em;
}

.warning{
  background: red;
  color: #fff;
  width: 100%;
}
</style>