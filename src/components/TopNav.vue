<template>
<div class="nav-bar">
  <nav id="nav">
    <router-link class="mystuff" :to="{ name: 'My Players'}">My Players</router-link>
    <router-link class="mystuff" :to="{ name: 'My Team'}">My Team</router-link>
    <router-link class="mystuff" :to="{ name: 'My Equipment'}">My Equipment</router-link>
    <router-link class="proshop" :to="{ name: 'Pro Shop'}">Pro Shop</router-link>
    <router-link class="marketplace" :to="{ name: 'Player Marketplace'}">Player Marketplace</router-link>
    <router-link class="marketplace" :to="{ name: 'Equipment Marketplace'}">Equipment Marketplace</router-link>    
    <button id="disconnect-button">Disconnect</button>
    <div>

      
      <!-- <div>
           <button @click="runAdmin()">Admin Update</button>
      </div>
      <div>
        <input type="text" v-model="approveAddress">
        <input type="text" v-model="valueToApprove">
        <button @click="approveBuddyCoinSpend(approveAddress, valueToApprove)">Approve Buddy Spend</button>
      </div>
      <div>
        <input type="text" v-model="addressToCheckAllowance">
        <button @click="checkBuddiesAllowance(addressToCheckAllowance)">Check Buddy Allowance (Currently: {{approvedAmount}})</button>
      </div>
      <div>
        <input type="text" v-model="xpToMint">
        <button @click="newPBXPtoTeamContract(xpToMint)">Mint XP to Team Contract</button>
        <button @click="checkXPBalanceonTeamContract()">PBXP on Team Contract: {{xpBalanceOnTeamContract}}</button>
      </div> -->
    </div>
 


    <div class="coin-container">
        <div class="team-name-stats-container">
          <div v-for="(team, index) in teams" :key="index">
            <div class="tnsc-team-stats-container">
              <div class="tnsc-team-name">The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i></div>
              <!-- <div class="tnsc-team-stat">OP:<br>{{team.opTotal}}</div>
              <div class="tnsc-team-stat"> DP:<br>{{team.dpTotal}}</div> -->
            </div>
          </div>
        </div>
      
        <div class="coinbalancecard">
          
            <div class="buddies-coin"><img @click="addBuddiesToMetaMask()" src="../assets/img/buddies-coin-icon.png" style="width:50px;height:50px" alt="buddies-coin"></div><div id="coin-balance"></div>
        </div>
          <div class="coinbalancecard">
            
            <div><img src="../assets/img/pbxp-icon.png" style="width:50px;height:50px" alt="buddies-coin"></div><div id="xp-balance"></div>
            
        </div>
        <div><img @click="showIcoModal()" class="ico-live-now-sm" src="../assets/img/ico-live-now-sm.png" alt=""></div>
        
       
    </div> 
    <div>
          <button @click="copyToClip()" class="token-address" id="budsAddress">{{budsAddress}}</button>
    </div>
    <div v-if="isAdmin"><button @click="showAdminModal()" class="admin-button">ADMIN</button></div> 
   
  </nav>

</div>
<div v-if="icoModalVisible">
    <icomodal @closeIcoModal="closeIcoModal"  />
</div>

<div v-if="adminmodalVisble && isAdmin">
    <adminmodal @closeIcoModal="closeIcoModal"  />
</div>

</template>

