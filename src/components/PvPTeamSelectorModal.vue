<template>
<div class="backdrop" @click.self="closeModal">
    <div class="pvp-team-picker-modal">
         <div v-if="teamsFound == 0">
                <div>No Teams Found</div>
            </div>
        

        <div v-for="(team, index) in teams" :key="index">
        <div class="loading-icon-container">
            <img class="loadingicon" src="/public/assets/img/loading.gif" alt="loading" v-if="loadingPlayers && totalFoundPlayers > 0 ">
           
        </div>
            <div v-if="teamsFound != 0">Matchup Id: {{matchupId}} </div>
            <div class="team-name-container" v-if="teamsFound != 0">
                <div class="team-name"> {{team.teamId}}: The {{cityNames[team.teamCityNumber].city}} <i>{{nouns[team.teamNounNumber].noun}}</i></div>
            </div>
            <div class="team-stats">
                <div class="team-data">OP: {{team.opTotal}}</div>
                <div class="team-data">DP: {{team.dpTotal}}</div>
            </div>
            <div>
                <button class="green-button-close" @click="hitTheIcePvP(matchupReward,matchupId,team.teamId)">Play a PvP Matchup against with this team for {{matchupReward}} Buds</button>
            </div>
           
        </div>
            <div>
                <button class="pvpTeam-button" @click="closeModal()">Cancel</button>
            </div>
    </div>
</div>          
</template>

<script>
import main from '../main.js'
import buildCanvas from '../scripts/buildPlayer.js'

