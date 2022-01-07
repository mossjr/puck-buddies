<template>
  <div class="matchups">
      <h1>Available Matchups</h1>

<div>
  <img class="loadingicon" src="../assets/img/loading.gif" alt="loading" v-if="loadingItems">
  </div>
     

<div class="admin-area" v-if="adminShow">
       
</div>

<div v-if="foundActiveMatchups == 0 && !loadingItems"><h3>No Matchups Found</h3></div>

<div class="results-container" v-if="!loadingItems">
    <div class="items-container" >
    <div v-for="(matchup, index) in matchups" :key="index">
            <div class="matchup-card" v-if="matchup.active" > 
                <div>
                    <div>{{cityNames[matchup.teamCityNumber].city}} {{nouns[matchup.teamNounNumber].noun}} Matchup Id: {{matchup.matchupId}}</div>
                    <span>Offence Power: {{matchup.t1OStats}} - </span>
                    <span>Defensive Power: {{matchup.t1DStats}}</span>
                    <span>
                        <button v-if="!matchup.isMine" @click="openPvPTeamModal(matchup.buddiesAmount, matchup.matchupId)" id="proshop-action-button">HIT THE ICE!<br><b>{{matchup.buddiesAmount}} REWARD </b></button>
                        <button v-if="matchup.isMine" @click="cancelMatchup(matchup.matchupId)" id="proshop-cancel-button">Cancel Matchup (<b>{{matchup.buddiesAmount}} BUDS REWARD</b>)</button>
                    </span>
                </div>   

                
            </div>
    </div>

</div>

<div class="results-table">
    <div>
        <h1>My Created Matchup Results</h1>
    </div>
    <tr>
        <th class="results-row-header-items">Match Id</th>
        <th class="results-row-header-items">My Team OP</th>
        <th class="results-row-header-items">My Team DP</th>
        <th class="results-row-header-items">Challenger Team</th>
        <th class="results-row-header-items">Challenger OP</th>
        <th class="results-row-header-items">Challenger DP</th>
    </tr>
    
        <tr class="results-row" v-for="(matchup, index) in matchups.slice().reverse()" :key="index" >
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{matchup.matchupId}}</td>
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{matchup.t1OStats}}</td>
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{matchup.t1DStats}}</td>
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{cityNames[matchup.teamCityNumber].city}} {{nouns[matchup.teamNounNumber].noun}}</td>
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{matchup.t2OStats}}</td>
            <td v-if="matchup.isMine && !matchup.active" class="row-item" :class="{winnerrow: matchup.creatorIsWinner}">{{matchup.t2DStats}}</td>
        </tr>
        <div class="links"><a href="#">&laquo;</a> <a class="active" href="#">1</a> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">&raquo;</a></div> 
</div>

<div class="results-table">
    <div>
        <h1>My Challenged Matchup Results</h1>
    </div>
    <tr class="results-row-header">
        <th class="results-row-header-items">Match Id</th>
        <th class="results-row-header-items">My Team OP</th>
        <th class="results-row-header-items">My Team DP</th>
        <th class="results-row-header-items">Creator Team</th>
        <th class="results-row-header-items">Creator OP</th>
        <th class="results-row-header-items">Creator DP</th>
    </tr>
    
        <tr class="results-row" v-for="(matchup, index) in matchups.slice().reverse()" :key="index" >
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{matchup.matchupId}}</td>
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{matchup.t2OStats}}</td>
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{matchup.t2DStats}}</td>
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{cityNames[matchup.teamCityNumber].city}} {{nouns[matchup.teamNounNumber].noun}}</td>
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{matchup.t1OStats}}</td>
            <td v-if="matchup.isMyChallenge && !matchup.active" class="row-item" :class="{winnerrow: !matchup.creatorIsWinner}">{{matchup.t1DStats}}</td>
        </tr> 
        <div class="links"><a href="#">&laquo;</a> <a class="active" href="#">1</a> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">&raquo;</a></div> 
</div>

</div>



  </div>
  <div v-if="viewPvPTeamModal">
        <PvPTeamSelectorModal @closePvPTeamModal="closePvPTeamModal()" :matchupId="matchupId" :matchupReward="matchupReward" />
  </div>
   
</template>

<script>
import main from '../main.js'
import PvPTeamSelectorModal from "../components/PvPTeamSelectorModal.vue"