<script>
import main from '../main.js'
import icomodal from '../components/ICOModal.vue'
import adminmodal from '../components/AdminModal.vue'
export default{
    components: { icomodal, adminmodal },
  data(){
    return{
      teams: [],
      players: [],
      cityNames: [],
      nouns: [],
      teamDna: '',
      approveAddress:'',
      valueToApprove:'',
      addressToCheckAllowance:'',
      approvedAmount:0,
      xpToMint:1000000,
      xpBalanceOnTeamContract:'',
      budsAddress:'',
      icoModalVisible:false,
      adminmodalVisble:false,
      isAdmin:false
    }
  },
  methods:{

      async displayTeam(playerArray){
      Promise.all(await main.displayTeam())
      .then(res => {
        let teamArray = []
        for (let i = 0; i < res.length; i++){
          
          let indexPlayer1 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "1")
          let indexPlayer2 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "2")
          let indexPlayer3 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "3")
          let indexPlayer4 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "4")
          let indexPlayer5 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "5")
          let indexPlayer6 = playerArray.findIndex(e => e.teamId === res[i].teamId && e.position === "6")
          let pos1id
          let pos1OP
          let pos1DP
          let pos2id
          let pos2OP
          let pos2DP
          let pos3id
          let pos3OP
          let pos3DP
          let pos4id
          let pos4OP
          let pos4DP
          let pos5id
          let pos5OP
          let pos5DP
          let pos6id
          let pos6OP
          let pos6DP
          let currentTime = Math.floor(Date.now() / 10 ** 3)
          let pos1ret = false
          let pos2ret = false
          let pos3ret = false
          let pos4ret = false
          let pos5ret = false
          let pos6ret = false
          if (indexPlayer1 >= 0){
            if(playerArray[indexPlayer1].ageoutTimestamp > currentTime){pos1ret = false} else {pos1ret = true}
          }
          if (indexPlayer2 >= 0){
            if(playerArray[indexPlayer2].ageoutTimestamp > currentTime){pos2ret = false} else {pos2ret = true}
          }
          if (indexPlayer3 >= 0){
           if(playerArray[indexPlayer3].ageoutTimestamp > currentTime){pos3ret = false} else {pos3ret = true}
          }
          if (indexPlayer4 >= 0){
           if(playerArray[indexPlayer4].ageoutTimestamp > currentTime){pos4ret = false} else {pos4ret = true}
          }
          if (indexPlayer5 >= 0){
           if(playerArray[indexPlayer5].ageoutTimestamp > currentTime){pos5ret = false} else {pos5ret = true}
          }
          if (indexPlayer6 >= 0){
           if(playerArray[indexPlayer6].ageoutTimestamp > currentTime){pos6ret = false} else {pos6ret = true}
          }
          let activePlayerCount = 0;
          
          if(pos1ret == false){activePlayerCount = activePlayerCount +1}
          if(pos2ret == false){activePlayerCount = activePlayerCount +1}
          if(pos3ret == false){activePlayerCount = activePlayerCount +1}
          if(pos4ret == false){activePlayerCount = activePlayerCount +1}
          if(pos5ret == false){activePlayerCount = activePlayerCount +1}
          if(pos6ret == false){activePlayerCount = activePlayerCount +1}
          if (indexPlayer1 >= 0){pos1id = playerArray[indexPlayer1].id} else {pos1id = ''}
          if (indexPlayer1 >= 0){pos1OP = playerArray[indexPlayer1].offence} else {pos1OP = ''}
          if (indexPlayer1 >= 0){pos1DP = playerArray[indexPlayer1].defence} else {pos1DP = ''}
          if (indexPlayer2 >= 0){pos2id = playerArray[indexPlayer2].id} else {pos2id = ''}
          if (indexPlayer2 >= 0){pos2OP = playerArray[indexPlayer2].offence} else {pos2OP = ''}
          if (indexPlayer2 >= 0){pos2DP = playerArray[indexPlayer2].defence} else {pos2DP = ''}
          if (indexPlayer3 >= 0){pos3id = playerArray[indexPlayer3].id} else {pos3id = ''}
          if (indexPlayer3 >= 0){pos3OP = playerArray[indexPlayer3].offence} else {pos3OP = ''}
          if (indexPlayer3 >= 0){pos3DP = playerArray[indexPlayer3].defence} else {pos3DP = ''}
          if (indexPlayer4 >= 0){pos4id = playerArray[indexPlayer4].id} else {pos4id = ''}
          if (indexPlayer4 >= 0){pos4OP = playerArray[indexPlayer4].offence} else {pos4OP = ''}
          if (indexPlayer4 >= 0){pos4DP = playerArray[indexPlayer4].defence} else {pos4DP = ''}
          if (indexPlayer5 >= 0){pos5id = playerArray[indexPlayer5].id} else {pos5id = ''}
          if (indexPlayer5 >= 0){pos5OP = playerArray[indexPlayer5].offence} else {pos5OP = ''}
          if (indexPlayer5 >= 0){pos5DP = playerArray[indexPlayer5].defence} else {pos5DP = ''}
          if (indexPlayer6 >= 0){pos6id = playerArray[indexPlayer6].id} else {pos6id = ''}
          if (indexPlayer6 >= 0){pos6OP = playerArray[indexPlayer6].offence} else {pos6OP = ''}
          if (indexPlayer6 >= 0){pos6DP = playerArray[indexPlayer6].defence} else {pos6DP = ''}

          let opTotal = Number(pos1OP) + Number(pos2OP) + Number(pos3OP) + Number(pos4OP) + Number(pos5OP) + Number(pos6OP)
          let dpTotal = Number(pos1DP) + Number(pos2DP) + Number(pos3DP) + Number(pos4DP) + Number(pos5DP) + Number(pos6DP)

          let teamCityStarter = parseInt(res[i].teamDna.slice(1,4))
          let teamCityNumber = Math.floor((teamCityStarter/1000) * 529)
          let teamNounNumber = parseInt(res[i].teamDna.slice(5,8))
          
          let teamName = this.nouns[teamNounNumber].noun
          let teamLetter = teamName.slice(0,1)        
          console.log(teamLetter)

          teamArray.push({
            'teamId': res[i].teamId,
            'teamDna': res[i].teamDna,
            'teamCityNumber': teamCityNumber,
            'teamNounNumber': teamNounNumber,
            'teamLetter': teamLetter,
            'timeActive': res[i].timeActive,
            'gamesPlayed': res[i].gamesPlayed,
            'equippedItem': res[i].equippedItem,
            'playerPos1': pos1id,
            'playerPos1OP': pos1OP,
            'playerPos1DP': pos1DP,
            'pos1ret':pos1ret,
            'playerPos2': pos2id,
            'playerPos2OP': pos2OP,
            'playerPos2DP': pos2DP,
            'pos2ret':pos2ret,
            'playerPos3': pos3id,
            'playerPos3OP': pos3OP,
            'playerPos3DP': pos3DP,
            'pos3ret':pos3ret,
            'playerPos4': pos4id,
            'playerPos4OP': pos4OP,
            'playerPos4DP': pos4DP,
            'pos4ret':pos4ret,
            'playerPos5': pos5id,
            'playerPos5OP': pos5OP,
            'playerPos5DP': pos5DP,
            'pos5ret':pos5ret,
            'playerPos6': pos6id,
            'playerPos6OP': pos6OP,
            'playerPos6DP': pos6DP,
            'pos6ret':pos6ret,
            'opTotal': opTotal,
            'dpTotal': dpTotal,
            'activePlayerCount': activePlayerCount
          })
        }
        
        this.loadingTeams = false
        return {teamArray: teamArray, players: playerArray }
      })
      .then(res2 => {
        let res = res2.teamArray
        // for (let i = 0; i < res2.players.length; i++){
        //  buildCanvas.preloadPlayerInfo(res2.players[i].id, res2.players[i], "player-no")
        // }
        console.log("Active Player Count: " + res)
        console.log(res)
        if(res2.teamArray[0].activePlayerCount == 6){
          this.sixActivePlayers = true
        }        
        this.totalTeamsFound = res.length
        this.teams = res
        this.playersLoaded = true
        // this.loadPvCmatches(res2.teamArray[0].teamId)
        this.pageTeamId = res2.teamArray[0].teamId
      })
      .catch((err) => {
        console.log("Error rendering Teams: " + err)
        console.log(err)
        this.totalTeamsFound = 0
        this.teams = null
        this.playersLoaded = true
      })
    },

    // async sendPlayerData() {
    //   this.totalFoundPlayers = 0
    //   this.offenceFound = 0
    //   this.defenceFound = 0
    //   this.goaliesFound = 0
    //   let playerArray = [] 
    //   Promise.all(await main.loadPBPlayers())
    //   .then(res => {
    //     console.log("Result: " + res)
    //     if (res.length == 0) {
    //       console.log("0 Players Found")
    //       this.totalFoundPlayers = 0
    //     }else{  
    //     for (let i = 0; i < res.length; i++) {
    //         console.log(res[i].ageoutTimestamp)
    //         playerArray.push({
    //           'id': res[i].id, 
    //           'offence': res[i].offence,  
    //           'defence': res[i].defence, 
    //           'dna': res[i].dna, 
    //           'playertype' : res[i].playertype,
    //           'isOffence' : res[i].isOffence,
    //           'isDefence' : res[i].isDefence,
    //           'isGoalie' : res[i].isGoalie,
    //           'teamId' : res[i].teamId,
    //           'teamLetter': res[i].teamLetter,
    //           'position' : res[i].position,
    //           'equippedJersey' : res[i].equippedJersey,
    //           'equippedStick' : res[i].equippedStick,
    //           'equippedToken' : res[i].equippedToken,
    //           'ageoutTimestamp': res[i].ageoutTimestamp,
    //           'draftTimestamp': res[i].draftTimestamp
    //           }) 
    //         if(res[i].playertype == 1 && res[i].teamId == 0){
    //           this.offenceFound = this.offenceFound+1
    //         }else if(res[i].playertype == 2 && res[i].teamId == 0){
    //           this.defenceFound = this.defenceFound+1
    //         }else if(res[i].playertype == 3 && res[i].teamId == 0){
    //           this.goaliesFound = this.goaliesFound+1
    //         }
    //       }
    //     }
    //     this.loadingPlayers = false
    //     console.log("Found " + this.offenceFound + " Offence")
    //     console.log("Found " + this.defenceFound + " Defence")
    //     console.log("Found " + this.goaliesFound + " Goalies")
    //     console.log(playerArray)
    //     return playerArray
          
    //   })
    //   .then(res => {

    //       this.totalFoundPlayers = res.length
    //       this.players = res
    //       this.displayTeam(res)
    //       this.updateBalanceViewer()
      
    //     })
    //     .catch((err) => {

    //       this.totalFoundPlayers = 0
    //       console.log("Rendering Players in My Players Error: " + err)
    //       console.log(err)
    //       this.players = null
    //     })
    // },

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

      async showIcoModal(){
                this.icoModalVisible=true;
      },

      async showAdminModal(){
        this.adminmodalVisble = true
      },

      async closeIcoModal(){
                this.icoModalVisible = false
                this.adminmodalVisble = false
                this.updateBalanceViewer()
                //this.getTeamMintCost()

      },



    async approveBuddyCoinSpend(approveAddress, valueToApprove){
      await main.approveBuddyCoinSpend(approveAddress, valueToApprove).then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    },

    async checkBuddiesAllowance(addressToCheck){
      await main.checkBuddiesAllowance(addressToCheck).then(res =>{
        console.log(res)
        this.approvedAmount = res
      })
    },

    async newPBXPtoTeamContract(amount){
      await main.newPBXPtoTeamContract(amount).then(res => {
        console.log(res)
        this.xpBalanceOnTeamContract = res
      })
    },

    async checkXPBalanceonTeamContract(){
      await main.checkXPBalanceonTeamContract().then(res => {
        console.log(res)
        this.xpBalanceOnTeamContract = res
      })
    },

    async checkPBPlayerAdmin() {
      await main.checkPBPlayerAdmin().then(res => {
        console.log("Is PBP Admin: " + res)
        this.isAdmin = res
      })
    },
    


    async loadCityAndNouns() {
            const cityNamesData = await main.getCityNames()
            const nounsData = await main.getNounNames()
            this.cityNames = cityNamesData
            this.nouns = nounsData

    },

    async addBuddiesToMetaMask(){
      await main.addBuddiesToMetaMask()
    },

    async getBudsAddress(){
      await main.getBudsAddress().then(res => {
        this.budsAddress = res
      })
    },

    async copyToClip(){
      //navigator.clipboard.writeText(this.budsAddress)
      const copyText = this.budsAddress
      const textArea = document.createElement('textarea')
      textArea.textContent = copyText
      document.body.append(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove();
      alert("Copied Buddies Address to Clipboard")
    },

    async getWeb3Accounts(){
      window.web3 = await Moralis.Web3.enable()
      web3.eth.getAccounts().then(res => {
        console.log(res)
      })
    }
  },
  mounted(){
    this.checkPBPlayerAdmin()
    this.loadCityAndNouns()
    // this.sendPlayerData()
    this.getBudsAddress()

  }
}

