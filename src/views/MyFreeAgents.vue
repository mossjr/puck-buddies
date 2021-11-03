<template>
  <div class="my-free-agents">

  <div>
  <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingPlayers">
  </div>

  <div class="container" v-if="!loadingPlayers">
    <div v-for="(player, index) in players" :key="index" :class="`playertype-${player.playertype}`">
     
       <div v-if="player.isOffence">
          <div class="card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="cancelMarketSale(player.itemId)" id="player-cancel-button">CANCEL SELLING FOR <br>{{ player.totalPrice }} BUDZ</button>
        </div>
      </div>

              <div v-if="player.isDefence">
          <div class="card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="cancelMarketSale(player.itemId)" id="player-cancel-button">CANCEL SELLING FOR <br>{{ player.totalPrice }} BUDZ</button>
        </div>
      </div>

              <div v-if="player.isGoalie">
          <div class="card"  v-if="index + 1 <= playersToShow">    
            <canvas class="player-canvas" :id="`canvas-market-no-${player.id}`">
            </canvas>
            <button @click="cancelMarketSale(player.itemId)" id="player-cancel-button">CANCEL SELLING FOR <br>{{ player.totalPrice }} BUDZ</button>
        </div>
      </div>

    </div>
  </div>

  <div>
    <button class="load-more-button" @click="(loadPlayers) => { playersToShow = playersToShow + playersToShow, getMarketPlayers()}" v-if="playersToShow < totalFoundPlayers">Load More</button>
  </div>

  </div>
</template>

<script>
import main from '../main.js'
import buildCanvas from '../scripts/buildPlayer.js'

export default ({
  data() {
    return{
      myAddress: '',
      playersToShow: 6,
      totalFoundPlayers: 0,
      loadingPlayers: false,
      players: []
    }
    
  },
  methods: {
    async getMyMarketItems(){
      this.loadingPlayers = true
      await main.getMarketPlayers().then(res => {
        console.log("Found " + res.length + " market items") 
        let playerIdArray = []
        for (let i = 0; i < res.length; i++) {
          if(res[i].seller == this.myAddress && res[i].valid == true ){
          playerIdArray.push({
            'playerId': res[i].tokenId,
            'itemId' : res[i].itemId,
            'seller': res[i].seller,
            'sellerPrice': res[i].sellerPrice,
            'marketFee': res[i].marketfee,
            'totalPrice': res[i].totalPrice,
            'owner': res[i].owner,
            'nftContract': res[i].nftContract 
          })
          }
          console.log("Found " + playerIdArray.length + "my player Ids in the Market")
        }
        
        return playerIdArray
      })
      .then(async res =>  {
  
        console.log("Canvas Array:")
        console.log(this.players)
        console.log("Found " + res.length + " of My Players in Market")
        console.log(res)
        let playerData
        let playerArray = []
        for (let i = 0; i < res.length; i++) {
            playerData = await main.getSinglePlayerData(res[i].playerId)
                console.log("Data for player token " + playerData.id)
                console.log(playerData) 
                  let sellerPriceFromWei = web3.utils.fromWei(res[i].sellerPrice)
                  let marketFeeFromWei = web3.utils.fromWei(res[i].marketFee)
                  let totalPriceFromWei = web3.utils.fromWei(res[i].totalPrice)
                  playerArray.push({
                    'id': playerData.id,
                    'nftcontract' : playerData.nftcontract, 
                    'offence': playerData.offence,  
                    'defence': playerData.defence, 
                    'dna': playerData.dna, 
                    'playertype' : playerData.playertype,
                    'isOffence' : playerData.isOffence,
                    'isDefence' : playerData.isDefence,
                    'isGoalie' : playerData.isGoalie,
                    'itemId' : res[i].itemId,
                    'seller' : res[i].seller,
                    'sellerPrice' : sellerPriceFromWei,
                    'marketFee' : marketFeeFromWei,
                    'totalPrice' : totalPriceFromWei,
                    'owner' : res[i].owner
                  })
              }
              this.totalFoundPlayers = playerArray.length;
              this.players = playerArray
              return {_playerArray: playerArray, _res: res} 
      })
      .then(res2 => {
        console.log("Passing Data")
        console.log(res2._playerArray)
         for (let i = 0; i < res2._playerArray.length; i++) {
          buildCanvas.preloadPlayerInfo(res2._playerArray[i].id, res2._playerArray[i], "market-no")
         }
        let res3 = res2
        return res3
      })
      .then(res3 => {
                 this.loadingPlayers = false
                 this.updateBalanceViewer()

                 console.log("This is the Players:")
                 console.log(this.players)
      })
      .catch((err) => {
        console.log("Rendering Players in Market Error: " + err)
        this.players = null
        this.loadingPlayers = false
      })
    },

          async updateBalanceViewer(){
          await main.updateCoinBalance().then(res => {
          document.getElementById('coin-balance').innerHTML = res
        })
      }, 

        async getMyAddress(){
        const web3 = await Moralis.Web3.enable()
        let myAdd = await web3.eth.getAccounts();
        this.myAddress = myAdd
        console.log("Users Address: " + myAdd)
      },

      async cancelMarketSale(_playerId){
        console.log("Cancelling Market Sale: " + _playerId)
        await main.cancelMarketSale(_playerId).then(res => {
          this.getMyMarketItems()
        })
      }

  },

  mounted: function(){
    this.getMyAddress(),
    this.players = [],
    this.getMyMarketItems(),
    this.updateBalanceViewer()
  }
})
</script>

<style scoped>
.container{
  flex: 0 0 100%;
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
}

.player-canvas{
  border: solid 3px black;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.2);
  transition: 0.3s ease; 
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
</style>
