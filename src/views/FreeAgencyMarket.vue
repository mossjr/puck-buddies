<template>
  <div class="player-market">
    <img src="../assets/img/player-marketplace.png" alt="player-marketplace">
  <div>
    <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingPlayers">
  </div>

  <div>
    <button class="action-button" @click="showMyPlayersButton()" v-if="showMyPlayers">Switch to Available Free Agents</button>
    <button class="action-button" @click="showMyPlayersButton()" v-if="!showMyPlayers">Switch to My Free Agents</button>
    <div class="control-group">
      <div>
       <input type="checkbox" id="active-players" value="active-players" v-model="checkedFilters"  @change="getMarketPlayers()">
       <label class="checkbox-label" for="active-players">Active Players</label>
    
      <input type="checkbox" id="retired-players" value="retired-players" v-model="checkedFilters"  @change="getMarketPlayers()">
      <label class="checkbox-label" for="retired-players">Retired Players</label>
      </div>
    </div>
    
  </div>

  <div class="player-container" v-if="!loadingPlayers">
    <div v-for="(player, index) in players" :key="index" :class="`playertype-${player.playertype}`">
     
       <div v-if="!showMyPlayers && !player.isMine">
          <div class="card"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp > currentTimetamp && checkedFilters.includes('active-players')">   
            
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="buyMarketPlayer('PB-BRB', index)" id="player-action-button" v-if="player.totalPrice <= myFunds">BUY FOR <br>{{ player.totalPrice }} BUDS</button>
            <button id="no-buy-button" v-if="player.totalPrice > myFunds">BUY FOR <br>{{ player.totalPrice }} BUDS</button>
          </div>
      </div>

      <div v-if="showMyPlayers && player.isMine">
          <div class="card"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp > currentTimetamp && checkedFilters.includes('active-players')"> 
            
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="cancelMarketSale('PB-BRB', player.itemId)" id="player-cancel-button">CANCEL SALE <br>({{ player.totalPrice }} BUDS)</button>
          </div>
      </div>

             <div v-if="!showMyPlayers && !player.isMine">
          <div class="card card-retired"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp <= currentTimetamp && checkedFilters.includes('retired-players')">   
            
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="buyMarketPlayer('PB-BRB', index)" id="player-action-button" v-if="player.totalPrice < myFunds">BUY FOR <br>{{ player.totalPrice }} BUDS</button>
          </div>
      </div>

      <div v-if="showMyPlayers && player.isMine">
          <div class="card card-retired"  v-if="index + 1 <= playersToShow && player.ageoutTimestamp <= currentTimetamp && checkedFilters.includes('retired-players')"> 
           
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="cancelMarketSale('PB-BRB', player.itemId)" id="player-cancel-button">CANCEL SALE <br>({{ player.totalPrice }} BUDS)</button>
          </div>
      </div>


    </div>
  </div>

  <div>
    <button class="load-more-button" @click="(loadPlayers) => { playersToShow = playersToShow + playersToShow, getMarketPlayers()}" v-if="playersToShow < totalFoundPlayers">Load More</button>
  </div>

  </div>
<div v-if="screenLocked">
  <LockModal  :splashImage="splashImage" />
</div> 
</template>

<script>
import main from '../main.js'
import buildCanvas from '../scripts/buildPlayer.js'
import LockModal from '../components/LockModal.vue'