export default {
    components: { PvPTeamSelectorModal },

    data(){
        return{
            adminShow: false,
            foundMatchups: '',
            foundActiveMatchups: 0,
            loadingItems: true,
            isProShopAdmin: false,
            skutosend: 0,
            pricetosend: 0,
            howmanytocreate: 0,
            howmanytoupdate: 0,
            matchups:[],
            cityNames: [],
            nouns: [],
            totalFoundItems:'',
            proshopaddress:'',
            howmanytoburn: '',
            viewPvPTeamModal: false,
            matchupId:'',
            matchupReward:''
        }
    },

    methods:{

        async getAvailableMatcheups(){
            Promise.all(await main.getAvailableMatcheups())
            .then(res => {
               let matchupsArray = []
               for(let i = 0; i < res.length; i++){
                   //build a canvas here?
          let teamCityStarter = parseInt(res[i].teamDna.slice(1,4))
          let teamCityNumber = Math.floor((teamCityStarter/1000) * 529)
          let teamNounNumber = parseInt(res[i].teamDna.slice(5,8))
          //if(res[i].active == true){
              let isMine
              let isMyChallenge
              if(res[i].creator.toLowerCase() == ethereum.selectedAddress){
                  isMine = true
              }else{
                  isMine = false
              }
                if(res[i].challenger.toLowerCase() == ethereum.selectedAddress){
                  isMyChallenge = true
              }else{
                  isMyChallenge = false
              }
              if(res[i].active){
                  this.foundActiveMatchups++
              }
                matchupsArray.push({
                    'matchupId': res[i].matchupId,
                    't1OStats': res[i].t1OStats,
                    't1DStats': res[i].t1DStats,
                    't2OStats': res[i].t2OStats,
                    't2DStats': res[i].t2DStats,
                    'teamDna': res[i].teamDna,
                    'teamId': res[i].teamId,
                    'teamCityNumber': teamCityNumber,
                    'teamNounNumber': teamNounNumber,
                    'buddiesAmount': res[i].buddiesAmount,
                    'timestamp': res[i].timestamp,
                    'challenger': res[i].challenger,
                    'creator': res[i].creator,
                    'creatorIsWinner': res[i].creatorIsWinner,
                    'active': res[i].active,
                    'isMine': isMine,
                    'isMyChallenge': isMyChallenge
                   })
          //}
              
               }
               return matchupsArray
            }).then(res => {
                //console.log(res)
                this.loadingItems = false
                this.updateBalanceViewer()
                this.foundMatchups = res.length
                this.matchups = res
            })
            .catch(err => {
                //console.log(err)
                this.loadingItems = false
                this.updateBalanceViewer()
            })

        },

        async getTimestamp(){
            await main.getTimestamp()
            .catch(err => {
                //console.log(err)
            })
        },

        async getJSTimestamp(){
            let currentTime = Math.floor(Date.now() / 10 ** 3)
            //console.log(currentTime)
        },

        async loadCityAndNouns() {
            const cityNamesData = await main.getCityNames()
            const nounsData = await main.getNounNames()
            this.cityNames = cityNamesData
            this.nouns = nounsData

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

      async openPvPTeamModal(_matchupReward, _matchupId){
          //console.log(_matchupReward)
          //console.log(_matchupId)
          this.matchupReward = _matchupReward
          this.matchupId = _matchupId
          this.viewPvPTeamModal = !this.viewPvPTeamModal
      },

      async closePvPTeamModal(){
          this.viewPvPTeamModal = !this.viewPvPTeamModal
      },

      async cancelMatchup(matchId){
          await main.cancelMatchup(matchId).then(res => {
              this.getAvailableMatcheups()
              this.updateBalanceViewer()
          })
      }

    },

    mounted: function(){
        this.loadCityAndNouns()
        this.getAvailableMatcheups()
        this.updateBalanceViewer()
        this.updateXpBalanceViewer()
    }

}
</script>

<style>
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

.admin-pro-buttons {
  padding: 15px;
  margin: 10px;
  color: black;
  background: linear-gradient(100deg, #becec9, #6de29e);
  width: 60%;
  border-radius: 20px;
}

.items-container{
  display: flex;
  flex: 1;
  flex-direction: column;
  flex: 0 0 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 50px;
  
}

.matchup-card {
    display: flex;
    flex-grow: 4;
    flex-direction: row;
  flex-grow: 12;
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
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

.proshop-card:hover{
  box-shadow: 15px 15px 20px 0 rgba(0,0,0,0.5);

}

.proshop-img{
    width: 100%;
    margin-bottom: 10px;
    border-radius: 15px;

}

.outofstock{
    -webkit-filter: grayscale(85%); /* Ch 23+, Saf 6.0+, BB 10.0+ */
    filter: grayscale(85%); 
}

.item-qty{
    margin-bottom: 5px;
    font-size: large;
}

#proshop-outofstock-button{

width: 100%;
  height: 60px;
  border: none;
  background: rgb(165, 165, 165);
  color: rgb(216, 64, 64);
  border-radius: 10px;
  font-weight: bold;
  cursor:not-allowed;
  outline: none; 

}

#proshop-action-button{
    width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(11, 145, 100);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
}

#proshop-action-button:hover{
  background: rgb(12, 185, 128);  
}

#proshop-cancel-button{
    width: 100%;
  transition: 0.3s;
  height: 60px;
  border: none;
  background: rgb(145, 11, 11);
  color: #fff;
  border-radius: 10px;
  font-weight: bold;
}

#proshop-cancel-button:hover{
  background: rgb(185, 12, 12);  
}

.results-row-header-items{
    color: rgb(68, 68, 68);
    background-color: lightgray;
    width: 200px;
    padding: 5px;
}

.results-table{
    max-width:1200px;
    background-color: rgb(56, 56, 56);
    border-radius: 15px;
    padding:20px;
    margin-bottom:20px;
    margin-left: auto;
    margin-right: auto;
}

.row-item{
   width:200px;
   background-color: rgb(97, 36, 36);
   padding: 5px;
}
.winnerrow{
    color: rgb(68, 68, 68);
    font-weight: bolder;
    background: rgb(12, 185, 128);  
}


table, th, td {
  border: 1px solid black;
}

.links{
    margin:20px 0 0 0;
}

.links a{
    margin:20px 0 20px 0;
    background-color: lightgray;
    border-radius:10px;
    padding: 15px 20px 15px 20px ;
}

</style>