</script>

<style>
.nav-bar{

  background: linear-gradient(120deg, #244958, #985454);
  margin-bottom: 20px;
  box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
}

.coin-container{
    margin: 20px;
    display: flex;
    justify-content: center;

}
.coinbalancecard{
  margin: 10px;
  padding: 15px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.1);
    font-size: 1em;
    color: rgb(12, 185, 128);
    background: #fff;
    min-width: 120px;
  
}

#coin-balance{
    font-weight:bolder;
}

.buddies-coin{
  cursor: pointer;
}

.team-name-stats-container{
    
    display: flex;
    justify-content: center;
}

.tnsc-team-name{
   margin: 10px;
  padding: 15px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.1);
    font-size: 2em;
    color: rgb(12, 185, 128);
    background: #fff;
    min-width: 120px;
}

.tnsc-team-stats-container{
  height:125px;
  display: flex;
}

.tnsc-team-stat{
   margin: 10px;
  padding: 15px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.1);
    font-size: 1.5em;
    color: rgb(12, 185, 128);
    background: #fff;
    min-width: 120px;
}

.token-address{
  display: inline-block;
  font-size: 0.65em;
  padding: 3px;
  color: #fff;
  background-color: rgb(12, 185, 128);
  border-radius:5px;
}

.marketplace:hover{
  background-color: mediumpurple !important;
}

.mystuff:hover{
  background-color: rgb(12, 185, 128) !important;
}

.proshop:hover{
  background-color:steelblue !important;
}

.admin-button{
  font-size: 0.5em;
  background-color: tomato;
  color: #fff;
  height: 10px;
  border:none;
  border-radius: 5px;;
}

.ico-live-now-sm{
  margin-top:10px;
  margin-left: 10px;
  width: 200px;
    padding: 10px;
    cursor: pointer;
background: #fff;
border: none;
border-radius: 15px;
box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
transform: scale(1);
animation: pulse 2s infinite;

}

@keyframes pulse {
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
}
</style>
