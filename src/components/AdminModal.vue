<template>
<div class="backdrop" @click.self="closeModal">
  
    <div v-if="statsContainer" class="admin-modal">
      <button @click="statsContainer = !statsContainer">Stats/Actions</button>
      <div  class="admin-container">
        <div class="admin"><h3>PvC Matchups</h3></div>
        <div class="admin-info-line"><b>PvC Matchup Address:</b> {{PvCAddress}}</div>
        <div class="admin-info-line"><b>PvC Matchup Difficulty Mod:</b> {{PvCDifficultyMod}}</div>
        <div class="admin-info-line"><b>PvC Matchup Buddies Rewards:</b> {{PvCBuddiesReward0}}, {{PvCBuddiesReward1}}, {{PvCBuddiesReward2}}</div>
        <div class="admin-info-line"><b>PvC Matchup Timeouts:</b> {{PvCto0}}, {{PvCto1}}, {{PvCto2}}</div>
        <div class="admin-info-line"><b>PvC Matchup PBXP Rewards:</b> {{PvCPBXPReward}}</div>
        <div class="admin-info-line"><b>Buddies on PvC Contract:</b> {{PvCBuddies}}</div>
        <div class="admin-info-line"><b>BNB on PvC Contract:</b> {{PvCBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Players</h3></div>
        <div class="admin-info-line"><b>Players Contract Address:</b> {{pbPlayersAddress}}</div>
        <div class="admin-info-line"><b>Player Minting Costs: </b> {{mintCost0}}, {{mintCost1}}, {{mintCost2}}</div>
        <div class="admin-info-line"><b>Ageout Seconds:</b> {{ageoutSeconds}}</div>
        <div class="admin-info-line"><b>Current Player ID:</b> {{playerNextId}}</div>
        <div class="admin-info-line"><b>Current Edition:</b> {{currentEdition}}</div>
        <div class="admin-info-line"><b>Buddies on Players Contract:</b> {{playerBuds}}</div>
        <div class="admin-info-line"><b>BNB on Players Contract:</b> {{playerBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Factory</h3></div>
        <div class="admin-info-line"><b>Proshop Factory Address:</b> {{pbProshopFactoryAddress}}</div>
        <div class="admin-info-line"><b>Proshop Items Created:</b> {{proshopItemsCreated}}</div>
        <div class="admin-info-line"><b>Proshop Factory Buddies:</b> {{pbProshopFactoryBuddies}}</div>
        <div class="admin-info-line"><b>Proshop Factory BNB:</b> {{pbProshopFactoryBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Holder</h3></div>
        <div class="admin-info-line"><b>Proshop Holder Address:</b> {{proshopHolderAddress}}</div>
        <div class="admin-info-line"><b>Proshop Holder Items Sold:</b> {{proshopItemsSold}}</div>
        <div class="admin-info-line"><b>BNB on Proshop Holder Contract:</b> {{proshopHolderBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Marketplace</h3></div>
        <div class="admin-info-line"><b>Proshop Marketplace Address:</b> {{proshopMarketplaceAddress}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Fee %:</b> {{proshopMarketplaceMarketFee}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Fee Address Buddies:</b> {{proshopFeesBuddiesBalance}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Total Items Created:</b> {{proshopMarketplaceTotalItems}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Total Items Completed:</b> {{proshopMarketplaceTotalComplete}}</div>
        <div class="admin-info-line"><b>Buddies on Proshop Marketplace Contract:</b> {{proshopMarketplaceBuddies}}</div>
        <div class="admin-info-line"><b>BNB on Proshop Marketplace Contract:</b> {{proshopMarketplaceBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Teams</h3></div>
        <div class="admin-info-line"><b>Teams Address:</b> {{pbTeamsAddress}}</div>
        <div class="admin-info-line"><b>Teams Minting Cost:</b> {{pbTeamsMintCost}}</div>
        <div class="admin-info-line"><b>Teams Count:</b> {{pbTeamsCount}}</div>
        <div class="admin-info-line"><b>Buddies on Teams Contract:</b> {{teamsBuddies}}</div>
        <div class="admin-info-line"><b>BNB on Teams Contract:</b> {{teamsBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>PBXP</h3></div>
        <div class="admin-info-line"><b>PBXP Address:</b> {{pbPBXPAddress}}</div>
        <div class="admin-info-line"><b>PBXP Upgrade Cost:</b> {{pbPBXPUpgradeCost}}</div>
        <div class="admin-info-line"><b>Buddies on Teams Contract:</b> {{pbxpBuddies}}</div>
        <div class="admin-info-line"><b>BNB on Teams Contract:</b> {{pbxpBNB}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>ICO</h3></div>
        <div class="admin-info-line"><b>ICO Address:</b> {{icoContractAddress}}</div>
        <div class="admin-info-line"><b>ICO Buds per BNB</b> {{icoBuddiesPerBNB}}</div>
        <div class="admin-info-line"><b>ICO Buds Sold</b> {{icoBudsSold}}</div>
        <div class="admin-info-line"><b>Buddies on ICO Contract</b> {{icoBudsBalance}}</div>
        <div class="admin-info-line"><b>BNB on ICO Contract</b> {{icoBNBBalance}}</div>
      </div>
   
    </div>

    <div v-if="!statsContainer" class="admin-modal">
<button @click="statsContainer = !statsContainer">Stats/Actions</button>

          <div class="admin-container">
            <div class="admin"><h3>Update PvC Reward</h3></div>
            <div>
              <label>r0</label>
              <input type="text" v-model="r0">
            </div>
            <div>
              <label>r1</label>
              <input type="text" v-model="r1">
            </div>
            <div>
              <label>r2</label>
              <input type="text" v-model="r2">
            </div>
            <button @click="updateBuddiesReward()">Apply</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Update PvC Timeouts</h3></div>
            <div>
              <label>to0</label>
              <input type="text" v-model="to0">
            </div>
            <div>
              <label>to1</label>
              <input type="text" v-model="to1">
            </div>
            <div>
              <label>to2</label>
              <input type="text" v-model="to2">
            </div>
            <button @click="updateTimesOut()">Apply</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Update PvC XP Reward</h3></div>
            <div>
              <label>xpr</label>
              <input type="text" v-model="xpr">
            </div>
            <button @click="updatePBXPReward()">Apply</button>
        </div>
    
        <div class="admin-container">
            <div class="admin"><h3>Update Player Mint/Ageout</h3></div>
            <div>
              <label>m1</label>
              <input type="text" v-model="m1">
            </div>
            <div>
              <label>m2</label>
              <input type="text" v-model="m2">
            </div>
            <div>
              <label>m3</label>
              <input type="text" v-model="m3">
            </div>
            <div>
              <label>Ageout Seconds</label>
              <input type="text" v-model="aoSeconds">
            </div>
            <button @click="updateVariables()">Apply</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Update Team Minting Cost</h3></div>
            <div>
              <label>tmc</label>
              <input type="text" v-model="tmc">
            </div>
            <button @click="updateTeamMintCost()">Apply</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Transfer PB Players BUDS</h3></div>
            <div>
              <label>Amount: </label>
              <input type="text" v-model="pbPlayersAmount">
            </div>
            <button @click="transferPBPlayersBUDS()">Transfer</button>
        </div>

         <div class="admin-container">
            <div class="admin"><h3>Update ICO Details</h3></div>
            <div>
              <label>buds per bnb</label>
              <input type="text" v-model="icorate">
            </div>
            <button @click="updateBudsPerBNB()">Apply</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Transfer ICO BUDS</h3></div>
            <div>
              <label>Address: </label>
              <input type="text" v-model="BUDSAddress">
               <br>
              <label>Amount: </label>
              <input type="text" v-model="BUDSAmount">
            </div>
            <button @click="transferBUDS()">Transfer</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Transfer ICO BNB</h3></div>
            <div>
              <label>Address: </label>
              <input type="text" v-model="BNBAddress">
               <br>
              <label>Amount: </label>
              <input type="text" v-model="BNBAmount">
            </div>
            <button @click="transferBNB()">Transfer</button>
        </div>

        <div class="admin-container">
            <div class="admin"><h3>Update Validator</h3></div>
            <div>
              <label>w</label>
              <input type="text" v-model="w">
              <br>
              <label>l</label>
              <input type="text" v-model="l">
            </div>
            <button @click="updateValidator()">Apply</button>
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
            PvCBuddies:'',
            PvCBNB:'',

            pbPlayersAddress:'',
            mintCost0:'',
            mintCost1:'',
            mintCost2:'',
            ageoutSeconds:'',
            playerNextId:'',
            playerBuds:'',
            playerBNB:'',
            currentEdition:'',


            pbProshopFactoryAddress:'',
            proshopItemsCreated:'',
            pbProshopFactoryBuddies:'',
            pbProshopFactoryBNB:'',

            proshopHolderAddress:'',
            proshopItemsSold:'',
            proshopHolderBNB:'',

            proshopMarketplaceAddress:'',
            proshopMarketplaceMarketFee:'',
            proshopMarketplaceFeesAddress:'',
            proshopFeesBuddiesBalance:'',
            proshopMarketplaceTotalItems:'',
            proshopMarketplaceTotalComplete:'',
            proshopMarketplaceBNB:'',
            proshopMarketplaceBuddies:'',

            pbTeamsAddress:'',
            pbTeamsMintCost:'',
            pbTeamsCount:'',
            teamsBuddies:'',
            teamsBNB:'',

            pbPBXPAddress:'',
            pbPBXPUpgradeCost:'',
            pbxpBuddies:'',
            pbxpBNB:'',

            icoContractAddress:'',
            icoBuddiesPerBNB:'',
            icoBudsSold:'',
            icoBudsBalance:'',
            icoBNBBalance:'',

            BUDSAddress:'',
            BUDSAmount:0,
            BNBAddress:'',
            BNBAmount:0,
            pbPlayersAmount:0,
            pbPlayersAmountBNB:0,

            PvCto0:'',
            PvCto1:'',
            PvCto2:'',

            to0:'',
            to1:'',
            to2:'',

            m1:'',
            m2:'',
            m3:'',
            aoSeconds:'',

            r0:'',
            r1:'',
            r2:'',

            xpr:'',

            tmc:'',

            icorate:'',

            w:'',
            l:'',

            statsContainer: true,
            splashImage: '',
            screenLocked: false
        }
    },

    methods: {

  
    async getPvCadminInfo() {
      await main.getPvCadminInfo().then(res => {
        //console.log(res)
        this.PvCAddress = res.PvCAddress
        this.PvCBuddiesReward0 = res.PvCBuddiesReward0
        this.r0 = res.PvCBuddiesReward0
        this.PvCBuddiesReward1 = res.PvCBuddiesReward1
        this.r1 = res.PvCBuddiesReward1
        this.PvCBuddiesReward2 = res.PvCBuddiesReward2
        this.r2 = res.PvCBuddiesReward2
        this.PvCto0 = res.PvCto0
        this.to0 = res.PvCto0
        this.PvCto1 = res.PvCto1
        this.to1 = res.PvCto1
        this.PvCto2 = res.PvCto2
        this.to2 = res.PvCto2
        this.PvCDifficultyMod = res.PvCDifficultyMod
        this.PvCPBXPReward = res.PvCPBXPReward
        this.xpr = res.PvCPBXPReward
        this.PvCBuddies = res.PvCBuddies
        this.PvCBNB = res.PvCBNB
        this.pbPlayersAddress = res.pbPlayersAddress
        this.mintCost0 = res.mintCost0
        this.m1 = res.mintCost0
        this.mintCost1 = res.mintCost1
        this.m2 = res.mintCost1
        this.mintCost2 = res.mintCost2
        this.m3 = res.mintCost2
        this.ageoutSeconds = res.ageoutSeconds
        this.aoSeconds = res.ageoutSeconds
        this.playerNextId = res.playerNextId
        this.pbProshopFactoryAddress = res.pbProshopFactoryAddress
        this.proshopItemsCreated = res.proshopItemsCreated
        this.pbProshopFactoryBNB = res.pbProshopFactoryBNB
        this.pbProshopFactoryBuddies = res.pbProshopFactoryBuddies
        this.proshopHolderAddress = res.proshopHolderAddress
        this.proshopHolderBNB = res.proshopHolderBNB
        this.proshopItemsSold = res.proshopItemsSold
        this.proshopMarketplaceAddress = res.proshopMarketplaceAddress
        this.proshopMarketplaceMarketFee = res.proshopMarketplaceMarketFee
        this.proshopMarketplaceFeesAddress = res.proshopMarketplaceFeesAddress
        this.proshopFeesBuddiesBalance = res.proshopFeesBuddiesBalance
        this.proshopMarketplaceTotalItems = res.proshopMarketplaceTotalItems
        this.proshopMarketplaceTotalComplete = res.proshopMarketplaceTotalComplete
        this.proshopMarketplaceBNB = res.proshopMarketplaceBNB
        this.proshopMarketplaceBuddies = res.proshopMarketplaceBuddies
        this.pbTeamsAddress = res.pbTeamsAddress
        this.pbTeamsMintCost = res.pbTeamsMintCost
        this.tmc = res.pbTeamsMintCost
        this.pbTeamsCount = res.pbTeamsCount
        this.teamsBuddies = res.teamsBuddies
        this.teamsBNB = res.teamsBNB
        this.pbPBXPAddress = res.pbPBXPAddress
        this.pbPBXPUpgradeCost = res.pbPBXPUpgradeCost
        this.pbxpBuddies = res.pbxpBuddies
        this.pbxpBNB = res.pbxpBNB
        this.icoContractAddress = res.icoContractAddress
        this.icoBuddiesPerBNB = res.icoBuddiesPerBNB
        this.icorate = res.icoBuddiesPerBNB
        this.icoBudsSold = res.icoBudsSold
        this.icoBudsBalance = res.icoBudsBalance
        this.icoBNBBalance = res.icoBNBBalance
        this.BUDSAmount = res.icoBudsBalance
        this.BNBAmount = res.icoBNBBalance
        this.playerBuds = res.playerBuds
        this.pbPlayersAmount = res.playerBuds
        this.playerBNB = res.playerBNB
        this.pbPlayersAmountBNB = res.playerBNB
        this.currentEdition = res.currentEdition


      })
    },

    async updateVariables(){
      await main.updateVariables(this.m1, this.m2, this.m3, this.aoSeconds).then(res =>{
        //console.log(res)
      }).catch(err => {
        //console.log(err)
      })
    },

    async updateBuddiesReward(){
      await main.updateBuddiesReward(this.r0, this.r1, this.r2).then(res =>{
        //console.log(res)
      }).catch(err => {
        //console.log(err)
      })
    },

    async updatePBXPReward(){
      await main.updatePBXPReward(this.xpr).then(res => {
        //console.log(res)
      }).catch(err => {
        //console.log(err)
      })
    },

    async updateTimesOut(){
      await main.updateTimesOut(this.to0, this.to1, this.to2).then(res => {
        //console.log(res)
      }).catch(err =>{
        //console.log(err)
      })
    },

  async updateTeamMintCost(){
      await main.updateTeamMintCost(this.tmc).then(res => {
        //console.log(res)
      }).catch(err =>{
        //console.log(err)
      })
    },

    async updateBudsPerBNB(){
      await main.updateBudsPerBNB(this.icorate).then(res => {
        //console.log(res)
      }).catch(err =>{
        //console.log(err)
      })
    },
    
    async transferBUDS(){
      await main.transferBUDS(this.BUDSAddress, this.BUDSAmount).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
      })
    },

    async transferBNB(){
      await main.transferBNB(this.BNBAddress, this.BNBAmount).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
      })
    },

  async transferPBPlayersBUDS(){
      await main.transferPBPlayersBUDS(this.pbPlayersAmount).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
      })
    }, 

    async updateValidator(){
      await main.updateValidator(this.w, this.l).then(res => {
        //console.log(res)
      }).catch(err =>{
        //console.log(err)
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
    z-index: 9999999;
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