export default {
    data(){
        return{
        teams: [],
        teamsFound:'',
        players: [],
        matches: {},
        pageTeamId:'',
        totalFoundPlayers: 0,
        offenceFound: 0,
        defenceFound: 0,
        goaliesFound: 0,
        loadingTeams: true,
        playersLoaded: false,
        totalTeamsFound: 0,
        showAssignModal: false,
        showNewPvPmodal: false,
        modalTeam: '',
        modalPosition: '',
        modalPosName: '',
        modalPlayerType: '',
        modalPvPOP:'',
        modalPvPDP:'',
        modalTeamDNA:'',
        cityNames: [],
        nouns: [],
        teamDna: '',
        buddiesReward:''.id,
        matchesLoaded: false,
        matchesLoading: false,
        PBXPqtyToMint: '',
        myFunds:'',
        myXp:'',
        timestamp:0,
        hourtimestamp:0,
        secondsTillChange:0,
        minsTillChange:0,
        secLessMinsTillChange:0,
        progressPercent1:'',
        progressPercent2:'',
        progressPercent3:'',
        activeTo1:'',
        activeTo2:'',
        activeTo3:'',
        maxActiveTo:'',
        progressColor1:'',
        progressColor2:'',
        progressColor3:'',
        lockMatchups30s:false
        }
    },

    props: ['matchupId',
            'matchupReward'],
    methods: {

        async displayTeam(playerArray){
      Promise.all(await main.displayTeam())
      .then(res => {
        //console.log("Result: " + res)
        //console.log(res)
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
          //console.log(pos1id + " " + pos2id + " " + pos3id + " " + pos4id + " " + pos5id + " " + pos6id)
          //console.log(pos1OP + " " + pos2OP + " " + pos3OP + " " + pos4OP + " " + pos5OP + " " + pos6OP)
          //console.log(pos1DP + " " + pos2DP + " " + pos3DP + " " + pos4DP + " " + pos5DP + " " + pos6DP)


          let opTotal = Number(pos1OP) + Number(pos2OP) + Number(pos3OP) + Number(pos4OP) + Number(pos5OP) + Number(pos6OP)
          let dpTotal = Number(pos1DP) + Number(pos2DP) + Number(pos3DP) + Number(pos4DP) + Number(pos5DP) + Number(pos6DP)

          let teamCityStarter = parseInt(res[i].teamDna.slice(1,4))
          let teamCityNumber = Math.floor((teamCityStarter/1000) * 529)
          let teamNounNumber = parseInt(res[i].teamDna.slice(5,8))
          
          let teamName = this.nouns[teamNounNumber].noun
          let teamLetter = teamName.slice(0,1)        
          //console.log(teamLetter)

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
            'playerPos2': pos2id,
            'playerPos2OP': pos2OP,
            'playerPos2DP': pos2DP,
            'playerPos3': pos3id,
            'playerPos3OP': pos3OP,
            'playerPos3DP': pos3DP,
            'playerPos4': pos4id,
            'playerPos4OP': pos4OP,
            'playerPos4DP': pos4DP,
            'playerPos5': pos5id,
            'playerPos5OP': pos5OP,
            'playerPos5DP': pos5DP,
            'playerPos6': pos6id,
            'playerPos6OP': pos6OP,
            'playerPos6DP': pos6DP,
            'opTotal': opTotal,
            'dpTotal': dpTotal
          })
        }
        
        this.loadingTeams = false
        return {teamArray: teamArray, players: playerArray }
      })
      .then(res2 => {
        let res = res2.teamArray
        for (let i = 0; i < res2.players.length; i++){
         buildCanvas.preloadPlayerInfo(res2.players[i].id, res2.players[i], "player-no")
        }
        this.totalTeamsFound = res.length
        this.teams = res
        this.teamsFound = res.length
        this.playersLoaded = true
        //this.loadPvCmatches(res2.teamArray[0].teamId)
        this.pageTeamId = res2.teamArray[0].teamId
      })
      .catch((err) => {
        //console.log("Error rendering Teams: " + err)
        //console.log(err)
        this.totalTeamsFound = 0
        this.teams = null
        this.playersLoaded = true
      })
    },

     async sendPlayerData() {
      this.totalFoundPlayers = 0
      this.offenceFound = 0
      this.defenceFound = 0
      this.goaliesFound = 0
      let playerArray = [] 
      Promise.all(await main.loadPBPlayers())
      .then(res => {
        //console.log("Result: " + res)
        if (res.length == 0) {
          //console.log("0 Players Found")
          this.totalFoundPlayers = 0
        }else{  
        for (let i = 0; i < res.length; i++) {
            
            playerArray.push({
              'id': res[i].id, 
              'offence': res[i].offence,  
              'defence': res[i].defence, 
              'dna': res[i].dna, 
              'playertype' : res[i].playertype,
              'isOffence' : res[i].isOffence,
              'isDefence' : res[i].isDefence,
              'isGoalie' : res[i].isGoalie,
              'teamId' : res[i].teamId,
              'teamLetter': res[i].teamLetter,
              'position' : res[i].position,
              'equippedJersey' : res[i].equippedJersey,
              'equippedStick' : res[i].equippedStick,
              'equippedToken' : res[i].equippedToken
              }) 
            if(res[i].playertype == 1 && res[i].teamId == 0){
              this.offenceFound = this.offenceFound+1
            }else if(res[i].playertype == 2 && res[i].teamId == 0){
              this.defenceFound = this.defenceFound+1
            }else if(res[i].playertype == 3 && res[i].teamId == 0){
              this.goaliesFound = this.goaliesFound+1
            }
          }
        }
        this.loadingPlayers = false
        //console.log("Found " + this.offenceFound + " Offence")
        //console.log("Found " + this.defenceFound + " Defence")
        //console.log("Found " + this.goaliesFound + " Goalies")
        return playerArray
          
      })
      .then(res => {

          this.totalFoundPlayers = res.length
          this.players = res
          this.displayTeam(res)
          //this.updateBalanceViewer()
      
        })
        .catch((err) => {

          this.totalFoundPlayers = 0
          //console.log("Rendering Players in My Players Error: " + err)
          //console.log(err)
          this.players = null
        })
    },



    async hitTheIcePvP(reward, pvpmatchupId, chalTeamId){
            //console.log(reward)
            //console.log(pvpmatchupId)
            //console.log(chalTeamId)
            await main.hitTheIcePvP(reward, pvpmatchupId, chalTeamId).then(res =>{
                this.closeModal()
            })
            .catch(err => {
                //console.log(err)
            })
        },


    async loadCityAndNouns() {
            const cityNamesData = await main.getCityNames()
            const nounsData = await main.getNounNames()
            this.cityNames = cityNamesData
            this.nouns = nounsData

    },

    closeModal() {
        this.$emit('closePvPTeamModal')
    },

    },



    mounted: function(){
        this.loadCityAndNouns()
        this.sendPlayerData()
    }
}
</script>


<style>
.backdrop {
    backdrop-filter: blur(5px);
    top:0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}

.pvp-team-picker-modal{
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

.team-name{
  background: linear-gradient(180deg, rgb(255, 255, 255), rgb(207, 207, 207));
  font-size: 3em;
  width: 80%;
  max-width: 640px;
  margin: 20px;
  padding: 10px;
  border-radius: 18px;
  box-shadow: 5px 5px 15px 0 rgba(0,0,0,0.4);
  transition: 0.3s ease;
  color: black;
  text-align: center;
  justify-content: center;
}

.team-stats{
  display: flex;
  flex: 0 0 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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

.pvpTeam-button{
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

.pvpTeam-button:hover{
      box-shadow: 5px 5px 5px 0 rgba(0,0,0,0.3);
  transform: scale(1.05);
  background: rgb(12, 185, 128);
}

.pvpTeam-button:focus{
    outline: none;
 border: none;
  background: rgb(12, 185, 128);
}


</style>