export default ({
  components: {LockModal},
  data() {
    return{
      myAddress: '',
      myFunds: '',
      playersToShow: 12,
      totalFoundPlayers: 0,
      loadingPlayers: true,
      showMyPlayers: false,
      players: [],
      checkedFilters: ["active-players"],
      currentTimetamp: '',
      splashImage: '',
      screenLocked: false
    }
    
  },
  methods: {
    async showMyPlayersButton(){
      this.showMyPlayers = !this.showMyPlayers
      this.getMarketPlayers()
    },

    async getMarketPlayers(){
      this.getTimestamp()
      await this.getMyAddress()
      await main.getMarketPlayers().then(res => {     
        let playerIdArray = []
        for (let i = 0; i < res.length; i++) {
          let sellerAddress = res[i].seller
          if(res[i].valid == true){
            let isMine = false
            if(sellerAddress.toLowerCase() == ethereum.selectedAddress){
              isMine = true
            }
            playerIdArray.push({
            'playerId': res[i].tokenId,
            'itemId' : res[i].itemId,
            'valid' : res[i].valid,
            'seller': res[i].seller,
            'sellerPrice': res[i].sellerPrice,
            'marketFee': res[i].marketfee,
            'totalPrice': res[i].totalPrice,
            'owner': res[i].owner,
            'nftContract': res[i].nftContract,
            'isMine': isMine,
            
          })
          }
          //console.log("Found " + playerIdArray.length + " player Ids in the Market")
        }
        
        return playerIdArray
      })
      .then(async res =>  {
        
        //console.log("Canvas Array:")
        //console.log(this.players)
        //console.log("Found " + res.length + " Players in Market")
        //console.log(res)
        let playerData
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
            playerData = await main.getSinglePlayerData(res[i].playerId)
                //console.log("Data for player token " + playerData.ageoutTimestamp)
                //console.log(playerData.ageoutTimestamp) 
                  let sellerPriceFromWei = web3.utils.fromWei(res[i].sellerPrice)
                  let marketFeeFromWei = web3.utils.fromWei(res[i].marketFee)
                  let totalPriceFromWei = web3.utils.fromWei(res[i].totalPrice)
                  playerArray.push({
                    'id': playerData.id,
                    'offence': playerData.offence,  
                    'defence': playerData.defence, 
                    'dna': playerData.dna, 
                    'playertype' : playerData.playertype,
                    'isOffence' : isOff,
                    'isDefence' : isDef,
                    'isGoalie' : isGoal,
                    'itemId' : res[i].itemId,
                    'seller' : res[i].seller,
                    'sellerPrice' : sellerPriceFromWei,
                    'marketFee' : marketFeeFromWei,
                    'totalPrice' : totalPriceFromWei,
                    'position' : playerData.position,
                    'owner' :  res[i].owner,
                    'teamLetter' : "",
                    'equippedJersey' : playerData.equippedJersey,
                    'equippedStick' : playerData.equippedStick,
                    'equippedToken' : playerData.equippedToken,
                    'ageoutTimestamp':playerData.ageoutTimestamp,
                    'draftTimestamp': playerData.draftTimestamp,
                    'isMine': res[i].isMine
                  })
                  //console.log("Sellers Adress is: " + playerArray[i].seller)
              }
              this.totalFoundPlayers = playerArray.length;
              this.players = playerArray
              //console.log(playerArray)
              return {_playerArray: playerArray, _res: res} 
      })
      .then(res2 => {
        //console.log("Passing Data")
        //console.log(res2._playerArray)
         for (let i = 0; i < res2._playerArray.length; i++) {
          buildCanvas.preloadPlayerInfo(res2._playerArray[i].id, res2._playerArray[i], "market-no")
         }
        let res3 = res2
        return res3
      })
      .then(res3 => {
                 this.loadingPlayers = false
                 this.updateBalanceViewer()

                 //console.log("This is the Players:")
                 //console.log(this.players)
      })
      .catch((err) => {
        //console.log("Rendering Players in Market Error: " + err)
        //console.log(err)
        this.players = null
      })
    },

          async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
          this.myFunds = res
        })
      }, 

      async updateXpBalanceViewer(){
          await main.updateXPBalance().then(res => {
            document.getElementById('xp-balance').innerHTML = res
            this.myXp = res
          })
      },

      async buyMarketPlayer(_splashImage, index){
          this.splashImage = _splashImage
          this.screenLocked = true
          let _itemId = this.players[index].itemId
          let _sellPrice = this.players[index].sellerPrice
          let _fee = this.players[index].marketFee
          await main.buyMarketPlayer(_itemId,_sellPrice,_fee).then(res => {
            this.screenLocked = false
            this.getMarketPlayers()
          })
          .catch(err => {
            this.screenLocked = false
            //console.log("error buying MarketPlayer")
            //console.log(err)
          })
      },

      async cancelMarketSale(_splashImage, playerId){
        this.splashImage = _splashImage
        this.screenLocked = true
        //console.log("Cancelling Market Sale: " + playerId)
        await main.cancelMarketSale(playerId).then(res => {
          this.screenLocked = false
          this.getMarketPlayers()
        }).catch(err => {
               this.screenLocked = false
           })
      },

      async getMyAddress(){
        const web3 = await Moralis.Web3.enable()
        let myAdd = await web3.eth.getAccounts();
        this.myAddress = myAdd
        //console.log("Users Address: " + myAdd)
      },
      
      async getTimestamp(){
            let currentTime = Math.floor(Date.now() / 10 ** 3)
            this.currentTimetamp = currentTime
    },

  },

  mounted: function(){
    this.getMyAddress(),
    this.getMarketPlayers(),
    this.updateBalanceViewer(),
    this.updateXpBalanceViewer()
  }
})
</script>

<style scoped>
.player-container{
  display: flex;
  flex: 1;
  flex-direction: row;
  flex: 0 0 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.card {
  flex-grow: 12;
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  width: 200px;
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
}

.card-retired{

 border-color: rgb(102, 0, 94);
  
}

.player-canvas{
  border: solid 3px black;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.2);
  transition: 0.3s ease; 
}

#player-action-button{
  margin-top: 10px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

#no-buy-button{
    margin-top: 10px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(216, 64, 64);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
}

#player-action-button-selling{
  margin-top: 10px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(167, 221, 146);
  border-radius: 10px;
  font-weight: bold;
  cursor: default;
  outline: none;
}

#player-action-button-nofunds{
  margin-top: 10px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(216, 64, 64);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
  outline: none;
}

#player-action-button:hover{

  background: rgb(12, 185, 128);

  
}

#player-cancel-button{
  margin-top: 10px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(145, 11, 11);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  outline: none;
  
}

#player-cancel-button:hover{

  background: rgb(185, 12, 12);
  

  
}

.action-button{
    margin: 5px;
    width:300px;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
  
}

.checkbox-label{
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.1;
  
}

input[type="checkbox"] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: #fff;
  /* Not removed via appearance */
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.5em;
  height: 1.5em;
  border: 0.25em solid #fff;
  border-radius: 0.15em;
  transform: translateY(-0.01em);
  margin: 0 0.5em 0 2em;
}

input[type="checkbox"]:checked {

 
 
  background-color: rgb(11, 145, 100);

}


</style>
