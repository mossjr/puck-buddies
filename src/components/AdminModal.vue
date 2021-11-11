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
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Players</h3></div>
        <div class="admin-info-line"><b>Players Contract Address:</b> {{pbPlayersAddress}}</div>
        <div class="admin-info-line"><b>Player Minting Costs: </b> {{mintCost0}}, {{mintCost1}}, {{mintCost2}}</div>
        <div class="admin-info-line"><b>Ageout Seconds:</b> {{ageoutSeconds}}</div>
        <div class="admin-info-line"><b>Current Player ID:</b> {{playerNextId}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Factory</h3></div>
        <div class="admin-info-line"><b>Proshop Factory Address:</b> {{pbProshopFactoryAddress}}</div>
        <div class="admin-info-line"><b>Proshop Items Created:</b> {{proshopItemsCreated}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Holder</h3></div>
        <div class="admin-info-line"><b>Proshop Holder Address:</b> {{proshopHolderAddress}}</div>
        <div class="admin-info-line"><b>Proshop Holder Items Sold:</b> {{proshopItemsSold}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Proshop Marketplace</h3></div>
        <div class="admin-info-line"><b>Proshop Marketplace Address:</b> {{proshopMarketplaceAddress}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Fee %:</b> {{proshopMarketplaceMarketFee}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Fee Address Buddies:</b> {{proshopFeesBuddiesBalance}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Total Items Created:</b> {{proshopMarketplaceTotalItems}}</div>
        <div class="admin-info-line"><b>Proshop Marketplace Total Items Completed:</b> {{proshopMarketplaceTotalComplete}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>Teams</h3></div>
        <div class="admin-info-line"><b>Teams Address:</b> {{pbTeamsAddress}}</div>
        <div class="admin-info-line"><b>Teams Minting Cost:</b> {{pbTeamsMintCost}}</div>
        <div class="admin-info-line"><b>Teams Count:</b> {{pbTeamsCount}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>PBXP</h3></div>
        <div class="admin-info-line"><b>PBXP Address:</b> {{pbPBXPAddress}}</div>
        <div class="admin-info-line"><b>PBXP Upgrade Cost:</b> {{pbPBXPUpgradeCost}}</div>
      </div>

      <div class="admin-container">
        <div class="admin"><h3>ICO</h3></div>
        <div class="admin-info-line"><b>ICO Address:</b> {{icoContractAddress}}</div>
        <div class="admin-info-line"><b>ICO Buds per BNB</b> {{icoBuddiesPerBNB}}</div>
        <div class="admin-info-line"><b>ICO Buds Sold</b> {{icoBudsSold}}</div>
        <div class="admin-info-line"><b>ICO Buds on Contract</b> {{icoBudsBalance}}</div>
        <div class="admin-info-line"><b>ICO BNB on Contract</b> {{icoBNBBalance}}</div>
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
            <div class="admin"><h3>Update ICO Details</h3></div>
            <div>
              <label>buds per bnb</label>
              <input type="text" v-model="icorate">
            </div>
            <button @click="updateBudsPerBNB()">Apply</button>
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

            pbPlayersAddress:'',
            mintCost0:'',
            mintCost1:'',
            mintCost2:'',
            ageoutSeconds:'',
            playerNextId:'',

            pbProshopFactoryAddress:'',
            proshopItemsCreated:'',

            proshopHolderAddress:'',
            proshopItemsSold:'',

            proshopMarketplaceAddress:'',
            proshopMarketplaceMarketFee:'',
            proshopMarketplaceFeesAddress:'',
            proshopFeesBuddiesBalance:'',
            proshopMarketplaceTotalItems:'',
            proshopMarketplaceTotalComplete:'',

            pbTeamsAddress:'',
            pbTeamsMintCost:'',
            pbTeamsCount:'',

            pbPBXPAddress:'',
            pbPBXPUpgradeCost:'',

            icoContractAddress:'',
            icoBuddiesPerBNB:'',
            icoBudsSold:'',
            icoBudsBalance:'',
            icoBNBBalance:'',

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

            statsContainer: true,
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
        this.proshopHolderAddress = res.proshopHolderAddress
        this.proshopItemsSold = res.proshopItemsSold
        this.proshopMarketplaceAddress = res.proshopMarketplaceAddress
        this.proshopMarketplaceMarketFee = res.proshopMarketplaceMarketFee
        this.proshopMarketplaceFeesAddress = res.proshopMarketplaceFeesAddress
        this.proshopFeesBuddiesBalance = res.proshopFeesBuddiesBalance
        this.proshopMarketplaceTotalItems = res.proshopMarketplaceTotalItems
        this.proshopMarketplaceTotalComplete = res.proshopMarketplaceTotalComplete
        this.pbTeamsAddress = res.pbTeamsAddress
        this.pbTeamsMintCost = res.pbTeamsMintCost
        this.tmc = res.pbTeamsMintCost
        this.pbTeamsCount = res.pbTeamsCount
        this.pbPBXPAddress = res.pbPBXPAddress
        this.pbPBXPUpgradeCost = res.pbPBXPUpgradeCost
        this.icoContractAddress = res.icoContractAddress
        this.icoBuddiesPerBNB = res.icoBuddiesPerBNB
        this.icorate = res.icoBuddiesPerBNB
        this.icoBudsSold = res.icoBudsSold
        this.icoBudsBalance = res.icoBudsBalance
        this.icoBNBBalance = res.icoBNBBalance


      })
    },

    async updateVariables(){
      await main.updateVariables(this.m1, this.m2, this.m3, this.aoSeconds).then(res =>{
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

    async updateBuddiesReward(){
      await main.updateBuddiesReward(this.r0, this.r1, this.r2).then(res =>{
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

    async updatePBXPReward(){
      await main.updatePBXPReward(this.xpr).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },

    async updateTimesOut(){
      await main.updateTimesOut(this.to0, this.to1, this.to2).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
      })
    },

  async updateTeamMintCost(){
      await main.updateTeamMintCost(this.tmc).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
      })
    },

    async updateBudsPerBNB(){
      await main.updateBudsPerBNB(this.icorate).then(res => {
        console.log(res)
      }).catch(err =>{
        console.log(err)
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